import { useState } from 'react'
import type { AuthError } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

function LoginPage() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Informe email e senha.')
      return
    }

    setErrorMessage(null)

    try {
      await login({
        email: email.trim(),
        password,
      })
    } catch (error) {
      if ((error as AuthError).message) {
        setErrorMessage((error as AuthError).message)
        return
      }

      setErrorMessage('Nao foi possivel entrar. Tente novamente.')
    }
  }

  return (
    <main className="shell shell-centered">
      <section className="auth-layout">
        <div className="auth-copy">
          <span className="eyebrow">Supabase Auth</span>
          <h1>Entre com email e senha</h1>
          <p className="muted">
            O token de acesso do Supabase sera anexado automaticamente em toda
            chamada para a API da Sonnda.
          </p>
        </div>
        <form className="panel panel-compact auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
            />
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Senha"
            />
          </label>

          {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}

          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="muted auth-footnote">
            Ainda nao tem conta?{' '}
            <Link className="text-link" to="/register">
              Criar conta
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
