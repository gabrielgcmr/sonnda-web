// src/app/providers/AppProviders.tsx
import type { PropsWithChildren } from 'react'
import { AuthProvider } from '../../features/auth/context/AuthProvider'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { AccountProvider } from '../../features/account/context/AccountProvider'

function CurrentAccount({ children }: PropsWithChildren) {
  const { session } = useAuth()
  const userId = session?.user.id ?? null
  return <AccountProvider key={userId ?? 'guest'} userId={userId}>{children}</AccountProvider>
}

function AppProviders({ children }: PropsWithChildren) {
  return <AuthProvider><CurrentAccount>{children}</CurrentAccount></AuthProvider>
}

export default AppProviders
