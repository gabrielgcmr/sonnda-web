// src/components/common/AppHeader.tsx
import type { UserProfile } from '../../features/auth/types'
import { formatBirthDate, maskCpf } from '../../utils/formatters'
import Avatar from '../ui/Avatar'

import './AppHeader.css'

type AppHeaderProps = {
  displayName: string
  displayRole: string
  email: string
  userProfile: UserProfile | null
  onLogout: () => void | Promise<void>
}

function AppHeader({ displayName, displayRole, email, userProfile, onLogout }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <span className="eyebrow">Sonnda</span>
        <div className="app-header__actions">
          <details className="header-profile">
            <summary className="profile-chip">
              <Avatar name={displayName} />
              <span className="profile-chip__content">
                <strong>{displayName}</strong>
                <span className="muted">{displayRole} · Meu perfil</span>
              </span>
            </summary>
            <div className="header-profile__details">
              <strong>{userProfile?.full_name || displayName}</strong>
              <p className="muted">{email}</p>
              <dl>
                <div><dt>Nascimento</dt><dd>{formatBirthDate(userProfile?.birth_date)}</dd></div>
                <div><dt>CPF</dt><dd>{maskCpf(userProfile?.cpf)}</dd></div>
                <div><dt>Telefone</dt><dd>{userProfile?.phone || 'Não informado'}</dd></div>
              </dl>
            </div>
          </details>
          <button className="button button-secondary" onClick={() => void onLogout()}>Sair</button>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
