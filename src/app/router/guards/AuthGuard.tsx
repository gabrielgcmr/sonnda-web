// src/app/router/guards/AuthGuard.tsx
import { Navigate, Outlet } from 'react-router-dom'
import AuthErrorScreen from '../../../features/auth/components/AuthErrorScreen'
import AuthLoadingScreen from '../../../features/auth/components/AuthLoadingScreen'
import { useAuth } from '../../../features/auth/hooks/useAuth'
import { getRouteRedirect, type RouteAccess } from './routeAccess'

function AuthGuard({ access }: { access: RouteAccess }) {
  const { loading, authError, isAuthenticated, userProfile } = useAuth()

  if (loading) return <AuthLoadingScreen />
  if (authError) return <AuthErrorScreen />

  const redirect = getRouteRedirect(access, { isAuthenticated, hasProfile: Boolean(userProfile) })
  return redirect ? <Navigate to={redirect} replace /> : <Outlet />
}

export default AuthGuard
