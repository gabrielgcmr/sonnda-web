// src/pages/PatientsPage/PatientsPage.tsx
import { useAuth } from '../../features/auth/hooks/useAuth'
import PatientDirectory from '../../features/patient/components/PatientDirectory'

function PatientsPage() {
  const { userProfile } = useAuth()
  return <PatientDirectory key={userProfile?.id} />
}

export default PatientsPage
