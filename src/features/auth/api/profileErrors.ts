// src/features/auth/api/profileErrors.ts
import { ApiError } from '../../../services/api/errors'

export function isProfileNotFoundError(error: unknown) {
  return error instanceof ApiError &&
    error.status === 403 &&
    error.problem?.code === 'PROFILE_NOT_FOUND'
}
