import {
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { ApiError, apiClient, isProfileNotFoundError } from '../../lib/apiClient'
import { supabase } from '../../lib/supabaseClient'
import type { CreateUserRequest, UserProfile } from '../../shared/types/api'
import { AuthContext, type LoginInput, type SignUpInput } from './auth-context'

async function loadCurrentProfile() {
  try {
    return await apiClient.get<UserProfile>('/v1/me')
  } catch (error) {
    if (isProfileNotFoundError(error)) {
      return null
    }

    throw error
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
  const syncSessionRef = useRef<(nextSession: Session | null) => Promise<void>>(async () => {})

  syncSessionRef.current = async (nextSession: Session | null) => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setSession(nextSession)
    setAuthError(null)

    if (!nextSession) {
      setUserProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const profile = await loadCurrentProfile()

      if (requestIdRef.current !== requestId) {
        return
      }

      setUserProfile(profile)
    } catch (error) {
      if (requestIdRef.current !== requestId) {
        return
      }

      setUserProfile(null)

      if (error instanceof ApiError) {
        setAuthError(error.problem?.detail ?? 'Falha ao carregar seu perfil.')
      } else if (error instanceof Error) {
        setAuthError(error.message)
      } else {
        setAuthError('Falha ao carregar seu perfil.')
      }
    } finally {
      if (requestIdRef.current === requestId) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession()

      if (!active) {
        return
      }

      await syncSessionRef.current(initialSession)
    }

    void bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) {
        return
      }

      void syncSessionRef.current(nextSession)
    })

    return () => {
      active = false
      requestIdRef.current += 1
      subscription.unsubscribe()
    }
  }, [])

  async function login({ email, password }: LoginInput) {
    setLoading(true)
    setAuthError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoading(false)
      throw error
    }

    await syncSessionRef.current(data.session)
  }

  async function signUp({ email, password }: SignUpInput) {
    setLoading(true)
    setAuthError(null)

    const emailRedirectTo =
      typeof window === 'undefined' ? undefined : `${window.location.origin}/login`

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
      },
    })

    if (error) {
      setLoading(false)
      throw error
    }

    if (data.session) {
      await syncSessionRef.current(data.session)

      return {
        email,
        emailConfirmationRequired: false,
      }
    }

    setLoading(false)
    setSession(null)
    setUserProfile(null)

    return {
      email,
      emailConfirmationRequired: true,
    }
  }

  async function logout() {
    requestIdRef.current += 1
    setLoading(false)
    setAuthError(null)
    setUserProfile(null)
    setSession(null)

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  async function retryBootstrap() {
    await syncSessionRef.current(session)
  }

  async function completeOnboarding(payload: CreateUserRequest) {
    setLoading(true)
    setAuthError(null)

    try {
      const profile = await apiClient.post<UserProfile>('/v1/me', payload)
      setUserProfile(profile)
      return profile
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        userProfile,
        loading,
        authError,
        login,
        signUp,
        logout,
        retryBootstrap,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
