// tests/examReview.test.tsx
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterEach, beforeEach, expect, mock, test } from 'bun:test'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import type { ExamDocument, LabExtraction, LabReport } from '../src/features/patient/exams/examsApi'

GlobalRegistrator.register()
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

const draft: ExamDocument = { id: 'document-1', patient_id: 'patient-1', uploaded_by_user_id: 'user-1', original_filename: 'laboratorio.pdf', mime_type: 'application/pdf', status: 'processed', review_status: 'pending', created_at: '2026-09-01', updated_at: '2026-09-01' }
const extraction: LabExtraction = {
 status: 'partial', summary_text: 'RESUMO DA API: Glicose < 5 mg/dL', warnings: [{ code: 'partial', message: 'Confira a data ausente.' }],
 report: { patient_name: 'Paciente do PDF', patient_dob: null, lab_name: 'Laboratório', lab_phone: null, insurance_provider: null, requesting_doctor: null, technical_manager: null, report_date: null,
 tests: [{ test_name: 'Glicose', material: 'Soro', method: null, collected_at: null, release_at: null, items: [{ parameter_name: 'Glicose', result_value: '< 5', result_unit: 'mg/dL', reference_text: '70–99' }] }] },
}
const report: LabReport = { id: 'report-1', patient_id: draft.patient_id, exam_document_id: draft.id, uploaded_by_user_id: 'user-1', created_at: '2026-09-01', updated_at: '2026-09-01', lab_name: 'Laboratório confirmado', test_results: [] }
let documents: ExamDocument[] = []
let history: LabReport[] = []
let failConfirmation = false
let confirmCount = 0
let discardCount = 0
let resolveExtraction: ((value: LabExtraction) => void) | null = null
let deferExtraction = false
const api = {
 listAllExamDocuments: async (patientId: string) => documents.filter(doc => doc.patient_id === patientId),
 listPatientLabHistory: async () => history,
 uploadExamDocument: async () => { documents = [draft]; return draft },
 getDocumentExtraction: async () => deferExtraction ? new Promise<LabExtraction>(resolve => { resolveExtraction = resolve }) : extraction,
 getExamDocumentFile: async () => ({ url: 'about:blank', expires_at: '2026-09-01' }),
 confirmDocument: async () => {
  confirmCount++
  if (failConfirmation) throw new Error('failed')
  documents = [{ ...draft, review_status: 'confirmed' }]; history = [report]; return report
 },
 discardDocument: async () => { discardCount++; documents = [] },
}
mock.module('../src/features/patient/exams/examsApi', () => api)
const { default: ExamsPanel } = await import('../src/features/patient/exams/ExamsPanel')
let root: Root
let host: HTMLDivElement
beforeEach(async () => {
 documents = [draft]; history = []; failConfirmation = false; confirmCount = 0; discardCount = 0; deferExtraction = false; resolveExtraction = null
 host = document.createElement('div'); document.body.append(host); root = createRoot(host)
 await act(async () => { root.render(<ExamsPanel patientId="patient-1" patientName="Paciente selecionado" />) })
})
afterEach(async () => { await act(async () => root.unmount()); host.remove() })

function button(text: string) {
 const found = [...host.querySelectorAll('button')].find(node => node.textContent === text)
 if (!found) throw new Error(`Button not found: ${text}`)
 return found
}
async function click(text: string) { await act(async () => button(text).click()) }

test('retoma rascunho, mostra PDF, referências e avisos, e só confirma após conferência', async () => {
 expect(confirmCount).toBe(0)
 await click('Conferir')
 expect(host.textContent).toContain('Paciente selecionado')
 expect(host.textContent).toContain('Paciente do PDF')
 expect(host.textContent).toContain('RESUMO DA API')
 expect(host.textContent).toContain('70–99')
 expect(host.textContent).toContain('Confira a data ausente.')
 expect(host.querySelector('iframe')?.src).toBe('about:blank')
 expect(button('Confirmar exame').disabled).toBe(true)
 await act(async () => (host.querySelector('input[type=checkbox]') as HTMLInputElement).click())
 await click('Confirmar exame')
 expect(confirmCount).toBe(1)
 expect(host.textContent).toContain('Exame confirmado no histórico')
 expect(host.textContent).toContain('Laboratório confirmado')
})

test('falha na confirmação mantém rascunho e permite tentar novamente', async () => {
 await click('Conferir')
 await act(async () => (host.querySelector('input[type=checkbox]') as HTMLInputElement).click())
 failConfirmation = true
 await click('Confirmar exame')
 expect(host.querySelector('[role=alert]')).not.toBeNull()
 expect(host.textContent).not.toContain('Exame confirmado no histórico')
 expect(host.textContent).toContain('Aguardando conferência')
 failConfirmation = false
 await click('Confirmar exame')
 expect(confirmCount).toBe(2)
 expect(host.textContent).toContain('Exame confirmado no histórico')
})

test('descartar remove pendência sem criar exame no histórico', async () => {
 await click('Descartar rascunho')
 expect(discardCount).toBe(1)
 expect(confirmCount).toBe(0)
 expect(host.textContent).toContain('Rascunho e PDF excluídos')
 expect(host.textContent).toContain('Nenhum exame confirmado')
})

test('trocar paciente ignora uma extração atrasada do paciente anterior', async () => {
 deferExtraction = true
 await click('Conferir')
 await act(async () => root.render(<ExamsPanel patientId="patient-2" patientName="Outro paciente" />))
 await act(async () => resolveExtraction?.(extraction))
 expect(host.textContent).toContain('Outro paciente')
 expect(host.textContent).not.toContain('Paciente do PDF')
 expect(host.textContent).not.toContain('laboratorio.pdf')
})
