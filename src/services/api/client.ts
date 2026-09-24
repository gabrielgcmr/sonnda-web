// src/services/api/client.ts
import { supabase } from '../integrations/supabaseClient'
import { env } from '../../config/env'
import { ApiError, normalizeProblem } from './errors'

type RequestOptions = RequestInit & {
  skipAuth?: boolean
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
