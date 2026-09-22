// src/features/auth/components/OnboardingForm.tsx
import { useState } from 'react'
import { ApiError } from '../../../services/api/errors'
import { useAuth } from '../hooks/useAuth'
import { formatPhoneInput, normalizeCpf, normalizePhone, translateFieldError, validateForm, type FormState, type FormErrors } from '../utils/onboarding'

function OnboardingForm({ onCompleted }: { onCompleted: () => void }) {
  const { completeOnboarding, loading } = useAuth()
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

      onCompleted()
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
  )
}

export default OnboardingForm
