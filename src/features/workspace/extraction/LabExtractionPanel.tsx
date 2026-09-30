// src/features/workspace/extraction/LabExtractionPanel.tsx
import { useState, type FormEvent } from 'react'
import { Copy, FileSearch } from 'lucide-react'
import { ApiError } from '@/services/api/errors'
import { extractTemporaryLabReport, type TemporaryLabExtraction } from './extractionApi'
import './LabExtractionPanel.css'

const maximumFileSize = 10 * 1024 * 1024

function statusLabel(status: string) {
  return ({ succeeded: 'Concluída', partial: 'Parcial', needs_review: 'Requer revisão', failed: 'Falhou' } as Record<string, string>)[status] ?? status
}

export default function LabExtractionPanel() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<TemporaryLabExtraction | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setCopied(false)
    setResult(null)
    if (!file) {
      setError('Selecione um PDF para extrair os dados.')
      return
    }
    if (file.size > maximumFileSize) {
      setError('O PDF deve ter no máximo 10 MB.')
      return
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Envie um arquivo em PDF.')
      return
    }
    setLoading(true)
    try {
      setResult(await extractTemporaryLabReport(file))
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'Não foi possível extrair os dados do exame.')
    } finally {
      setLoading(false)
    }
  }

  async function copySummary() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.summary_text)
      setCopied(true)
    } catch {
      setError('Não foi possível copiar o resultado.')
    }
  }

  return (
    <section className="lab-extraction" aria-labelledby="lab-extraction-title">
      <div className="lab-extraction__intro">
        <h2 id="lab-extraction-title">Extrair dados de exame</h2>
        <p className="muted">O PDF e o resultado são descartados ao sair ou recarregar esta página.</p>
      </div>
      <div className="lab-extraction__workspace">
        <form className="lab-extraction__form" onSubmit={submit} noValidate>
          <div><h3>Enviar PDF</h3><p className="muted">Selecione um exame laboratorial para gerar um resumo temporário.</p></div>
          <label className="field" htmlFor="lab-extraction-file">
            <span>PDF laboratorial</span>
            <input id="lab-extraction-file" type="file" accept="application/pdf,.pdf" disabled={loading}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <small>PDF com texto selecionável, até 10 MB. PDFs escaneados não são compatíveis nesta versão.</small>
          </label>
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Extraindo dados…' : 'Extrair dados'}</button>
          {error && <p className="error-banner" role="alert">{error}</p>}
        </form>
        <section className="lab-extraction__summary" aria-labelledby="extraction-result-title" aria-live="polite">
          <div className="lab-extraction__summary-heading">
            <div><h3 id="extraction-result-title">Resumo extraído</h3>{result && <p className="muted">Status: {statusLabel(result.status)}</p>}</div>
            {result && <button className="button button-secondary" type="button" onClick={copySummary}><Copy aria-hidden="true" size={16} />{copied ? 'Copiado' : 'Copiar resumo'}</button>}
          </div>
          {loading && <p className="muted" role="status">Extraindo os dados do PDF…</p>}
          {!loading && !result && <div className="lab-extraction__empty"><FileSearch aria-hidden="true" size={28} /><p className="muted">Envie um PDF para visualizar o resumo extraído.</p></div>}
          {result && <>
            {(result.warnings ?? []).map((warning) => <p className="lab-extraction__warning" key={`${warning.code}-${warning.field ?? ''}`}>{warning.message}</p>)}
            <pre className="lab-extraction__summary-text">{result.summary_text}</pre>
          </>}
        </section>
      </div>
    </section>
  )
}
