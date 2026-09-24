// src/features/auth/context/AuthProvider.tsx
import {
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../../services/integrations/supabaseClient'
import type { LoginInput, SignUpInput } from '../types'
import { AuthRoutes } from '../authRoutes'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
  const syncSessionRef = useRef<(nextSession: Session | null) => Promise<void>>(async () => {})

  syncSessionRef.current = async (nextSession: Session | null) => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setSession(nextSession)
    setAuthError(null)
    setLoading(false)
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
      typeof window === 'undefined' ? undefined : `${window.location.origin}${AuthRoutes.login}`

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

    return {
      email,
      emailConfirmationRequired: true,
    }
  }

  async function logout() {
    requestIdRef.current += 1
    setLoading(false)
    setAuthError(null)
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

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session),
        loading,
        authError,
        login,
        signUp,
        logout,
        retryBootstrap,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
