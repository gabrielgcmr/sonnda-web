// src/app/router/guards/AuthGuard.tsx
import { Navigate, Outlet } from 'react-router-dom'

import AuthLoadingScreen from '../../../features/auth/AuthLoadingScreen'
import { useAuth } from '../../../features/auth/useAuth'
import { useAccount } from '../../../features/account/useAccount'
import { getRouteRedirect, type RouteAccess } from './routeAccess'
import AccountErrorScreen from '@/features/account/AccountErrorScreen'

function AuthGuard({ access }: { access: RouteAccess }) {
  const auth = useAuth()
  const account = useAccount()

  if (auth.loading) return <AuthLoadingScreen />
  if (auth.authError) return <AccountErrorScreen message={auth.authError} onRetry={auth.retryBootstrap} onLogout={auth.logout} />
  if (auth.isAuthenticated && account.loading) return <AuthLoadingScreen />
  if (auth.isAuthenticated && account.accountError) return <AccountErrorScreen message={account.accountError} onRetry={account.retryProfile} onLogout={auth.logout} />

  const redirect = getRouteRedirect(access, { isAuthenticated: auth.isAuthenticated, hasProfile: Boolean(account.userProfile) })
  return redirect ? <Navigate to={redirect} replace /> : <Outlet />
}

export default AuthGuard
