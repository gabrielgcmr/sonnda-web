// src/features/patient/search/components/PatientList.tsx
import Avatar from '../../../../components/ui/Avatar'
import { formatBirthDate, maskCpf } from '../../../../utils/formatters'
import type { Patient } from '../../types'
import './PatientList.css'

function PatientList({ patients }: { patients: Patient[] }) {
  return (
    <ul className="patient-list">
      {patients.map((patient) => (
        <li className="patient-card" key={patient.id}>
          <div className="patient-card__identity">
            <Avatar name={patient.full_name || 'Paciente'} />
            <h2>{patient.full_name || 'Nome não informado'}</h2>
          </div>
          <dl className="patient-card__details">
            <div><dt>Nascimento</dt><dd>{formatBirthDate(patient.birth_date)}</dd></div>
            <div><dt>CPF</dt><dd>{maskCpf(patient.cpf)}</dd></div>
            <div><dt>Telefone</dt><dd>{patient.phone || 'Não informado'}</dd></div>
          </dl>
        </li>
      ))}
    </ul>
  )
}

export default PatientList
