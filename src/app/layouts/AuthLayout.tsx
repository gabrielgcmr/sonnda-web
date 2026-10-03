// src/app/layouts/AuthLayout.tsx
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <main className="grid min-h-screen place-items-center p-4 min-[901px]:p-8">
      <section className="grid w-full max-w-270 items-start gap-6 min-[901px]:grid-cols-[minmax(0,1fr)_minmax(320px,480px)]">
        <Outlet />
      </section>
    </main>
  )
}

export default AuthLayout
