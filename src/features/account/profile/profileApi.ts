// src/features/account/profile/profileApi.ts
import { openapiClient } from '@/services/api/openapiClient'
import type { CreateUserRequest, UserProfile } from '../types'
import { isProfileNotFoundError } from './profileErrors'

function requireResponseData<T>(data: T | undefined, operation: string): T {
  if (data === undefined) {
    throw new Error(`API returned an empty response for ${operation}`)
  }

  return data
}

export async function loadCurrentProfile() {
  try {
    const { data } = await openapiClient.GET('/v1/me')
    return requireResponseData<UserProfile>(data, 'GET /v1/me')
  } catch (error) {
    if (isProfileNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function createProfile(payload: CreateUserRequest) {
  const { data } = await openapiClient.POST('/v1/me', { body: payload })
  return requireResponseData<UserProfile>(data, 'POST /v1/me')
}
