// src/features/auth/login/LoginPage.tsx
import { Link } from 'react-router-dom'
import { AuthRoutes } from '../authRoutes'
import LoginForm from './LoginForm'

function LoginPage() {
  return (
    <>
      <div className="auth-copy">
        <span className="eyebrow">Supabase Auth</span>
        <h1>Entre com email e senha</h1>
        <p className="muted">
          O token de acesso do Supabase sera anexado automaticamente em toda
          chamada para a API da Sonnda.
        </p>
      </div>
      <LoginForm>
        <p className="muted auth-footnote">
          Ainda nao tem conta?{' '}
          <Link className="text-link" to={AuthRoutes.register}>Criar conta</Link>
        </p>
      </LoginForm>
    </>
  )
}

export default LoginPage
