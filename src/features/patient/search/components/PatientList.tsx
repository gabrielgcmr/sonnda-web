// src/features/patient/search/components/PatientList.tsx
import { Link } from 'react-router-dom'
import Avatar from '../../../../components/ui/Avatar'
import { PatientRoutes } from '../../patientRoutes'
import { formatBirthDate, maskCpf } from '../../../../utils/formatters'
import type { Patient } from '../../types'
import './PatientList.css'

function PatientList({ patients }: { patients: Patient[] }) {
  return (
    <ul className="patient-list">
      {patients.map((patient) => (
        <li className="patient-card" key={patient.id}>
          <Link
            className="patient-card__link"
            to={`${PatientRoutes.details}/${encodeURIComponent(patient.id)}`}
            aria-label={`Ver detalhes de ${patient.full_name || 'paciente'}`}
          >
            <div className="patient-card__identity">
              <Avatar name={patient.full_name || 'Paciente'} />
              <h2>{patient.full_name || 'Nome não informado'}</h2>
            </div>
            <dl className="patient-card__details">
              <div><dt>Nascimento</dt><dd>{formatBirthDate(patient.birth_date)}</dd></div>
              <div><dt>CPF</dt><dd>{maskCpf(patient.cpf)}</dd></div>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default PatientList
