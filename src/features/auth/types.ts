// src/features/auth/types.ts
import type { Session } from '@supabase/supabase-js'

export type LoginInput = {
  email: string
  password: string
}

export type SignUpInput = {
  email: string
  password: string
}

export type SignUpResult = {
  email: string
  emailConfirmationRequired: boolean
}

export type AuthContextValue = {
  session: Session | null
  isAuthenticated: boolean
  loading: boolean
  authError: string | null
  login: (input: LoginInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<SignUpResult>
  logout: () => Promise<void>
  retryBootstrap: () => Promise<void>
}
