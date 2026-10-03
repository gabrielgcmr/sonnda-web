// src/features/patient/search/components/PatientList.tsx
import { Link } from 'react-router-dom'
import Avatar from '../../../../components/ui/Avatar'
import { PatientRoutes } from '../../patientRoutes'
import { formatBirthDate, maskCpf } from '../../../../utils/formatters'
import type { Patient } from '../../types'

function PatientList({ patients }: { patients: Patient[] }) {
  return (
    <ul className="m-0 grid list-none gap-4 p-0">
      {patients.map((patient) => (
        <li className="rounded-[20px] border border-(--app-outline) bg-(--app-surface-raised) p-5 hover:border-(--app-outline-strong) focus-within:border-(--app-outline-strong)" key={patient.id}>
          <Link
            className="block rounded-sm text-inherit no-underline focus-visible:outline-2 focus-visible:outline-(--app-accent) focus-visible:outline-offset-5"
            to={`${PatientRoutes.details}/${encodeURIComponent(patient.id)}`}
            aria-label={`Ver detalhes de ${patient.full_name || 'paciente'}`}
          >
            <div className="flex items-center gap-[0.9rem]">
              <Avatar name={patient.full_name || 'Paciente'} />
              <h2 className="wrap-anywhere text-[1.1rem]">{patient.full_name || 'Nome não informado'}</h2>
            </div>
            <dl className="mt-4 mb-0 grid gap-4 min-[601px]:grid-cols-3 max-[600px]:gap-[0.65rem]">
              <div><dt className="text-[0.85rem] text-(--app-muted)">Nascimento</dt><dd className="m-0 wrap-anywhere">{formatBirthDate(patient.birth_date)}</dd></div>
              <div><dt className="text-[0.85rem] text-(--app-muted)">CPF</dt><dd className="m-0 wrap-anywhere">{maskCpf(patient.cpf)}</dd></div>
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default PatientList
