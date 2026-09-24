// src/features/auth/login/LoginForm.tsx
import { useState, type PropsWithChildren } from 'react'
import type { AuthError } from '@supabase/supabase-js'
import { useAuth } from '../hooks/useAuth'

function LoginForm({ children }: PropsWithChildren) {
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

      {children}
    </form>
  )
}

export default LoginForm
