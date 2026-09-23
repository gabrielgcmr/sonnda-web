// src/features/account/onboarding/OnboardingPage.tsx
import OnboardingForm from './OnboardingForm'

type Props = {
  email?: string
  onLogout: () => Promise<void>
  onCompleted: () => void
}

function OnboardingPage({ email, onLogout, onCompleted }: Props) {
  return (
    <>
      <div className="auth-copy">
        <span className="eyebrow">Onboarding obrigatorio</span>
        <h1>Complete seu cadastro</h1>
        <p className="muted">
          Sua sessao ja esta autenticada como {email ?? 'usuario'}.
          Enquanto o perfil nao existir na API, o restante do app fica bloqueado.
        </p>
        <button className="button button-secondary" onClick={() => void onLogout()}>Sair</button>
      </div>
      <OnboardingForm onCompleted={onCompleted} />
    </>
  )
}

export default OnboardingPage
