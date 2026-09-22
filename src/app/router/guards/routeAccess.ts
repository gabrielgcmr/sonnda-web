// src/app/router/guards/routeAccess.ts
import { routes } from '../routes'

export type RouteAccess = 'root' | 'guest' | 'onboarding' | 'profiled'

type AccountState = {
  isAuthenticated: boolean
  hasProfile: boolean
}

export function getRouteRedirect(access: RouteAccess, { isAuthenticated, hasProfile }: AccountState) {
  if (access === 'guest') {
    return isAuthenticated ? (hasProfile ? routes.patients : routes.onboarding) : null
  }
  if (!isAuthenticated) return routes.login
  if (access === 'onboarding') return hasProfile ? routes.patients : null
  if (!hasProfile) return routes.onboarding
  return access === 'root' ? routes.patients : null
}
