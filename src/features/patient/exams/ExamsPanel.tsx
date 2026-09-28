import { useEffect, useState, type FormEvent } from 'react'
import { FileText } from 'lucide-react'
import { ApiError } from '@/services/api/errors'
import {
  listExamDocuments,
  uploadExamDocument,
  type ExamDocument,
} from './examsApi'
import './ExamsPanel.css'

const maxExamFileSize = 10 * 1024 * 1024

const examStatusLabels: Record<string, string> = {
  UPLOADED: 'Recebido',
  PROCESSING: 'Em processamento',
  PROCESSED: 'Processado',
  NEEDS_REVIEW: 'Requer revisão',
  FAILED: 'Falhou',
}

function formatExamDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Data não informada'
    : new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(date)
}

type ExamsPanelProps = {
  patientId: string
}

export default function ExamsPanel({ patientId }: ExamsPanelProps) {
  const [documents, setDocuments] = useState<ExamDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [collectionDate, setCollectionDate] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)
  const [refreshSequence, setRefreshSequence] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setListError(null)

    listExamDocuments(patientId, undefined, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setDocuments(data)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setListError('Não foi possível carregar os documentos de exame.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [patientId, refreshSequence])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setUploadError(null)
    setUploadSuccess(null)

    if (!selectedFile) {
      setUploadError('Selecione o PDF do exame para enviar.')
      return
    }
    if (
      selectedFile.type !== 'application/pdf' &&
      !selectedFile.name.toLowerCase().endsWith('.pdf')
    ) {
      setUploadError('Selecione um arquivo em PDF.')
      return
    }
    if (selectedFile.size > maxExamFileSize) {
      setUploadError('O PDF deve ter no máximo 10 MB.')
      return
    }

    setUploading(true)
    try {
      const document = await uploadExamDocument(patientId, {
        file: selectedFile,
        collection_date: collectionDate || undefined,
      })
      setDocuments((current) => [
        document,
        ...current.filter(({ id }) => id !== document.id),
      ])
      setSelectedFile(null)
      setCollectionDate('')
      event.currentTarget.reset()
      setUploadSuccess(
        'Exame enviado com sucesso. O processamento pode levar alguns instantes.',
      )
      setRefreshSequence((value) => value + 1)
    } catch (requestError: unknown) {
      setUploadError(
        requestError instanceof ApiError
          ? requestError.message
          : 'Não foi possível enviar o exame. Tente novamente.',
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="exams-panel">
      <div>
        <h2>Exames</h2>
        <p className="muted">
          Envie o PDF do exame laboratorial para anexá-lo ao histórico do paciente.
        </p>
      </div>

      <form className="exams-panel__form" onSubmit={handleSubmit} noValidate>
        <label className="field" htmlFor="exam-file">
          <span>PDF do exame</span>
          <input
            id="exam-file"
            name="file"
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            disabled={uploading}
          />
          <small>Formato PDF, até 10 MB.</small>
        </label>
        <label className="field" htmlFor="exam-collection-date">
          <span>Data da coleta <em>(opcional)</em></span>
          <input
            id="exam-collection-date"
            name="collection_date"
            type="date"
            value={collectionDate}
            onChange={(event) => setCollectionDate(event.target.value)}
            disabled={uploading}
          />
        </label>
        <div className="exams-panel__submit">
          <button className="button button-primary" type="submit" disabled={uploading}>
            {uploading ? 'Enviando exame…' : 'Enviar exame'}
          </button>
        </div>
      </form>

      {uploadError ? <p className="error-banner" role="alert">{uploadError}</p> : null}
      {uploadSuccess ? <p className="exams-panel__success" role="status">{uploadSuccess}</p> : null}

      <section className="exams-panel__list" aria-labelledby="exam-documents-title">
        <h3 id="exam-documents-title">Documentos enviados</h3>
        {loading ? <p className="muted" role="status">Carregando exames…</p> : null}
        {listError ? <p className="error-banner" role="alert">{listError}</p> : null}
        {!loading && !listError && documents.length === 0 ? (
          <p className="muted">Nenhum exame enviado ainda.</p>
        ) : null}
        {!loading && !listError && documents.length > 0 ? (
          <ul className="exams-panel__documents">
            {documents.map((document) => (
              <li key={document.id}>
                <FileText aria-hidden="true" size={18} strokeWidth={1.8} />
                <div>
                  <strong>{document.original_filename}</strong>
                  <span>Enviado em {formatExamDate(document.created_at)}</span>
                </div>
                <span className="exams-panel__status">
                  {examStatusLabels[document.status] ?? document.status}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  )
}
