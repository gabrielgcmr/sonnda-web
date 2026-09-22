// src/app/router/index.tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ConfirmEmailPage from '../../pages/ConfirmEmailPage/ConfirmEmailPage'
import LoginPage from '../../pages/LoginPage/LoginPage'
import OnboardingPage from '../../pages/OnboardingPage/OnboardingPage'
import PatientsPage from '../../pages/PatientsPage/PatientsPage'
import RegisterPage from '../../pages/RegisterPage/RegisterPage'
import AppLayout from '../layouts/AppLayout'
import AuthLayout from '../layouts/AuthLayout'
import AuthGuard from './guards/AuthGuard'
import { routes } from './routes'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.root} element={<AuthGuard access="root" />} />
        <Route element={<AuthGuard access="guest" />}>
          <Route element={<AuthLayout />}>
            <Route path={routes.login} element={<LoginPage />} />
            <Route path={routes.register} element={<RegisterPage />} />
            <Route path={routes.confirmEmail} element={<ConfirmEmailPage />} />
          </Route>
        </Route>
        <Route element={<AuthGuard access="onboarding" />}>
          <Route element={<AuthLayout />}>
            <Route path={routes.onboarding} element={<OnboardingPage />} />
          </Route>
        </Route>
        <Route element={<AuthGuard access="profiled" />}>
          <Route path={routes.patients} element={<AppLayout />}>
            <Route index element={<PatientsPage />} />
            <Route path="*" element={<Navigate to={routes.patients} replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={routes.root} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
