// src/features/auth/components/AuthLoadingScreen.tsx
function AuthLoadingScreen() {
  return (
    <main className="shell shell-centered">
      <section className="panel panel-compact">
        <span className="eyebrow">Autenticando</span>
        <h1>Carregando sua sessao</h1>
        <p className="muted">
          Validando o token do Supabase e sincronizando seu perfil com a API da
          Sonnda.
        </p>
      </section>
    </main>
  )
}


export default AuthLoadingScreen
