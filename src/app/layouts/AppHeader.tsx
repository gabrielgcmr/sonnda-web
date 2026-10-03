// src/app/layouts/AppHeader.tsx
import type { UserProfile } from '../../features/account/types'
import { formatBirthDate, maskCpf } from '../../utils/formatters'
import Avatar from '../../components/ui/Avatar'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import { useTheme } from '../providers/useTheme'

type AppHeaderProps = {
  displayName: string
  displayRole: string
  email: string
  userProfile: UserProfile | null
  onLogout: () => void | Promise<void>
}

function AppHeader({ displayName, email, userProfile, onLogout }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="relative z-10 border-b border-(--app-outline) bg-(--app-surface) px-4 py-4 min-[901px]:px-8">
      <div className="mx-auto flex w-full max-w-250 items-center justify-between gap-4 max-[600px]:flex-wrap">
        <span className="eyebrow">Sonnda</span>
        <div className="flex min-w-0 items-center gap-4 max-[600px]:w-full max-[600px]:justify-between">
          <details className="group relative min-w-0">
            <summary className="flex list-none cursor-pointer items-center gap-[0.9rem] rounded-[14px] focus-visible:outline-2 focus-visible:outline-(--app-accent) focus-visible:outline-offset-4">
              <Avatar name={displayName} />
              <span className="grid min-w-0 gap-[0.15rem] wrap-anywhere">
                <strong>{displayName}</strong>
              </span>
              <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-(--app-muted) transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-5 w-[min(320px,75vw)] wrap-anywhere rounded-2xl border border-(--app-outline) bg-(--app-surface-raised) p-5 shadow-[0_16px_40px_color-mix(in_srgb,var(--md-sys-color-shadow)_24%,transparent)] max-[600px]:right-auto max-[600px]:left-0">
              <strong>{userProfile?.full_name || displayName}</strong>
              <p className="muted">{email}</p>
              <dl className="mb-0 grid gap-3">
                <div><dt className="text-[0.85rem] text-(--app-muted)">Nascimento</dt><dd className="m-0 wrap-anywhere">{formatBirthDate(userProfile?.birth_date)}</dd></div>
                <div><dt className="text-[0.85rem] text-(--app-muted)">CPF</dt><dd className="m-0 wrap-anywhere">{maskCpf(userProfile?.cpf)}</dd></div>
                <div><dt className="text-[0.85rem] text-(--app-muted)">Telefone</dt><dd className="m-0 wrap-anywhere">{userProfile?.phone || 'Não informado'}</dd></div>
              </dl>
            </div>
          </details>
          <button
            aria-label={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            className="icon-button"
            onClick={toggleTheme}
            title={`Ativar tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
            type="button"
          >
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <button className="button button-secondary" onClick={() => void onLogout()}>Sair</button>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
