// src/features/patient/api/patients.ts
import { openapiClient } from "../../services/api/openapiClient";

export async function listPatients(signal?: AbortSignal) {
  const { data } = await openapiClient.GET("/v1/patients", { signal });
  return data ?? [];
}

export async function getPatient(patientId: string, signal?: AbortSignal) {
  const { data } = await openapiClient.GET("/v1/patients/{patientId}", {
    params: { path: { patientId } },
    signal,
  });

  if (!data) {
    throw new Error("API returned an empty patient response");
  }

  return data;
}
