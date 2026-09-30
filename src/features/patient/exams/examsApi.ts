// src/features/patient/exams/examsApi.ts
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

export type LabExtraction = operations['getExamDocumentExtraction']['responses'][200]['content']['application/json']
export type LabReport = components['schemas']['LabReportOutput']

export async function getDocumentExtraction(documentId: string, signal?: AbortSignal) {
 const { data } = await openapiClient.GET('/exam-documents/{documentId}/extraction', { params: { path: { documentId } }, signal })
 return requireOpenApiData(data, 'GET document extraction')
}
export async function confirmDocument(documentId: string, signal?: AbortSignal) {
 const { data } = await openapiClient.POST('/exam-documents/{documentId}/confirmation', { params: { path: { documentId } }, signal })
 return requireOpenApiData(data, 'POST document confirmation')
}
export async function discardDocument(documentId: string, signal?: AbortSignal) {
 await openapiClient.DELETE('/exam-documents/{documentId}', { params: { path: { documentId } }, signal })
}
export async function listPatientLabHistory(patientId: string, signal?: AbortSignal): Promise<LabReport[]> {
 const reports: LabReport[] = []
 for (let offset = 0; ; offset += 100) {
  const { data } = await openapiClient.GET('/patients/{patientId}/lab-reports', { params: { path: { patientId }, query: { expand: 'full', limit: 100, offset } }, signal })
  const page: unknown = requireOpenApiData(data, 'GET patient lab reports')
  if (!Array.isArray(page)) throw new Error('Invalid lab report list')
  reports.push(...page as LabReport[])
  if (page.length < 100) return reports
 }
}
export async function listAllExamDocuments(patientId: string, signal?: AbortSignal): Promise<ExamDocument[]> {
 const documents: ExamDocument[] = []
 for (let offset = 0; ; offset += 100) {
  const page = await listExamDocuments(patientId, { limit: 100, offset }, signal)
  documents.push(...page)
  if (page.length < 100) return documents
 }
}
