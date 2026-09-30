// src/features/workspace/extraction/extractionApi.ts
import type { operations } from '@/generated/openapi'
import { openapiClient, requireOpenApiData } from '@/services/api/openapiClient'

type RequestBody = NonNullable<operations['extractTemporaryLabReport']['requestBody']>['content']['multipart/form-data']
export type TemporaryLabExtraction = operations['extractTemporaryLabReport']['responses'][200]['content']['application/json']

export async function extractTemporaryLabReport(file: Blob, signal?: AbortSignal) {
  const formData = new FormData()
  formData.set('file', file)
  const { data } = await openapiClient.POST('/lab-extractions', {
    body: { file: file as unknown as string } satisfies RequestBody,
    bodySerializer: () => formData,
    signal,
  })
  return requireOpenApiData(data, 'POST /lab-extractions')
}
