// tests/patients.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { filterPatients } from '../src/features/patient/search/utils/filterPatients'
import { formatBirthDate, maskCpf } from '../src/utils/formatters'

const patients = [
  { id: '1', full_name: 'Zélia Silva', cpf: '12345678900', phone: '(11) 98765-4321', cns: '700000000000001' },
  { id: '2', full_name: 'Ana Souza', cpf: null, phone: null },
]

test('sorts without changing the original list and ignores whitespace, case and accents', () => {
  assert.deepEqual(filterPatients(patients, ' ').map(p => p.id), ['2', '1'])
  assert.equal(patients[0].id, '1')
  assert.deepEqual(filterPatients(patients, ' ZELIA ').map(p => p.id), ['1'])
})

test('searches CPF, CNS and phone regardless of punctuation', () => {
  for (const query of ['123.456.789-00', '700000000000001', '11987654321', '(11) 98765-4321']) {
    assert.deepEqual(filterPatients(patients, query).map(p => p.id), ['1'])
  }
})

test('does not match an unrelated mixed text query by its digits', () => {
  assert.deepEqual(filterPatients(patients, 'unknown 123'), [])
  assert.deepEqual(filterPatients([], ''), [])
})

test('masks CPF including formatted values and hides incomplete identifiers', () => {
  assert.equal(maskCpf('12345678900'), '***.456.789-**')
  assert.equal(maskCpf('123.456.789-00'), '***.456.789-**')
  assert.equal(maskCpf('123'), 'Não informado')
  assert.equal(maskCpf(null), 'Não informado')
})

test('formats date-only and API timestamps without timezone shifts', () => {
  assert.equal(formatBirthDate('1990-01-02'), '02/01/1990')
  assert.equal(formatBirthDate('1990-01-02T00:00:00Z'), '02/01/1990')
  assert.equal(formatBirthDate(null), 'Não informado')
})
