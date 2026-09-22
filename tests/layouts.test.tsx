// tests/layouts.test.tsx
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AppLayout from '../src/app/layouts/AppLayout'
import AuthLayout from '../src/app/layouts/AuthLayout'
import AuthGuard from '../src/app/router/guards/AuthGuard'
import { AuthContext } from '../src/features/auth/context/auth-context'
import type { AuthContextValue } from '../src/features/auth/types'
import LoginPage from '../src/pages/LoginPage/LoginPage'

const account: AuthContextValue = {
  session: null,
  isAuthenticated: true,
  userProfile: { id: 'test-user', full_name: 'Ana Silva' },
  loading: false,
  authError: null,
  login: async () => {},
  signUp: async () => ({ email: 'test@example.com', emailConfirmationRequired: true }),
  logout: async () => {},
  retryBootstrap: async () => {},
  completeOnboarding: async (payload) => payload,
}

test('the app header remains outside and before the patient content', () => {
  const html = renderToStaticMarkup(
    <AuthContext.Provider value={account}>
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<h1>Pacientes</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
  assert.ok(html.indexOf('</header>') < html.indexOf('<main'))
  assert.match(html, /Ana Silva/)
  assert.match(html, /<main[^>]*><div class="panel"><h1>Pacientes<\/h1>/)
})

test('the auth layout composes the login form with its navigation links', () => {
  const html = renderToStaticMarkup(
    <AuthContext.Provider value={{ ...account, isAuthenticated: false, userProfile: null }}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
  assert.equal((html.match(/<main/g) ?? []).length, 1)
  assert.equal((html.match(/<form/g) ?? []).length, 1)
  assert.match(html, /type="email"/)
  assert.match(html, /href="\/register"/)
})

test('guards hide protected content during loading and bootstrap errors', () => {
  for (const state of [{ loading: true, authError: null }, { loading: false, authError: 'Falha de teste' }]) {
    const html = renderToStaticMarkup(
      <AuthContext.Provider value={{ ...account, ...state }}>
        <MemoryRouter initialEntries={['/app']}>
          <Routes>
            <Route element={<AuthGuard access="profiled" />}>
              <Route path="/app" element={<p>Protected patient data</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    )
    assert.doesNotMatch(html, /Protected patient data/)
    assert.match(html, state.loading ? /Carregando sua sessao/ : /Falha de teste/)
  }
})
