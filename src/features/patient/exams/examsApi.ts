import type { components, operations } from '@/generated/openapi'
import { openapiClient, requireOpenApiData } from '@/services/api/openapiClient'

type UploadExamDocumentBody = NonNullable<
  operations['uploadExamDocument']['requestBody']
>['content']['multipart/form-data']

export type UploadExamDocumentInput = Omit<UploadExamDocumentBody, 'file'> & {
  file: Blob
}

export type ExamDocument = components['schemas']['ExamDocumentOutput']
export type ExamDocumentFile = components['schemas']['ExamDocumentFileResponse']

export async function listExamDocuments(
  patientId: string,
  query?: operations['listExamDocuments']['parameters']['query'],
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.GET(
    '/patients/{patientId}/exam-documents',
    {
      params: { path: { patientId }, query },
      signal,
    },
  )

  return requireOpenApiData(data, 'GET /patients/{patientId}/exam-documents') ?? []
}

export async function getExamDocument(
  documentId: string,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.GET('/exam-documents/{documentId}', {
    params: { path: { documentId } },
    signal,
  })

  return requireOpenApiData(data, 'GET /exam-documents/{documentId}')
}

export async function getExamDocumentFile(
  documentId: string,
  signal?: AbortSignal,
) {
  const { data } = await openapiClient.GET(
    '/exam-documents/{documentId}/file',
    {
      params: { path: { documentId } },
      signal,
    },
  )

  return requireOpenApiData(data, 'GET /exam-documents/{documentId}/file')
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
    '/patients/{patientId}/exam-documents',
    {
      params: { path: { patientId } },
      body,
      bodySerializer: () => formData,
      signal,
    },
  )

  return requireOpenApiData(
    data,
    'POST /patients/{patientId}/exam-documents',
  )
}
