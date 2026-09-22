// src/app/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import AppHeader from '../../components/common/AppHeader'
import { getDisplayName, getDisplayRole } from '../../features/auth/utils/userDisplayName'
import './AppLayout.css'

function AppLayout() {
  const { logout, session, userProfile } = useAuth()
  const displayName = getDisplayName(userProfile?.full_name)
  const displayRole = getDisplayRole(userProfile)

  return (
    <div className="protected-layout">
      <AppHeader
        displayName={displayName}
        displayRole={displayRole}
        userProfile={userProfile}
        email={session?.user.email ?? 'usuario autenticado'}
        onLogout={logout}
      />
      <main className="shell protected-layout__main">
        <div className="panel">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
