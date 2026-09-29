// src/features/patient/api/patients.ts
import type { operations } from '@/generated/openapi'
import { openapiClient, requireOpenApiData } from '../../services/api/openapiClient'

type ListAccessiblePatientsQuery = NonNullable<
  operations['listAccessiblePatients']['parameters']['query']
>

export type ListAccessiblePatientsOptions = ListAccessiblePatientsQuery
export type CreatePatientInput =
  operations['createPatient']['requestBody']['content']['application/json']

export async function listPatients(signal?: AbortSignal) {
  const { data } = await openapiClient.GET('/patients', { signal })
  return data ?? []
}

export async function getPatient(patientId: string, signal?: AbortSignal) {
  const { data } = await openapiClient.GET('/patients/{patientId}', {
    params: { path: { patientId } },
    signal,
  })

  return requireOpenApiData(data, 'GET /patients/{patientId}')
}

export async function createPatient(
  input: CreatePatientInput,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.POST('/patients', {
    body: input,
    signal,
  })

  return requireOpenApiData(data, 'POST /patients')
}

export async function listAccessiblePatients(
  options?: ListAccessiblePatientsOptions,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.GET('/me/patients', {
    params: { query: options },
    signal,
  })

  return requireOpenApiData(data, 'GET /me/patients')
}
