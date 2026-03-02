import { Link, useSearchParams } from 'react-router-dom'

function ConfirmEmailPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')?.trim() || null

  return (
    <main className="shell shell-centered">
      <section className="auth-layout">
        <div className="auth-copy">
          <span className="eyebrow">Confirmacao pendente</span>
          <h1>Confirme seu email</h1>
          <p className="muted">
            Sua conta foi criada no Supabase, mas o acesso so sera liberado apos
            a confirmacao do email.
          </p>
        </div>

        <section className="panel panel-compact auth-form auth-form-centered">
          <h2>Verifique sua caixa de entrada</h2>
          <p className="success-banner">
            {email
              ? `Enviamos um link de confirmacao para ${email}.`
              : 'Enviamos um link de confirmacao para o email informado.'}{' '}
            Abra a mensagem, confirme a conta e depois volte para fazer login.
          </p>
          <div className="actions-row">
            <Link className="button button-primary" to="/login">
              Ir para login
            </Link>
            <Link className="button button-secondary" to="/register">
              Criar outra conta
            </Link>
          </div>
        </section>
      </section>
    </main>
  )
}

export default ConfirmEmailPage
