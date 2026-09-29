import type { operations } from '@/generated/openapi'
import { openapiClient, requireOpenApiData } from '@/services/api/openapiClient'

type ListLabReportsQuery = NonNullable<
  operations['listPatientLabReports']['parameters']['query']
>
export type ListLabReportsOptions = ListLabReportsQuery

export async function getLabReport(labReportId: string, signal?: AbortSignal) {
  const { data } = await openapiClient.GET('/lab-reports/{labReportId}', {
    params: { path: { labReportId } },
    signal,
  })

  return requireOpenApiData(data, 'GET /lab-reports/{labReportId}')
}

export async function listLabReports(
  patientId: string,
  options?: ListLabReportsOptions,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.GET(
    '/patients/{patientId}/lab-reports',
    {
      params: { path: { patientId }, query: options },
      signal,
    },
  )

  return requireOpenApiData(data, 'GET /patients/{patientId}/lab-reports')
}
