import type { UserProfile } from '../types/api'

export function getDisplayName(fullName?: string) {
  const name = fullName?.trim()

  if (!name) {
    return 'Usuario Sonnda'
  }

  const parts = name.split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).join(' ')
}

export function getDisplayRole(userProfile: UserProfile | null) {
  const rawRole =
    userProfile?.role ??
    userProfile?.account_type ??
    userProfile?.user_role ??
    userProfile?.profile_type

  if (typeof rawRole !== 'string' || !rawRole.trim()) {
    return 'Paciente'
  }

  return rawRole
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function getInitials(displayName: string) {
  return displayName
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
}
