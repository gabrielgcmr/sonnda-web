// src/features/patient/exams/ExamsPanel.tsx
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ApiError } from '@/services/api/errors'
import {
 listAllExamDocuments, listPatientLabHistory, uploadExamDocument, getDocumentExtraction,
 getExamDocumentFile, confirmDocument, discardDocument, type ExamDocument, type LabExtraction, type LabReport,
} from './examsApi'
import LabReportDetails from './LabReportDetails'
import { savedReportView } from './reportView'

const statusLabels: Record<string, string> = { uploaded: 'Recebido', processing: 'Em processamento', processed: 'Extraído', needs_review: 'Requer conferência', failed: 'Falhou' }
const errorMessage = (error: unknown) => error instanceof ApiError ? error.message : 'Não foi possível concluir a operação. Tente novamente.'

type Props = { patientId: string; patientName?: string }
export default function ExamsPanel(props: Props) {
 return <PatientExams key={props.patientId} {...props} />
}

function PatientExams({ patientId, patientName }: Props) {
 const [documents, setDocuments] = useState<ExamDocument[]>([])
 const [history, setHistory] = useState<LabReport[]>([])
 const [loading, setLoading] = useState(true)
 const [listError, setListError] = useState<string | null>(null)
 const [error, setError] = useState<string | null>(null)
 const [message, setMessage] = useState<string | null>(null)
 const [busy, setBusy] = useState(false)
 const [selected, setSelected] = useState<ExamDocument | null>(null)
 const [extraction, setExtraction] = useState<LabExtraction | null>(null)
 const [fileURL, setFileURL] = useState<string | null>(null)
 const [checked, setChecked] = useState(false)
 const [file, setFile] = useState<File | null>(null)
 const lifecycle = useRef<AbortController | null>(null)
 const inFlight = useRef(false)
 const fileInput = useRef<HTMLInputElement>(null)

 async function load(signal: AbortSignal) {
  try {
   const [docs, reports] = await Promise.all([listAllExamDocuments(patientId, signal), listPatientLabHistory(patientId, signal)])
   if (signal.aborted) return
   setDocuments(docs); setHistory(reports); setListError(null)
   setSelected(current => current ? docs.find(doc => doc.id === current.id) ?? null : null)
  } catch (requestError) {
   if (!signal.aborted) setListError(errorMessage(requestError))
  } finally { if (!signal.aborted) setLoading(false) }
 }
 useEffect(() => {
  const controller = new AbortController(); lifecycle.current = controller
  void load(controller.signal)
  return () => controller.abort()
  // The keyed component remounts when the patient changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [patientId])

 async function action(work: (signal: AbortSignal) => Promise<void>) {
  const signal = lifecycle.current?.signal
  if (!signal || signal.aborted || inFlight.current) return
  inFlight.current = true; setBusy(true); setError(null); setMessage(null)
  try { await work(signal) }
  catch (requestError) { if (!signal.aborted) setError(errorMessage(requestError)) }
  finally { inFlight.current = false; if (!signal.aborted) setBusy(false) }
 }
 async function open(document: ExamDocument, signal: AbortSignal) {
  setSelected(document); setExtraction(null); setFileURL(null); setChecked(false)
  const [pdf, result] = await Promise.all([
   getExamDocumentFile(document.id, signal),
   document.review_status ? getDocumentExtraction(document.id, signal) : Promise.resolve(null),
  ])
  if (signal.aborted) return
  setFileURL(pdf.url); setExtraction(result)
 }
 async function upload(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  if (!file) { setError('Selecione um PDF laboratorial.'); return }
  if (file.size > 10 * 1024 * 1024) { setError('O PDF deve ter no máximo 10 MB.'); return }
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) { setError('Selecione um arquivo PDF.'); return }
  await action(async signal => {
   const document = await uploadExamDocument(patientId, { file }, signal)
   if (signal.aborted) return
   setDocuments(current => [document, ...current]); setFile(null)
   if (fileInput.current) fileInput.current.value = ''
   setMessage('Rascunho salvo. Confira o PDF e os dados antes de confirmar no histórico.')
   await open(document, signal)
  })
 }
 async function confirm() {
  if (!selected || !checked) return
  await action(async signal => {
   const report = await confirmDocument(selected.id, signal)
   if (signal.aborted) return
   setHistory(current => [report, ...current.filter(item => item.id !== report.id)])
   setSelected(null); setExtraction(null); setFileURL(null)
   setMessage('Exame confirmado no histórico do paciente.')
   await load(signal)
  })
 }
 async function discard(document: ExamDocument) {
  await action(async signal => {
   try { await discardDocument(document.id, signal) }
   catch (requestError) {
    if (!(requestError instanceof ApiError && requestError.status === 404)) { await load(signal); throw requestError }
   }
   if (signal.aborted) return
   setDocuments(current => current.filter(item => item.id !== document.id))
   if (selected?.id === document.id) { setSelected(null); setExtraction(null); setFileURL(null) }
   setMessage('Rascunho e PDF excluídos.')
  })
 }
 const drafts = documents.filter(doc => doc.review_status === 'pending' || doc.review_status === 'deleting')
 const legacy = documents.filter(doc => !doc.review_status)
 return <div className="grid min-w-0 gap-5">
  <div><h2>Exames laboratoriais</h2><p className="muted">Paciente selecionado: <strong>{patientName || patientId}</strong></p></div>
  <form className="grid items-end gap-3 min-[601px]:grid-cols-[minmax(0,1fr)_auto]" onSubmit={upload} noValidate>
   <label className="field" htmlFor="exam-file"><span>PDF laboratorial</span><input className="p-[0.7rem]" ref={fileInput} id="exam-file" type="file" accept="application/pdf,.pdf" disabled={busy} onChange={event => setFile(event.target.files?.[0] ?? null)} />
    <small className="text-(--app-muted)!">PDF com texto selecionável, até 10 MB. PDFs escaneados não são compatíveis.</small></label>
   <button className="button button-primary" disabled={busy}>{busy ? 'Aguarde…' : 'Extrair e conferir'}</button>
  </form>
  {error && <p className="error-banner" role="alert">{error}</p>}
  {message && <p role="status">{message}</p>}
  {listError && <div className="error-banner" role="alert">{listError} <button className="button button-secondary" disabled={busy} onClick={() => void action(load)}>Recarregar</button></div>}
  {loading && <p role="status">Carregando exames…</p>}
  <section><h3>Pendentes de confirmação</h3>
   {!loading && drafts.length === 0 && <p className="muted">Nenhum rascunho pendente.</p>}
   <ul className="m-0 grid list-none gap-2 p-0">{drafts.map(doc => <li className="flex flex-wrap items-center gap-[0.65rem] rounded-[10px] border border-(--app-outline) bg-(--app-surface) p-3" key={doc.id}>
    <div className="grid min-w-40 flex-1 gap-[0.2rem]"><strong className="wrap-anywhere">{doc.original_filename}</strong><span className="wrap-anywhere text-[0.8rem] text-(--app-muted)">{doc.review_status === 'deleting' ? 'Exclusão pendente' : 'Aguardando conferência'}</span></div>
    {doc.review_status === 'pending' && <button className="button button-secondary" disabled={busy} onClick={() => void action(signal => open(doc, signal))}>Conferir</button>}
    <button className="button button-secondary" disabled={busy} onClick={() => void discard(doc)}>{doc.review_status === 'deleting' ? 'Concluir exclusão' : 'Descartar rascunho'}</button>
   </li>)}</ul>
  </section>
  {selected && <section className="min-w-0 border-t border-(--app-outline) pt-6" aria-label="Conferência do exame">
   <h3>{selected.original_filename}</h3>
   <p>Confira se o documento pertence a <strong>{patientName || patientId}</strong> e se os resultados estão corretos.</p>
   <div className="grid items-start gap-6 min-[901px]:grid-cols-2">
    <div>{fileURL && <><a href={fileURL} target="_blank" rel="noreferrer">Abrir PDF em outra aba</a><iframe className="mt-3 h-[70vh] min-h-100 w-full rounded-lg border border-(--app-outline) bg-white" title="PDF original do exame" src={fileURL} /></>}</div>
    <div>{extraction && <>
     <p>Paciente no documento: <strong>{extraction.report.patient_name || 'Não identificado'}</strong></p>
     <p>{extraction.status === 'partial' ? 'Extração parcial: confira os dados disponíveis.' : 'Confira todos os resultados antes de salvar.'}</p>
     {(extraction.warnings ?? []).map((warning, index) => <p className="rounded-[0.4rem] border border-(--app-warning-container) bg-[color-mix(in_srgb,var(--app-warning-container)_30%,transparent)] p-3 text-(--app-on-warning-container)" key={index}>{warning.message}</p>)}
     <pre className="wrap-anywhere whitespace-pre-wrap rounded-lg border border-(--app-outline) bg-(--md-sys-color-surface-container-lowest) p-4 font-[inherit]">{extraction.summary_text}</pre>
     <LabReportDetails report={extraction.report} />
    </>}</div>
   </div>
   {selected.review_status === 'pending' && extraction && <div className="mt-4 flex flex-wrap items-center gap-4">
    <label className="basis-full"><input className="mr-2 size-4! p-0!" type="checkbox" checked={checked} disabled={busy} onChange={event => setChecked(event.target.checked)} /> Conferi o paciente, os resultados e os avisos.</label>
    <button className="button button-primary" disabled={busy || !checked} onClick={() => void confirm()}>Confirmar exame</button>
    <button className="button button-secondary" disabled={busy} onClick={() => void discard(selected)}>Descartar rascunho e PDF</button>
   </div>}
  </section>}
  <section><h3>Histórico confirmado</h3>
   {!loading && history.length === 0 && <p className="muted">Nenhum exame confirmado.</p>}
   {history.map(report => <details key={report.id} className="border-b border-(--app-outline) py-4"><summary className="cursor-pointer font-semibold">{report.lab_name || 'Exame laboratorial'} · {report.report_date?.slice(0, 10) || 'Data do laudo não identificada'}</summary>
    <LabReportDetails report={savedReportView(report)} />
    {report.exam_document_id && <button className="button button-secondary" disabled={busy} onClick={() => void action(async signal => {
     const doc = documents.find(item => item.id === report.exam_document_id)
     if (doc) await open(doc, signal)
    })}>Ver documento original</button>}
   </details>)}
  </section>
  {legacy.length > 0 && <section><h3>Documentos anteriores</h3><ul className="m-0 grid list-none gap-2 p-0">{legacy.map(doc => <li className="flex flex-wrap items-center gap-[0.65rem] rounded-[10px] border border-(--app-outline) bg-(--app-surface) p-3" key={doc.id}>
   <span className="wrap-anywhere flex-1">{doc.original_filename} · {statusLabels[doc.status] ?? doc.status}</span>
   <button className="button button-secondary" disabled={busy} onClick={() => void action(signal => open(doc, signal))}>Ver PDF</button>
  </li>)}</ul></section>}
 </div>
}
