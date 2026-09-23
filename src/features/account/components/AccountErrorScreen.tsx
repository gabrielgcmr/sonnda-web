// src/features/account/components/AccountErrorScreen.tsx
type Props = {
  message: string
  onRetry: () => Promise<void>
  onLogout: () => Promise<void>
}

function AccountErrorScreen({ message, onRetry, onLogout }: Props) {
  return (
    <main className="shell shell-centered">
      <section className="panel panel-compact">
        <h1>Nao foi possivel carregar sua conta</h1>
        <p className="error-banner">{message}</p>
        <div className="actions-row">
          <button className="button button-primary" onClick={() => void onRetry()}>Tentar novamente</button>
          <button className="button button-secondary" onClick={() => void onLogout()}>Sair</button>
        </div>
      </section>
    </main>
  )
}

export default AccountErrorScreen
