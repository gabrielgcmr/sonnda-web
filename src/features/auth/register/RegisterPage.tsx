// src/features/auth/register/RegisterPage.tsx
import { Link, useNavigate } from 'react-router-dom'
import { AuthRoutes } from '../authRoutes'
import RegisterForm from '../components/RegisterForm'
import type { SignUpResult } from '../types'

function RegisterPage({ onAuthenticated }: { onAuthenticated: () => void }) {
  const navigate = useNavigate()

  function handleRegistered(result: SignUpResult) {
    if (result.emailConfirmationRequired) {
      const searchParams = new URLSearchParams({ email: result.email })
      navigate(AuthRoutes.confirmEmail + '?' + searchParams.toString(), { replace: true })
      return
    }
    onAuthenticated()
  }

  return (
    <>
      <div className="auth-copy">
        <span className="eyebrow">Criar conta</span>
        <h1>Cadastre seu acesso</h1>
        <p className="muted">
          Primeiro voce cria a credencial no Supabase. Depois de confirmar o
          email, o primeiro login leva voce para o onboarding.
        </p>
      </div>
      <div className="panel panel-compact">
        <RegisterForm onRegistered={handleRegistered}>
          <p className="muted auth-footnote">
            Ja tem uma conta?{' '}
            <Link className="text-link" to={AuthRoutes.login}>Entrar</Link>
          </p>
        </RegisterForm>
      </div>
    </>
  )
}

export default RegisterPage
