// src/features/patient/PatientDetailPage.tsx
import { useEffect, useReducer, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileText, HeartPulse, Pill } from 'lucide-react'
import { ApiError } from '../../services/api/errors'
import { formatBirthDate, maskCpf } from '../../utils/formatters'
import { getPatient } from './patientsApi'
import type { Patient } from './types'
import './PatientDetailPage.css'

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
    <section className="patient-detail" aria-labelledby="patient-detail-title">
      <div className="patient-detail__content">
        {patient && (
          <div className="patient-detail__heading">
            <span className="eyebrow">Paciente</span>
            <h1 id="patient-detail-title">{patient.full_name || 'Nome não informado'}</h1>
          </div>
        )}
        {!patient && <h1 id="patient-detail-title">Detalhes do paciente</h1>}

        {loading ? <p className="muted" role="status">Carregando dados do paciente…</p> : null}

        {error ? (
          <div className="patient-detail__error">
            <p className="error-banner" role="alert">{error}</p>
            <button className="button button-primary" onClick={() => setRevision((value) => value + 1)}>
              Tentar novamente
            </button>
          </div>
        ) : null}

        {patient ? (
          <dl className="patient-detail__fields">
            <div><dt>Data de nascimento</dt><dd>{formatBirthDate(patient.birth_date)}</dd></div>
            <div><dt>CPF</dt><dd>{maskCpf(patient.cpf)}</dd></div>
            <div><dt>Gênero</dt><dd>{formatCategory(patient.gender, genderLabels)}</dd></div>
          </dl>
        ) : null}
      </div>

      <div className="patient-detail__workspace">
        <section
          className="patient-detail__section-panel"
          id={`patient-section-${activeSection.id}`}
          role="tabpanel"
          aria-labelledby={`patient-tab-${activeSection.id}`}
          tabIndex={0}
        >
          <h2>{activeSection.label}</h2>
          <p className="muted">Esta seção ainda não está disponível.</p>
        </section>

        <aside className="patient-detail__navigation" aria-label="Seções do paciente">
          <div role="tablist" aria-orientation="vertical" aria-label="Seções do paciente">
            {patientSections.map(({ id, label, Icon }) => (
              <button
                key={id}
                className="patient-detail__tab"
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