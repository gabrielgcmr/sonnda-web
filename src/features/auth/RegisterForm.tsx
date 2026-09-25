// src/features/auth/register/RegisterForm.tsx
import { useState, type PropsWithChildren } from 'react'
import { useAuth } from './useAuth'
import type { SignUpResult } from './types'

type RegisterFormProps = PropsWithChildren<{ onRegistered: (result: SignUpResult) => void }>

function RegisterForm({ children, onRegistered }: RegisterFormProps) {
  const { signUp, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = email.trim()

    if (!normalizedEmail || !password || !confirmPassword) {
      setErrorMessage('Preencha email, senha e confirmacao de senha.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas nao conferem.')
      return
    }

    setErrorMessage(null)

    try {
      const result = await signUp({
        email: normalizedEmail,
        password,
      })

      onRegistered(result)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage('Nao foi possivel criar sua conta.')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="field-group">
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimo de 8 caracteres"
          />
        </label>

        <label className="field">
          <span>Confirmar senha</span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repita sua senha"
          />
        </label>
      </div>

      {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}

      <button className="button button-primary" type="submit" disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>

      {children}
    </form>
  )
}

export default RegisterForm
