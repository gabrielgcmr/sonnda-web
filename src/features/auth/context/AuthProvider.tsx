// src/features/auth/context/AuthProvider.tsx
import {
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { ApiError } from '../../../services/api/errors'
import { createProfile, loadCurrentProfile } from '../api/profile'
import { supabase } from '../../../lib/supabaseClient'
import type { CreateUserRequest, UserProfile, LoginInput, SignUpInput } from '../types'
import { AuthContext } from './auth-context'

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
    setUserProfile(null)
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
      const requestId = requestIdRef.current
      try {
        const { data, error } = await supabase.auth.getSession()
        if (!active || requestId !== requestIdRef.current) return
        if (error) throw error
        await syncSessionRef.current(data.session)
      } catch {
        if (!active || requestId !== requestIdRef.current) return
        setAuthError('Nao foi possivel verificar sua sessao. Tente novamente.')
        setLoading(false)
      }
    }

    void bootstrap()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) {
        return
      }

      // Defer API calls until the Supabase auth callback releases its lock.
      setTimeout(() => {
        if (active) void syncSessionRef.current(nextSession)
      }, 0)
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
    const requestId = ++requestIdRef.current
    setLoading(true)
    setAuthError(null)
    try {
      const { data, error } = await supabase.auth.getSession()
      if (requestId !== requestIdRef.current) return
      if (error) throw error
      await syncSessionRef.current(data.session)
    } catch {
      if (requestId !== requestIdRef.current) return
      setAuthError('Nao foi possivel verificar sua sessao. Tente novamente.')
      setLoading(false)
    }
  }

  async function completeOnboarding(payload: CreateUserRequest) {
    if (!session) throw new Error('Sua sessao mudou. Entre novamente.')
    const requestId = ++requestIdRef.current
    setAuthError(null)
    // Keep the form mounted while saving so validation errors retain its values.
    const profile = await createProfile(payload)
    if (requestIdRef.current !== requestId) {
      throw new Error('Sua sessao mudou. Tente novamente.')
    }
    setUserProfile(profile)
    return profile
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
