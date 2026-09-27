import type { operations } from '@/generated/openapi'
import { openapiClient, requireOpenApiData } from '@/services/api/openapiClient'

type ListLabReportsQuery = NonNullable<
  operations['listPatientLabReports']['parameters']['query']
>
type ListLegacyLabsQuery = NonNullable<
  operations['listPatientLabs']['parameters']['query']
>
export type ListLabReportsOptions = ListLabReportsQuery
export type ListLegacyLabsOptions = ListLegacyLabsQuery

export async function getLabReport(labReportId: string, signal?: AbortSignal) {
  const { data } = await openapiClient.GET('/v1/lab-reports/{labReportId}', {
    params: { path: { labReportId } },
    signal,
  })

  return requireOpenApiData(data, 'GET /v1/lab-reports/{labReportId}')
}

export async function listLabReports(
  patientId: string,
  options?: ListLabReportsOptions,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.GET(
    '/v1/patients/{patientId}/lab-reports',
    {
      params: { path: { patientId }, query: options },
      signal,
    },
  )

  return requireOpenApiData(data, 'GET /v1/patients/{patientId}/lab-reports')
}

/** @deprecated Use listLabReports for new integrations. */
export async function listLegacyLabs(
  patientId: string,
  options?: ListLegacyLabsOptions,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.GET('/v1/patients/{patientId}/labs', {
    params: { path: { patientId }, query: options },
    signal,
  })

  return requireOpenApiData(data, 'GET /v1/patients/{patientId}/labs')
}
