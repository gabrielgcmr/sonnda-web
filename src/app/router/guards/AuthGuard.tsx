// src/app/router/guards/AuthGuard.tsx
import { Navigate, Outlet } from 'react-router-dom'
import AccountErrorScreen from '../../../features/account/components/AccountErrorScreen'
import AuthLoadingScreen from '../../../features/auth/components/AuthLoadingScreen'
import { useAuth } from '../../../features/auth/hooks/useAuth'
import { useAccount } from '../../../features/account/hooks/useAccount'
import { getRouteRedirect, type RouteAccess } from './routeAccess'

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
