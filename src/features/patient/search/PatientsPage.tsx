// src/features/patient/search/PatientsPage.tsx
import PatientDirectory from './components/PatientDirectory'

function PatientsPage({ profileId }: { profileId?: string }) {
  return <PatientDirectory key={profileId} />
}

export default PatientsPage
