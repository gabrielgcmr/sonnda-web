// src/services/api/errors.ts
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

export function normalizeProblem(response: Response, body: unknown) {
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
