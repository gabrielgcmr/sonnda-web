// src/features/auth/api/profile.ts
import { apiClient } from "@/services/api/client";
import type { CreateUserRequest, UserProfile } from "../types";
import { isProfileNotFoundError } from "./profileErrors";

export async function loadCurrentProfile() {
  try {
    return await apiClient.get<UserProfile>("/v1/me");
  } catch (error) {
    if (isProfileNotFoundError(error)) {
      return null;
    }

    throw error;
  }
}

export function createProfile(payload: CreateUserRequest) {
  return apiClient.post<UserProfile>("/v1/me", payload);
}
