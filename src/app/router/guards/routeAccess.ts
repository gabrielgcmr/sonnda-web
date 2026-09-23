// src/app/router/guards/routeAccess.ts
import { AuthRoutes } from '../../../features/auth/authRoutes'
import { AccountRoutes } from '../../../features/account/accountRoutes'
import { PatientRoutes } from '../../../features/patient/patientRoutes'

export type RouteAccess = 'root' | 'guest' | 'onboarding' | 'profiled'

type AccountState = {
  isAuthenticated: boolean
  hasProfile: boolean
}

export function getRouteRedirect(access: RouteAccess, { isAuthenticated, hasProfile }: AccountState) {
  if (access === 'guest') {
    return isAuthenticated ? (hasProfile ? PatientRoutes.search : AccountRoutes.onboarding) : null
  }
  if (!isAuthenticated) return AuthRoutes.login
  if (access === 'onboarding') return hasProfile ? PatientRoutes.search : null
  if (!hasProfile) return AccountRoutes.onboarding
  return access === 'root' ? PatientRoutes.search : null
}
