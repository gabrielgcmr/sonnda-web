import type { operations } from '@/generated/openapi'
import { openapiClient, requireOpenApiData } from '@/services/api/openapiClient'

type UploadExamDocumentBody =
  operations['uploadExamDocument']['requestBody']['content']['multipart/form-data']

export type UploadExamDocumentInput = Omit<UploadExamDocumentBody, 'file'> & {
  file: Blob
}

export async function getExamDocument(
  documentId: string,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.GET('/v1/exam-documents/{documentId}', {
    params: { path: { documentId } },
    signal,
  })

  return requireOpenApiData(data, 'GET /v1/exam-documents/{documentId}')
}

export async function uploadExamDocument(
  patientId: string,
  input: UploadExamDocumentInput,
  signal?: AbortSignal,
) {
  const formData = new FormData()
  formData.set('file', input.file)

  if (input.collection_date) {
    formData.set('collection_date', input.collection_date)
  }

  const body: UploadExamDocumentBody = {
    ...input,
    // openapi-typescript represents format: binary as string. The serializer
    // sends the Blob through multipart/form-data at this boundary.
    file: input.file as unknown as string,
  }
  const { data } = await openapiClient.POST(
    '/v1/patients/{patientId}/exam-documents',
    {
      params: { path: { patientId } },
      body,
      bodySerializer: () => formData,
      signal,
    },
  )

  return requireOpenApiData(
    data,
    'POST /v1/patients/{patientId}/exam-documents',
  )
}
