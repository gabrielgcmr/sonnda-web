// src/app/providers/AppProviders.tsx
import type { PropsWithChildren } from 'react'
import { AuthProvider } from '../../features/auth/context/AuthProvider'

function AppProviders({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>
}

export default AppProviders
