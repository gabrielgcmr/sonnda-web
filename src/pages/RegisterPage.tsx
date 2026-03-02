import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
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

      if (result.emailConfirmationRequired) {
        const searchParams = new URLSearchParams({
          email: result.email,
        })

        navigate(`/confirm-email?${searchParams.toString()}`, {
          replace: true,
        })
        return
      }

      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
        return
      }

      setErrorMessage('Nao foi possivel criar sua conta.')
    }
  }

  return (
    <main className="shell shell-centered">
      <section className="auth-layout">
        <div className="auth-copy">
          <span className="eyebrow">Criar conta</span>
          <h1>Cadastre seu acesso</h1>
          <p className="muted">
            Primeiro voce cria a credencial no Supabase. Depois de confirmar o
            email, o primeiro login leva voce para o onboarding.
          </p>
        </div>

        <div className="panel panel-compact">
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

            <p className="muted auth-footnote">
              Ja tem uma conta?{' '}
              <Link className="text-link" to="/login">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage
