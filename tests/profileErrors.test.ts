// tests/profileErrors.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isProfileNotFoundError } from '../src/features/auth/api/profileErrors'
import { ApiError, normalizeProblem } from '../src/services/api/errors'

function apiError(status: number, code: string, detail: string) {
  return new ApiError(detail, status, {
    type: 'about:blank', title: 'Request failed', status, code, detail,
  })
}

test('missing profile and onboarding denial allow the onboarding flow', () => {
  assert.equal(isProfileNotFoundError(apiError(404, 'RESOURCE_NOT_FOUND', 'Perfil ausente')), true)
  assert.equal(isProfileNotFoundError(apiError(403, 'ACCESS_DENIED', 'Cadastro necessário')), true)
})

test('authentication, permission and network failures do not become missing profiles', () => {
  assert.equal(isProfileNotFoundError(apiError(401, 'UNAUTHORIZED', 'Token inválido')), false)
  assert.equal(isProfileNotFoundError(apiError(403, 'ACCESS_DENIED', 'Acesso negado')), false)
  assert.equal(isProfileNotFoundError(new Error('Network error')), false)
})

test('API errors retain field violations for the onboarding form', () => {
  const problem = normalizeProblem(new Response(null, { status: 422 }), {
    type: 'validation', title: 'Dados inválidos', status: 422, code: 'VALIDATION_FAILED',
    detail: 'Confira os campos.', violations: [{ field: 'cpf', reason: 'invalid' }],
  })
  assert.deepEqual(new ApiError(problem.detail, 422, problem).fieldErrors, { cpf: 'invalid' })
})
