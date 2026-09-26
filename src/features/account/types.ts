// src/features/account/types.ts
import type { components } from '@/generated/openapi'

export type UserProfile = components['schemas']['User']
export type CreateUserRequest = components['schemas']['CreateUserRequest']

export type AccountContextValue = {
  userProfile: UserProfile | null
  loading: boolean
  accountError: string | null
  retryProfile: () => Promise<void>
  completeOnboarding: (payload: CreateUserRequest) => Promise<UserProfile>
}
