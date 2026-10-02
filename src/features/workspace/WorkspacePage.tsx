// src/features/workspace/WorkspacePage.tsx
import { useState } from 'react'
import { FileSearch, Search, Sigma } from 'lucide-react'
import PatientsPage from '@/features/patient/search/PatientsPage'
import CalculatorsPanel from '@/features/calculators/CalculatorsPanel'
import LabExtractionPanel from './extraction/LabExtractionPanel'
import './WorkspacePage.css'

const tabs = [
  { id: 'patients', label: 'Pacientes', Icon: Search },
  { id: 'extraction', label: 'Extrair exame', Icon: FileSearch },
  { id: 'calculators', label: 'Calculadoras', Icon: Sigma },
] as const

type WorkspaceTab = (typeof tabs)[number]['id']

function WorkspacePage({ profileId }: { profileId?: string }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('patients')

  return (
    <section className="workspace" aria-labelledby="workspace-title">
      <div className="workspace__heading">
        <span className="eyebrow">Workspace profissional</span>
        <h1 id="workspace-title">Ferramentas clínicas</h1>
      </div>
      <div className="workspace__tabs" role="tablist" aria-label="Ferramentas clínicas">
        {tabs.map(({ id, label, Icon }) => (
          <button key={id} className="workspace__tab" type="button" role="tab"
            aria-selected={activeTab === id} aria-controls={`workspace-panel-${id}`}
            onClick={() => setActiveTab(id)}>
            <Icon aria-hidden="true" size={18} />{label}
          </button>
        ))}
      </div>
      <div id={`workspace-panel-${activeTab}`} role="tabpanel" className="workspace__panel">
        {activeTab === 'patients' && <PatientsPage profileId={profileId} />}
        {activeTab === 'extraction' && <LabExtractionPanel />}
        {activeTab === 'calculators' && <CalculatorsPanel />}
      </div>
    </section>
  )
}

export default WorkspacePage
