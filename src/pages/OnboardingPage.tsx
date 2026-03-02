import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/useAuth'
import { ApiError } from '../lib/apiClient'

type FormState = {
  full_name: string
  birth_date: string
  cpf: string
  phone: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

const cpfPattern = /^[0-9]{11}$/
const phonePattern = /^[0-9]{11}$/

function normalizeCpf(value: string) {
  return value.replace(/\D/g, '')
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, '').slice(0, 11)
}

function formatPhoneInput(value: string) {
  const digits = normalizePhone(value)

  if (digits.length <= 2) {
    return digits
  }

  return `${digits.slice(0, 2)} ${digits.slice(2)}`
}

function validateForm(values: FormState) {
  const errors: FormErrors = {}
  const normalizedCpf = normalizeCpf(values.cpf)
  const normalizedPhone = normalizePhone(values.phone)

  if (values.full_name.trim().length < 2) {
    errors.full_name = 'Informe seu nome completo.'
  }

  if (!values.birth_date) {
    errors.birth_date = 'Informe sua data de nascimento.'
  }

  if (!cpfPattern.test(normalizedCpf)) {
    errors.cpf = 'CPF deve ter 11 digitos.'
  }

  if (!phonePattern.test(normalizedPhone)) {
    errors.phone = 'Informe o telefone com DDD no formato 61 995517251.'
  }

  return errors
}

function translateFieldError(field: keyof FormState, value: string) {
  if (value === 'required') {
    switch (field) {
      case 'full_name':
        return 'Informe seu nome completo.'
      case 'birth_date':
        return 'Informe sua data de nascimento.'
      case 'cpf':
        return 'Informe um CPF valido.'
      case 'phone':
        return 'Informe um telefone com DDD.'
    }
  }

  if (value === 'invalid') {
    switch (field) {
      case 'birth_date':
        return 'Data de nascimento invalida.'
      case 'cpf':
        return 'CPF invalido.'
      case 'phone':
        return 'Telefone invalido. Use o formato 61 995517251.'
      default:
        return 'Valor invalido.'
    }
  }

  return value
}

function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding, loading, logout, session } = useAuth()
  const [values, setValues] = useState<FormState>({
    full_name: '',
    birth_date: '',
    cpf: '',
    phone: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateForm(values)

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      return
    }

    setFieldErrors({})
    setSubmitError(null)

    try {
      await completeOnboarding({
        full_name: values.full_name.trim(),
        birth_date: values.birth_date,
        cpf: normalizeCpf(values.cpf),
        phone: normalizePhone(values.phone),
      })

      navigate('/app', { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        const nextFieldErrors = Object.entries(error.fieldErrors).reduce<FormErrors>(
          (errors, [field, reason]) => {
            if (field in values) {
              errors[field as keyof FormState] = translateFieldError(
                field as keyof FormState,
                reason,
              )
            }

            return errors
          },
          {},
        )

        setFieldErrors(nextFieldErrors)
        setSubmitError(error.problem?.detail ?? 'Nao foi possivel concluir o cadastro.')
        return
      }

      setSubmitError('Nao foi possivel concluir o cadastro.')
    }
  }

  function updateField(field: keyof FormState, value: string) {
    const nextValue = field === 'phone' ? formatPhoneInput(value) : value

    setValues((current) => ({
      ...current,
      [field]: nextValue,
    }))

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  return (
    <main className="shell shell-centered">
      <section className="auth-layout">
        <div className="auth-copy">
          <span className="eyebrow">Onboarding obrigatorio</span>
          <h1>Complete seu cadastro</h1>
          <p className="muted">
            Sua sessao ja esta autenticada como {session?.user.email ?? 'usuario'}.
            Enquanto o perfil nao existir na API, o restante do app fica bloqueado.
          </p>
          <button className="button button-secondary" onClick={() => void logout()}>
            Sair
          </button>
        </div>

        <form className="panel" onSubmit={handleSubmit} noValidate>
          <div className="grid-form">
            <label className="field field-full">
              <span>Nome completo</span>
              <input
                type="text"
                autoComplete="name"
                value={values.full_name}
                onChange={(event) => updateField('full_name', event.target.value)}
                placeholder="Seu nome completo"
              />
              {fieldErrors.full_name ? <small>{fieldErrors.full_name}</small> : null}
            </label>

            <label className="field">
              <span>Data de nascimento</span>
              <input
                type="date"
                value={values.birth_date}
                onChange={(event) => updateField('birth_date', event.target.value)}
              />
              {fieldErrors.birth_date ? <small>{fieldErrors.birth_date}</small> : null}
            </label>

            <label className="field">
              <span>CPF</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={values.cpf}
                onChange={(event) => updateField('cpf', event.target.value)}
                placeholder="00000000000"
              />
              {fieldErrors.cpf ? <small>{fieldErrors.cpf}</small> : null}
            </label>

            <label className="field field-full">
              <span>Telefone</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={values.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                placeholder="61 995517251"
                maxLength={12}
              />
              {fieldErrors.phone ? <small>{fieldErrors.phone}</small> : null}
            </label>
          </div>

          {submitError ? <p className="error-banner">{submitError}</p> : null}

          <button className="button button-primary" type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Criar meu perfil'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default OnboardingPage
