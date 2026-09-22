// tests/routeAccess.test.ts
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getRouteRedirect } from '../src/app/router/guards/routeAccess'

const guest = { isAuthenticated: false, hasProfile: false }
const onboarding = { isAuthenticated: true, hasProfile: false }
const registered = { isAuthenticated: true, hasProfile: true }

test('the entry route sends each account state to the correct screen', () => {
  assert.equal(getRouteRedirect('root', guest), '/login')
  assert.equal(getRouteRedirect('root', onboarding), '/onboarding')
  assert.equal(getRouteRedirect('root', registered), '/app')
})

test('login, registration and confirmation are available only to guests', () => {
  assert.equal(getRouteRedirect('guest', guest), null)
  assert.equal(getRouteRedirect('guest', onboarding), '/onboarding')
  assert.equal(getRouteRedirect('guest', registered), '/app')
})

test('onboarding requires authentication and an incomplete profile', () => {
  assert.equal(getRouteRedirect('onboarding', guest), '/login')
  assert.equal(getRouteRedirect('onboarding', onboarding), null)
  assert.equal(getRouteRedirect('onboarding', registered), '/app')
})

test('patients require both authentication and a profile', () => {
  assert.equal(getRouteRedirect('profiled', guest), '/login')
  assert.equal(getRouteRedirect('profiled', onboarding), '/onboarding')
  assert.equal(getRouteRedirect('profiled', registered), null)
  assert.equal(getRouteRedirect('profiled', { isAuthenticated: false, hasProfile: true }), '/login')
})
