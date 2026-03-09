type AppHeaderProps = {
  displayName: string
  displayRole: string
  email: string
  onLogout: () => void | Promise<void>
}

function AppHeader({
  displayName,
  displayRole,
  email,
  onLogout,
}: AppHeaderProps) {
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')

  return (
    <header className="app-header">
      <div className="app-header__identity">
        <span className="eyebrow">Area protegida</span>
        <div className="profile-chip">
          <div className="profile-chip__avatar" aria-hidden="true">
            {initials}
          </div>
          <div className="profile-chip__content">
            <h1>{displayName}</h1>
            <p className="muted">
              {displayRole} · {email}
            </p>
          </div>
        </div>
      </div>
      <div className="app-header__actions">
        <button
          className="icon-button"
          type="button"
          aria-label="Configuracoes do perfil"
          title="Configuracoes do perfil"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3.75a2.25 2.25 0 0 1 2.19 1.73l.19.77a1.4 1.4 0 0 0 1.9.96l.74-.31a2.25 2.25 0 0 1 2.82.9l.75 1.3a2.25 2.25 0 0 1-.43 2.93l-.58.54a1.4 1.4 0 0 0 0 2.06l.58.54a2.25 2.25 0 0 1 .43 2.93l-.75 1.3a2.25 2.25 0 0 1-2.82.9l-.74-.31a1.4 1.4 0 0 0-1.9.96l-.19.77a2.25 2.25 0 0 1-2.19 1.73h-1.5a2.25 2.25 0 0 1-2.19-1.73l-.19-.77a1.4 1.4 0 0 0-1.9-.96l-.74.31a2.25 2.25 0 0 1-2.82-.9l-.75-1.3a2.25 2.25 0 0 1 .43-2.93l.58-.54a1.4 1.4 0 0 0 0-2.06l-.58-.54a2.25 2.25 0 0 1-.43-2.93l.75-1.3a2.25 2.25 0 0 1 2.82-.9l.74.31a1.4 1.4 0 0 0 1.9-.96l.19-.77A2.25 2.25 0 0 1 10.5 3.75z" />
            <circle cx="12" cy="12" r="3.1" />
          </svg>
        </button>
        <button className="button button-secondary" onClick={() => void onLogout()}>
          Sair
        </button>
      </div>
    </header>
  )
}

export default AppHeader
