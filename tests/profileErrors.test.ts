// tests/profileErrors.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isProfileNotFoundError } from '../src/features/account/profile/profileErrors'
import { ApiError, normalizeProblem } from '../src/services/api/errors'

function apiError(status: number, code: string, detail: string) {
  return new ApiError(detail, status, {
    type: 'about:blank', title: 'Request failed', status, code, detail,
  })
}

test('only the explicit missing-profile contract allows onboarding', () => {
  assert.equal(isProfileNotFoundError(apiError(403, 'PROFILE_NOT_FOUND', 'Mensagem pode mudar')), true)
  for (const error of [
    apiError(404, 'RESOURCE_NOT_FOUND', 'Perfil ausente'),
    apiError(403, 'ACCESS_DENIED', 'Cadastro necessário'),
    apiError(401, 'AUTH_REQUIRED', 'Token inválido'),
    apiError(403, 'ACCESS_DENIED', 'Acesso negado'),
    apiError(500, 'INTERNAL_ERROR', 'Cadastro necessário'),
    apiError(500, 'PROFILE_NOT_FOUND', 'Resposta inconsistente'),
    new Error('Network error'),
  ]) {
    assert.equal(isProfileNotFoundError(error), false)
  }
})

test('API errors retain field violations for the onboarding form', () => {
  const problem = normalizeProblem(new Response(null, { status: 422 }), {
    type: 'validation', title: 'Dados inválidos', status: 422, code: 'VALIDATION_FAILED',
    detail: 'Confira os campos.', violations: [{ field: 'cpf', reason: 'invalid' }],
  })
  assert.deepEqual(new ApiError(problem.detail, 422, problem).fieldErrors, { cpf: 'invalid' })
})
