// src/features/account/AccountProvider.tsx
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'
import { ApiError } from '../../services/api/errors'
import type { CreateUserRequest, UserProfile } from './types'
import { createProfile, loadCurrentProfile } from './profile/profileApi'
import { AccountContext } from './account-context'


type Props = PropsWithChildren<{ userId: string | null }>

// App composition keys this provider by identity, discarding the previous account.
export function AccountProvider({ children, userId }: Props) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(Boolean(userId))
  const [accountError, setAccountError] = useState<string | null>(null)
  const requestIdRef = useRef(0)

  async function fetchProfile(requestId: number) {
    try {
      const profile = await loadCurrentProfile()
      if (requestId !== requestIdRef.current) return
      setUserProfile(profile)
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      setUserProfile(null)
      setAccountError(error instanceof ApiError
        ? error.problem?.detail ?? 'Falha ao carregar seu perfil.'
        : 'Nao foi possivel carregar seu perfil. Verifique a conexao e tente novamente.')
    } finally {
      if (requestId === requestIdRef.current) setLoading(false)
    }
  }

  useEffect(() => {
    const requests = requestIdRef
    const requestId = ++requestIdRef.current
    if (userId) void fetchProfile(requestId)
    return () => { requests.current++ }
  }, [userId])

  async function retryProfile() {
    if (!userId) return
    const requestId = ++requestIdRef.current
    setUserProfile(null)
    setAccountError(null)
    setLoading(true)
    await fetchProfile(requestId)
  }

  async function completeOnboarding(payload: CreateUserRequest) {
    if (!userId) throw new Error('Sua sessao mudou. Entre novamente.')
    const requestId = ++requestIdRef.current
    const profile = await createProfile(payload)
    if (requestId !== requestIdRef.current) throw new Error('Sua sessao mudou. Tente novamente.')
    setUserProfile(profile)
    setAccountError(null)
    return profile
  }

  return (
    <AccountContext.Provider value={{ userProfile, loading, accountError, retryProfile, completeOnboarding }}>
      {children}
    </AccountContext.Provider>
  )
}
