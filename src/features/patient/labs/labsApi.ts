import type { operations } from '@/generated/openapi'
import { openapiClient, requireOpenApiData } from '@/services/api/openapiClient'

type ListLabReportsQuery = NonNullable<
  operations['listPatientLabReports']['parameters']['query']
>
type ListLegacyLabsQuery = NonNullable<
  operations['listPatientLabs']['parameters']['query']
>
type UploadLegacyLabBody =
  operations['uploadPatientLab']['requestBody']['content']['multipart/form-data']

export type ListLabReportsOptions = ListLabReportsQuery
export type ListLegacyLabsOptions = ListLegacyLabsQuery
export type UploadLegacyLabInput = Omit<UploadLegacyLabBody, 'file'> & {
  file: Blob
}

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

/** @deprecated Use uploadExamDocument for new exam-document uploads. */
export async function uploadLegacyLab(
  patientId: string,
  input: UploadLegacyLabInput,
  signal?: AbortSignal,
) {
  const formData = new FormData()
  formData.set('file', input.file)

  const body: UploadLegacyLabBody = {
    ...input,
    // See uploadExamDocument: format: binary is generated as string.
    file: input.file as unknown as string,
  }
  const { data } = await openapiClient.POST('/v1/patients/{patientId}/labs', {
    params: { path: { patientId } },
    body,
    bodySerializer: () => formData,
    signal,
  })

  return requireOpenApiData(data, 'POST /v1/patients/{patientId}/labs')
}
