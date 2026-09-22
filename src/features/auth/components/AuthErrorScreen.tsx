// src/features/auth/components/AuthErrorScreen.tsx
import { useAuth } from '../hooks/useAuth'

function AuthErrorScreen() {
  const { authError, logout, retryBootstrap } = useAuth()

  return (
    <main className="shell shell-centered">
      <section className="panel panel-compact">
        <span className="eyebrow">Falha de bootstrap</span>
        <h1>Nao foi possivel carregar sua conta</h1>
        <p className="error-banner">{authError}</p>
        <div className="actions-row">
          <button className="button button-primary" onClick={() => void retryBootstrap()}>
            Tentar novamente
          </button>
          <button className="button button-secondary" onClick={() => void logout()}>
            Sair
          </button>
        </div>
      </section>
    </main>
  )
}


export default AuthErrorScreen
