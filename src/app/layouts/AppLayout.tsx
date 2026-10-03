// src/app/layouts/AppLayout.tsx
import { Link, Outlet, useMatch } from 'react-router-dom'
import { useAccount } from '../../features/account/useAccount'
import { useAuth } from '../../features/auth/useAuth'
import { PatientRoutes } from '../../features/patient/patientRoutes'
import AppHeader from './AppHeader'
import { getDisplayName, getDisplayRole } from '../../features/account/profile/userDisplayName'

function AppLayout() {
  const { logout, session } = useAuth()
  const { userProfile } = useAccount()
  const displayName = getDisplayName(userProfile?.full_name)
  const displayRole = getDisplayRole(userProfile)
  const isPatientDetail = useMatch(`${PatientRoutes.details}/:patientId`)

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        displayName={displayName}
        displayRole={displayRole}
        userProfile={userProfile}
        email={session?.user.email ?? 'usuario autenticado'}
        onLogout={logout}
      />
      {isPatientDetail && (
        <nav className="min-h-0 border-b border-[color-mix(in_srgb,var(--app-accent)_24%,transparent)] bg-(--app-surface-raised) px-4 py-[0.4rem] min-[901px]:px-8" aria-label="Navegação da página">
          <div className="mx-auto w-full max-w-250">
            <Link className="text-link" to={PatientRoutes.search}>Voltar para pacientes</Link>
          </div>
        </nav>
      )}
      <main className={`min-h-0 flex-1 p-4 min-[901px]:p-8${isPatientDetail ? ' pt-3' : ''}`}>
        <div className={`panel mx-auto${isPatientDetail ? ' pt-5!' : ''}`}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
