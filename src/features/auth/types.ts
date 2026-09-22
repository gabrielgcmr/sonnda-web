// src/features/auth/types.ts
import type { Session } from '@supabase/supabase-js'

export type UserProfile = {
  id?: string
  full_name?: string
  role?: string
  account_type?: string
  user_role?: string
  profile_type?: string
  birth_date?: string
  cpf?: string
  phone?: string
  [key: string]: unknown
}

export type CreateUserRequest = {
  full_name: string
  birth_date: string
  cpf: string
  phone: string
}

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
  userProfile: UserProfile | null
  loading: boolean
  authError: string | null
  login: (input: LoginInput) => Promise<void>
  signUp: (input: SignUpInput) => Promise<SignUpResult>
  logout: () => Promise<void>
  retryBootstrap: () => Promise<void>
  completeOnboarding: (payload: CreateUserRequest) => Promise<UserProfile>
}
