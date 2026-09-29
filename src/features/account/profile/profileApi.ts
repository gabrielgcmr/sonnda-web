// src/features/account/profile/profileApi.ts
import { openapiClient, requireOpenApiData } from '@/services/api/openapiClient'
import type { operations } from '@/generated/openapi'
import type { CreateUserRequest, UserProfile } from '../types'
import { isProfileNotFoundError } from './profileErrors'

export type UpdateProfileInput =
  operations['updateCurrentAccount']['requestBody']['content']['application/json']

export async function loadCurrentProfile() {
  try {
    const { data } = await openapiClient.GET('/me')
    return requireOpenApiData<UserProfile>(data, 'GET /me')
  } catch (error) {
    if (isProfileNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export async function createProfile(payload: CreateUserRequest) {
  const { data } = await openapiClient.POST('/me', { body: payload })
  return requireOpenApiData<UserProfile>(data, 'POST /me')
}

export async function updateProfile(
  payload: UpdateProfileInput,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.PUT('/me', { body: payload, signal })
  return requireOpenApiData<UserProfile>(data, 'PUT /me')
}

export async function deleteProfile(signal?: AbortSignal) {
  await openapiClient.DELETE('/me', { signal })
}
