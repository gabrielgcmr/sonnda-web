// src/pages/OnboardingPage/OnboardingPage.tsx
import { useNavigate } from 'react-router-dom'
import { routes } from '../../app/router/routes'
import OnboardingForm from '../../features/auth/components/OnboardingForm'
import { useAuth } from '../../features/auth/hooks/useAuth'

function OnboardingPage() {
  const navigate = useNavigate()
  const { logout, session } = useAuth()

  return (
    <>
      <div className="auth-copy">
        <span className="eyebrow">Onboarding obrigatorio</span>
        <h1>Complete seu cadastro</h1>
        <p className="muted">
          Sua sessao ja esta autenticada como {session?.user.email ?? 'usuario'}.
          Enquanto o perfil nao existir na API, o restante do app fica bloqueado.
        </p>
        <button className="button button-secondary" onClick={() => void logout()}>Sair</button>
      </div>
      <OnboardingForm onCompleted={() => navigate(routes.patients, { replace: true })} />
    </>
  )
}

export default OnboardingPage
