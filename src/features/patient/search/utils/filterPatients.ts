// src/features/patient/search/utils/filterPatients.ts
import type { Patient } from '../../types'

function normalize(value: string) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('pt-BR').trim()
}

export function filterPatients(patients: Patient[], query: string) {
  const search = normalize(query)
  const digits = search.replace(/\D/g, '')
  const numericSearch = digits.length > 0 && /^[\d\s().+/-]+$/.test(search)
  return patients.filter((patient) => {
    const identifiers = [patient.cpf, patient.cns, patient.phone]
    return !search || [patient.full_name, ...identifiers].some((value) => normalize(value ?? '').includes(search))
      || (numericSearch && identifiers.some((value) => (value ?? '').replace(/\D/g, '').includes(digits)))
  }).sort((left, right) => left.full_name.localeCompare(right.full_name, 'pt-BR'))
}
