import { Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import AppHeader from '../shared/ui/AppHeader'
import { getDisplayName, getDisplayRole } from '../shared/utils/userDisplay'

function ProtectedLayout() {
  const { logout, session, userProfile } = useAuth()
  const displayName = getDisplayName(userProfile?.full_name)
  const displayRole = getDisplayRole(userProfile)

  return (
    <main className="shell">
      <section className="panel">
        <AppHeader
          displayName={displayName}
          displayRole={displayRole}
          email={session?.user.email ?? 'usuario autenticado'}
          onLogout={logout}
        />
        <Outlet />
      </section>
    </main>
  )
}

export default ProtectedLayout
