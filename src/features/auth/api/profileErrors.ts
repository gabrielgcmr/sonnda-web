// src/features/auth/api/profileErrors.ts
import { ApiError } from '../../../services/api/errors'

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
