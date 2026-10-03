// src/features/patient/PatientDetailPage.tsx
import { useEffect, useReducer, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileText, HeartPulse, Pill } from 'lucide-react'
import { ApiError } from '../../services/api/errors'
import { formatBirthDate, maskCpf } from '../../utils/formatters'
import { getPatient } from './patientsApi'
import ExamsPanel from './exams/ExamsPanel'
import type { Patient } from './types'

const genderLabels: Record<string, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  OTHER: 'Outro',
  UNKNOWN: 'Não informado',
}

const patientSections = [
  { id: 'problems', label: 'Problemas', Icon: HeartPulse },
  { id: 'exams', label: 'Exames', Icon: FileText },
  { id: 'medications', label: 'Medicações', Icon: Pill },
] as const

type PatientSectionId = (typeof patientSections)[number]['id']

type DetailState = {
  patient: Patient | null
  loading: boolean
  error: string | null
}

type DetailAction =
  | { type: 'request' }
  | { type: 'invalid-id' }
  | { type: 'success'; patient: Patient }
  | { type: 'failure'; error: string }

function detailReducer(state: DetailState, action: DetailAction): DetailState {
  switch (action.type) {
    case 'request':
      return { patient: null, loading: true, error: null }
    case 'invalid-id':
      return { patient: null, loading: false, error: 'Identificador do paciente inválido.' }
    case 'success':
      return { patient: action.patient, loading: false, error: null }
    case 'failure':
      return { patient: null, loading: false, error: action.error }
    default:
      return state
  }
}

function formatCategory(value: string | null | undefined, labels: Record<string, string>) {
  return value ? labels[value] ?? value : 'Não informado'
}

function PatientDetailPage() {
  const { patientId } = useParams()
  const [detailState, dispatch] = useReducer(detailReducer, {
    patient: null,
    loading: true,
    error: null,
  })
  const [revision, setRevision] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState<PatientSectionId>('problems')
  const { patient, loading, error } = detailState
  const activeSection = patientSections.find(({ id }) => id === activeSectionId)!

  useEffect(() => {
    const controller = new AbortController()
    dispatch({ type: 'request' })

    if (!patientId) {
      dispatch({ type: 'invalid-id' })
      return () => controller.abort()
    }

    getPatient(patientId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) dispatch({ type: 'success', patient: data })
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        dispatch({
          type: 'failure',
          error:
            requestError instanceof ApiError && requestError.status === 404
              ? 'Paciente não encontrado ou sem acesso.'
              : 'Não foi possível carregar os dados do paciente.',
        })
      })

    return () => controller.abort()
  }, [patientId, revision])

  return (
    <section className="grid content-start gap-3" aria-labelledby="patient-detail-title">
      <div className="grid min-w-0 justify-items-start gap-[0.65rem]">
        {patient && (
          <div className="grid justify-items-start gap-1">
            <span className="eyebrow">Paciente</span>
            <h1 className="wrap-anywhere m-0 text-[1.4rem]" id="patient-detail-title">{patient.full_name || 'Nome não informado'}</h1>
          </div>
        )}
        {!patient && <h1 id="patient-detail-title">Detalhes do paciente</h1>}

        {loading ? <p className="muted" role="status">Carregando dados do paciente…</p> : null}

        {error ? (
          <div className="grid justify-items-start gap-3">
            <p className="error-banner" role="alert">{error}</p>
            <button className="button button-primary" onClick={() => setRevision((value) => value + 1)}>
              Tentar novamente
            </button>
          </div>
        ) : null}

        {patient ? (
          <dl className="m-0 grid w-full gap-x-5 gap-y-3 min-[601px]:grid-cols-3 max-[600px]:gap-[0.65rem]">
            <div className="min-w-0"><dt className="text-[0.65rem] text-(--app-muted)">Data de nascimento</dt><dd className="mt-[0.15rem] mb-0 wrap-anywhere">{formatBirthDate(patient.birth_date)}</dd></div>
            <div className="min-w-0"><dt className="text-[0.65rem] text-(--app-muted)">CPF</dt><dd className="mt-[0.15rem] mb-0 wrap-anywhere">{maskCpf(patient.cpf)}</dd></div>
            <div className="min-w-0"><dt className="text-[0.65rem] text-(--app-muted)">Gênero</dt><dd className="mt-[0.15rem] mb-0 wrap-anywhere">{formatCategory(patient.gender, genderLabels)}</dd></div>
          </dl>
        ) : null}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 max-[600px]:gap-2">
        <section
          className="min-h-32 min-w-0 rounded-lg border border-(--app-outline) bg-(--app-surface) p-4 [&>h2]:mb-3 [&>h2]:text-base"
          id={`patient-section-${activeSection.id}`}
          role="tabpanel"
          aria-labelledby={`patient-tab-${activeSection.id}`}
          tabIndex={0}
        >
          {activeSectionId === 'exams' && patientId ? (
            <ExamsPanel patientId={patientId} patientName={patient?.full_name} />
          ) : (
            <>
              <h2>{activeSection.label}</h2>
              <p className="muted">Esta seção ainda não está disponível.</p>
            </>
          )}
        </section>

        <aside aria-label="Seções do paciente">
          <div className="grid gap-2" role="tablist" aria-orientation="vertical" aria-label="Seções do paciente">
            {patientSections.map(({ id, label, Icon }) => (
              <button
                key={id}
                className="relative grid aspect-square w-11 place-items-center rounded-lg border border-(--app-outline) bg-(--app-surface) p-0 text-(--app-muted) transition-colors hover:border-(--app-accent) hover:bg-[color-mix(in_srgb,var(--app-accent)_14%,var(--app-surface))] hover:text-(--app-accent) focus-visible:border-(--app-accent) focus-visible:bg-[color-mix(in_srgb,var(--app-accent)_14%,var(--app-surface))] focus-visible:text-(--app-accent) focus-visible:outline-2 focus-visible:outline-(--app-accent) focus-visible:outline-offset-2 aria-selected:border-(--app-accent) aria-selected:bg-[color-mix(in_srgb,var(--app-accent)_14%,var(--app-surface))] aria-selected:text-(--app-accent) max-[600px]:w-10"
                id={`patient-tab-${id}`}
                type="button"
                role="tab"
                aria-label={label}
                aria-controls={`patient-section-${id}`}
                aria-selected={activeSectionId === id}
                title={label}
                onClick={() => setActiveSectionId(id)}
              >
                <Icon aria-hidden="true" size={20} strokeWidth={1.8} />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default PatientDetailPage
