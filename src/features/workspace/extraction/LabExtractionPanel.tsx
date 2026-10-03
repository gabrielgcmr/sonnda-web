// src/features/workspace/extraction/LabExtractionPanel.tsx
import { useState, type FormEvent } from 'react'
import { Copy, FileSearch } from 'lucide-react'
import { ApiError } from '@/services/api/errors'
import { extractTemporaryLabReport, type TemporaryLabExtraction } from './extractionApi'

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
    <section className="grid gap-5" aria-labelledby="lab-extraction-title">
      <div className="grid gap-[0.35rem]">
        <h2 id="lab-extraction-title">Extrair dados de exame</h2>
        <p className="muted">O PDF e o resultado são descartados ao sair ou recarregar esta página.</p>
      </div>
      <div className="grid grid-cols-[minmax(17rem,0.8fr)_minmax(0,1.2fr)] items-stretch gap-4 max-[760px]:grid-cols-1">
        <form className="grid content-start gap-4 rounded-2xl border border-(--app-outline) bg-(--app-surface) p-4" onSubmit={submit} noValidate>
          <div><h3 className="m-0 mb-1">Enviar PDF</h3><p className="muted">Selecione um exame laboratorial para gerar um resumo temporário.</p></div>
          <label className="field" htmlFor="lab-extraction-file">
            <span>PDF laboratorial</span>
            <input id="lab-extraction-file" type="file" accept="application/pdf,.pdf" disabled={loading}
              onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            <small className="text-(--app-muted)!">PDF com texto selecionável, até 10 MB. PDFs escaneados não são compatíveis nesta versão.</small>
          </label>
          <button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Extraindo dados…' : 'Extrair dados'}</button>
          {error && <p className="error-banner" role="alert">{error}</p>}
        </form>
        <section className="grid content-start gap-4 rounded-2xl border border-(--app-outline) bg-(--app-surface) p-4" aria-labelledby="extraction-result-title" aria-live="polite">
          <div className="flex items-start justify-between gap-4 max-[420px]:flex-col">
            <div><h3 className="m-0 mb-1" id="extraction-result-title">Resumo extraído</h3>{result && <p className="muted">Status: {statusLabel(result.status)}</p>}</div>
            {result && <button className="button button-secondary gap-[0.45rem] whitespace-nowrap max-[420px]:w-full" type="button" onClick={copySummary}><Copy aria-hidden="true" size={16} />{copied ? 'Copiado' : 'Copiar resumo'}</button>}
          </div>
          {loading && <p className="muted" role="status">Extraindo os dados do PDF…</p>}
          {!loading && !result && <div className="grid min-h-56 content-center justify-items-center gap-3 rounded-xl border border-dashed border-(--app-outline-strong) p-4 text-center"><FileSearch aria-hidden="true" size={28} /><p className="muted">Envie um PDF para visualizar o resumo extraído.</p></div>}
          {result && <>
            {(result.warnings ?? []).map((warning) => <p className="m-0 border-l-[3px] border-(--md-sys-color-tertiary) bg-[color-mix(in_srgb,var(--app-warning-container)_30%,transparent)] px-[0.9rem] py-3 text-(--app-on-warning-container)" key={`${warning.code}-${warning.field ?? ''}`}>{warning.message}</p>)}
            <pre className="m-0 min-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-(--app-outline) bg-(--md-sys-color-surface-container-lowest) p-4 font-mono text-sm/relaxed text-(--md-sys-color-on-surface)">{result.summary_text}</pre>
          </>}
        </section>
      </div>
    </section>
  )
}
