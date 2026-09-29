// src/features/account/types.ts
import type { components } from '@/generated/openapi'

export type UserProfile = components['schemas']['AccountUserResponse']
export type CreateUserRequest = components['schemas']['CreateAccountRequest']

export type AccountContextValue = {
  userProfile: UserProfile | null
  loading: boolean
  accountError: string | null
  retryProfile: () => Promise<void>
  completeOnboarding: (payload: CreateUserRequest) => Promise<UserProfile>
}
