// src/app/layouts/AppLayout.tsx
import { Link, Outlet, useMatch } from 'react-router-dom'
import { useAccount } from '../../features/account/useAccount'
import { useAuth } from '../../features/auth/useAuth'
import { PatientRoutes } from '../../features/patient/patientRoutes'
import AppHeader from './AppHeader'
import { getDisplayName, getDisplayRole } from '../../features/account/profile/userDisplayName'
import './AppLayout.css'

function AppLayout() {
  const { logout, session } = useAuth()
  const { userProfile } = useAccount()
  const displayName = getDisplayName(userProfile?.full_name)
  const displayRole = getDisplayRole(userProfile)
  const isPatientDetail = useMatch(`${PatientRoutes.details}/:patientId`)

  return (
    <div className="protected-layout">
      <AppHeader
        displayName={displayName}
        displayRole={displayRole}
        userProfile={userProfile}
        email={session?.user.email ?? 'usuario autenticado'}
        onLogout={logout}
      />
      {isPatientDetail && (
        <nav className="shell protected-layout__navigation" aria-label="Navegação da página">
          <div className="protected-layout__navigation-inner">
            <Link className="text-link" to={PatientRoutes.search}>Voltar para pacientes</Link>
          </div>
        </nav>
      )}
      <main className={`shell protected-layout__main${isPatientDetail ? ' protected-layout__main--detail' : ''}`}>
        <div className="panel">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
