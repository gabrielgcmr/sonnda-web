// src/utils/formatters.ts
export function maskCpf(value?: string | null) {
  const digits = (value ?? '').replace(/\D/g, '')
  return digits.length === 11 ? `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**` : 'Não informado'
}

export function formatBirthDate(value?: string | null) {
  const date = value?.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|$)/)
  return date ? `${date[3]}/${date[2]}/${date[1]}` : 'Não informado'
}
