// src/features/patient/PatientDetailPage.tsx
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../../services/api/errors'
import { formatBirthDate, maskCpf } from '../../utils/formatters'
import { getPatient } from './patientsApi'
import { PatientRoutes } from './patientRoutes'
import type { Patient } from './types'
import './PatientDetailPage.css'

const genderLabels: Record<string, string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  OTHER: 'Outro',
  UNKNOWN: 'Não informado',
}

const raceLabels: Record<string, string> = {
  WHITE: 'Branca',
  BLACK: 'Preta',
  ASIAN: 'Amarela',
  MIXED: 'Parda',
  INDIGENOUS: 'Indígena',
  UNKNOWN: 'Não informado',
}

function formatCategory(value: string | null | undefined, labels: Record<string, string>) {
  return value ? labels[value] ?? value : 'Não informado'
}

function PatientDetailPage() {
  const { patientId } = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setPatient(null)
    setError(null)
    setLoading(true)

    if (!patientId) {
      setError('Identificador do paciente inválido.')
      setLoading(false)
      return () => controller.abort()
    }

    getPatient(patientId, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setPatient(data)
      })
      .catch((requestError: unknown) => {
        if (controller.signal.aborted) return
        setError(
          requestError instanceof ApiError && requestError.status === 404
            ? 'Paciente não encontrado ou sem acesso.'
            : 'Não foi possível carregar os dados do paciente.',
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [patientId, revision])

  return (
    <section className="content-stack patient-detail" aria-labelledby="patient-detail-title">
      <div className="patient-detail__heading">
        <Link className="text-link" to={PatientRoutes.search}>Voltar para pacientes</Link>
        {patient && (
          <>
            <span className="eyebrow">Paciente</span>
            <h1 id="patient-detail-title">{patient.full_name || 'Nome não informado'}</h1>
          </>
        )}
        {!patient && <h1 id="patient-detail-title">Detalhes do paciente</h1>}
      </div>

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
          <div><dt>Telefone</dt><dd>{patient.phone || 'Não informado'}</dd></div>
          <div><dt>Gênero</dt><dd>{formatCategory(patient.gender, genderLabels)}</dd></div>
          <div><dt>Raça/cor</dt><dd>{formatCategory(patient.race, raceLabels)}</dd></div>
        </dl>
      ) : null}
    </section>
  )
}

export default PatientDetailPage