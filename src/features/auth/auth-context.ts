import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { CreateUserRequest, UserProfile } from '../../shared/types/api'

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

export const AuthContext = createContext<AuthContextValue | null>(null)
