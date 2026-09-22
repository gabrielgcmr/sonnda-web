// tests/onboarding.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatPhoneInput, normalizeCpf, normalizePhone, validateForm } from '../src/features/auth/utils/onboarding'

test('onboarding accepts formatted identifiers and normalizes the API payload', () => {
  const values = { full_name: 'Ana Silva', birth_date: '1990-01-02', cpf: '123.456.789-00', phone: '(61) 99551-7251' }
  assert.deepEqual(validateForm(values), {})
  assert.equal(normalizeCpf(values.cpf), '12345678900')
  assert.equal(normalizePhone(values.phone), '61995517251')
  assert.equal(formatPhoneInput(values.phone), '61 995517251')
})

test('onboarding reports missing required fields before submission', () => {
  const errors = validateForm({ full_name: '', birth_date: '', cpf: '', phone: '' })
  assert.deepEqual(Object.keys(errors).sort(), ['birth_date', 'cpf', 'full_name', 'phone'])
})
