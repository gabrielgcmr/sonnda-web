// src/features/patient/api/patients.ts
import { apiClient } from "../../services/api/client";
import type { Patient } from "./types";

export async function listPatients(signal?: AbortSignal): Promise<Patient[]> {
  const patients = await apiClient.get<Patient[] | null>("/v1/patients", {
    signal,
  });
  return patients ?? [];
}

export function getPatient(
  patientId: string,
  signal?: AbortSignal,
): Promise<Patient> {
  return apiClient.get<Patient>(
    `/v1/patients/${encodeURIComponent(patientId)}`,
    { signal },
  );
}
