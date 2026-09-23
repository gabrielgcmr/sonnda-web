// src/features/account/onboarding/onboarding.ts
export type FormState = {
  full_name: string
  birth_date: string
  cpf: string
  phone: string
}

export type FormErrors = Partial<Record<keyof FormState, string>>

const cpfPattern = /^[0-9]{11}$/
const phonePattern = /^[0-9]{11}$/

export function normalizeCpf(value: string) {
  return value.replace(/\D/g, '')
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function formatPhoneInput(value: string) {
  const digits = normalizePhone(value)

  if (digits.length <= 2) {
    return digits
  }

  return `${digits.slice(0, 2)} ${digits.slice(2)}`
}

export function validateForm(values: FormState) {
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

export function translateFieldError(field: keyof FormState, value: string) {
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
