import { supabase } from './supabaseClient'
import { env } from './env'

type ProblemViolation = {
  field?: string
  reason?: string
}

export type ProblemDetails = {
  type: string
  title: string
  status: number
  detail: string
  instance?: string
  code: string
  traceId?: string
  timestamp?: string
  violations?: ProblemViolation[]
}

type RequestOptions = RequestInit & {
  skipAuth?: boolean
}

export class ApiError extends Error {
  status: number
  problem: ProblemDetails | null
  fieldErrors: Record<string, string>

  constructor(message: string, status: number, problem: ProblemDetails | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
    this.fieldErrors =
      problem?.violations?.reduce<Record<string, string>>((errors, violation) => {
        if (violation.field && violation.reason) {
          errors[violation.field] = violation.reason
        }

        return errors
      }, {}) ?? {}
  }
}

async function readResponseBody(response: Response) {
  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
    return response.json()
  }

  const text = await response.text()
  return text ? { detail: text } : null
}

function normalizeProblem(response: Response, body: unknown) {
  if (body && typeof body === 'object' && 'type' in body && 'title' in body && 'status' in body) {
    return body as ProblemDetails
  }

  const detail =
    body && typeof body === 'object' && 'detail' in body && typeof body.detail === 'string'
      ? body.detail
      : response.statusText || 'Request failed'

  return {
    type: 'about:blank',
    title: response.statusText || 'Request failed',
    status: response.status,
    detail,
    code: response.status === 404 ? 'RESOURCE_NOT_FOUND' : 'UNKNOWN_ERROR',
  } satisfies ProblemDetails
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const { skipAuth = false, headers, ...rest } = options
  const requestHeaders = new Headers(headers)

  if (!requestHeaders.has('Content-Type') && rest.body) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (!skipAuth) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session?.access_token) {
      requestHeaders.set('Authorization', `Bearer ${session.access_token}`)
    }
  }

  const response = await fetch(
    path.startsWith('http') ? path : `${env.browserApiBaseUrl}${path}`,
    {
      ...rest,
      headers: requestHeaders,
    },
  )

  const body = await readResponseBody(response)

  if (!response.ok) {
    const problem = normalizeProblem(response, body)
    throw new ApiError(problem.detail, response.status, problem)
  }

  return body as T
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
}

function normalizeText(value?: string) {
  if (!value) {
    return ''
  }

  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function isProfileNotFoundError(error: unknown) {
  if (!(error instanceof ApiError)) {
    return false
  }

  const normalizedCode = normalizeText(error.problem?.code)
  const normalizedTitle = normalizeText(error.problem?.title)
  const normalizedDetail = normalizeText(error.problem?.detail)
  const isOnboardingAccessDenied =
    error.status === 403 &&
    normalizedCode === 'access_denied' &&
    normalizedDetail === 'cadastro necessario'

  return (
    error.status === 404 ||
    isOnboardingAccessDenied ||
    normalizedCode === 'resource_not_found' ||
    normalizedCode === 'cadastro_necessario' ||
    normalizedCode === 'onboarding_required' ||
    normalizedTitle.includes('cadastro necessario') ||
    normalizedDetail.includes('cadastro necessario')
  )
}
