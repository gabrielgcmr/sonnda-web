import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthProvider'
import { useAuth } from '../features/auth/useAuth'
import AppHomePage from '../pages/AppHomePage'
import ConfirmEmailPage from '../pages/ConfirmEmailPage'
import LoginPage from '../pages/LoginPage'
import OnboardingPage from '../pages/OnboardingPage'
import RegisterPage from '../pages/RegisterPage'

function AuthLoadingScreen() {
  return (
    <main className="shell shell-centered">
      <section className="panel panel-compact">
        <span className="eyebrow">Autenticando</span>
        <h1>Carregando sua sessao</h1>
        <p className="muted">
          Validando o token do Supabase e sincronizando seu perfil com a API da
          Sonnda.
        </p>
      </section>
    </main>
  )
}

function AuthErrorScreen() {
  const { authError, logout, retryBootstrap } = useAuth()

  return (
    <main className="shell shell-centered">
      <section className="panel panel-compact">
        <span className="eyebrow">Falha de bootstrap</span>
        <h1>Nao foi possivel carregar sua conta</h1>
        <p className="error-banner">{authError}</p>
        <div className="actions-row">
          <button className="button button-primary" onClick={() => void retryBootstrap()}>
            Tentar novamente
          </button>
          <button className="button button-secondary" onClick={() => void logout()}>
            Sair
          </button>
        </div>
      </section>
    </main>
  )
}

function RootRedirect() {
  const { loading, authError, isAuthenticated, userProfile } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (authError) {
    return <AuthErrorScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!userProfile) {
    return <Navigate to="/onboarding" replace />
  }

  return <Navigate to="/app" replace />
}

function GuestOnlyRoute() {
  const { loading, authError, isAuthenticated, userProfile } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (authError) {
    return <AuthErrorScreen />
  }

  if (isAuthenticated) {
    return <Navigate to={userProfile ? '/app' : '/onboarding'} replace />
  }

  return <Outlet />
}

function OnboardingOnlyRoute() {
  const { loading, authError, isAuthenticated, userProfile } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (authError) {
    return <AuthErrorScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (userProfile) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}

function ProfiledOnlyRoute() {
  const { loading, authError, isAuthenticated, userProfile } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (authError) {
    return <AuthErrorScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!userProfile) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}

function AppShell() {
  const { logout, session, userProfile } = useAuth()

  return (
    <main className="shell">
      <section className="panel">
        <header className="topbar">
          <div>
            <span className="eyebrow">Area protegida</span>
            <h1>{userProfile?.full_name ?? 'Sonnda'}</h1>
            <p className="muted">
              Sessao ativa para {session?.user.email ?? 'usuario autenticado'}.
            </p>
          </div>
          <button className="button button-secondary" onClick={() => void logout()}>
            Sair
          </button>
        </header>
        <Outlet />
      </section>
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route element={<GuestOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          </Route>
          <Route element={<OnboardingOnlyRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>
          <Route element={<ProfiledOnlyRoute />}>
            <Route path="/app" element={<AppShell />}>
              <Route index element={<AppHomePage />} />
              <Route path="*" element={<Navigate to="/app" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
