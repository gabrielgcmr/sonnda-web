import { useAuth } from '../features/auth/useAuth'

function AppHomePage() {
  const { userProfile } = useAuth()

  return (
    <section className="content-stack">
      <div className="highlight-card">
        <span className="eyebrow">Bootstrap concluido</span>
        <h2>Seu perfil foi carregado pela rota `GET /v1/me`.</h2>
        <p className="muted">
          A partir daqui, qualquer nova chamada feita pelo `apiClient` ja inclui
          o header `Authorization: Bearer &lt;supabase_access_token&gt;`.
        </p>
      </div>

      <div className="profile-grid">
        <article className="info-card">
          <span className="eyebrow">Nome</span>
          <strong>{userProfile?.full_name ?? 'Nao informado'}</strong>
        </article>
        <article className="info-card">
          <span className="eyebrow">Nascimento</span>
          <strong>{userProfile?.birth_date ?? 'Nao informado'}</strong>
        </article>
        <article className="info-card">
          <span className="eyebrow">CPF</span>
          <strong>{userProfile?.cpf ?? 'Nao informado'}</strong>
        </article>
        <article className="info-card">
          <span className="eyebrow">Telefone</span>
          <strong>{userProfile?.phone ?? 'Nao informado'}</strong>
        </article>
      </div>
    </section>
  )
}

export default AppHomePage
