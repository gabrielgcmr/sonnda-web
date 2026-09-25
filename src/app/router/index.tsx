// src/app/router/index.tsx
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import ConfirmEmailPage from '../../features/auth/ConfirmEmailPage'
import LoginPage from '../../features/auth/LoginPage'
import OnboardingPage from '../../features/account/onboarding/OnboardingPage'
import PatientsPage from '../../features/patient/search/PatientsPage'
import PatientDetailPage from '../../features/patient/PatientDetailPage'
import RegisterPage from '../../features/auth/RegisterPage'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import AuthGuard from './guards/AuthGuard'
import { AuthRoutes } from '../../features/auth/authRoutes'
import { AccountRoutes } from '../../features/account/accountRoutes'
import { useAuth } from '../../features/auth/useAuth'
import { useAccount } from '../../features/account/useAccount'
import { PatientRoutes } from '../../features/patient/patientRoutes'

function ApplicationRoutes() {
  const navigate = useNavigate()
  const { session, logout } = useAuth()
  const { userProfile } = useAccount()

  return (
    <Routes>
      <Route path="/" element={<AuthGuard access="root" />} />
      <Route element={<AuthGuard access="guest" />}>
        <Route element={<AuthLayout />}>
          <Route path={AuthRoutes.login} element={<LoginPage />} />
          <Route
            path={AuthRoutes.register}
            element={<RegisterPage onAuthenticated={() => navigate('/', { replace: true })} />}
          />
          <Route path={AuthRoutes.confirmEmail} element={<ConfirmEmailPage />} />
        </Route>
      </Route>
      <Route element={<AuthGuard access="onboarding" />}>
        <Route element={<AuthLayout />}>
          <Route
            path={AccountRoutes.onboarding}
            element={
              <OnboardingPage
                email={session?.user.email}
                onLogout={logout}
                onCompleted={() => navigate(PatientRoutes.search, { replace: true })}
              />
            }
          />
        </Route>
      </Route>
      <Route element={<AuthGuard access="profiled" />}>
        <Route path={PatientRoutes.search} element={<AppLayout />}>
          <Route index element={<PatientsPage profileId={userProfile?.id} />} />
          <Route path="patients/:patientId" element={<PatientDetailPage />} />
          <Route path="*" element={<Navigate to={PatientRoutes.search} replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function AppRouter() {
  return (
    <BrowserRouter>
      <ApplicationRoutes />
    </BrowserRouter>
  )
}

export default AppRouter
