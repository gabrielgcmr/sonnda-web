// src/app/layouts/AuthLayout.tsx
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="shell shell-centered">
      <section className="auth-layout">
        <Outlet />
      </section>
    </main>
  )
}

export default AuthLayout
