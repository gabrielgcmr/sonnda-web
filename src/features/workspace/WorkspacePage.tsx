// src/features/workspace/WorkspacePage.tsx
import { useState } from 'react'
import { FileSearch, Search, Sigma } from 'lucide-react'
import PatientsPage from '@/features/patient/search/PatientsPage'
import CalculatorsPanel from '@/features/calculators/CalculatorsPanel'
import LabExtractionPanel from './extraction/LabExtractionPanel'

const tabs = [
  { id: 'patients', label: 'Pacientes', Icon: Search },
  { id: 'extraction', label: 'Extrair exame', Icon: FileSearch },
  { id: 'calculators', label: 'Calculadoras', Icon: Sigma },
] as const

type WorkspaceTab = (typeof tabs)[number]['id']

function WorkspacePage({ profileId }: { profileId?: string }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('patients')

  return (
    <section className="grid gap-5" aria-labelledby="workspace-title">
      <div className="grid gap-[0.3rem]">
        <span className="eyebrow">Workspace profissional</span>
        <h1 id="workspace-title">Ferramentas clínicas</h1>
      </div>
      <div className="flex flex-wrap gap-[0.55rem] border-b border-[var(--app-outline)] pb-3" role="tablist" aria-label="Ferramentas clínicas">
        {tabs.map(({ id, label, Icon }) => (
          <button key={id} className={`inline-flex w-auto items-center gap-2 rounded-[10px] border px-[0.85rem] py-[0.65rem] ${activeTab === id ? 'border-[color-mix(in_srgb,var(--app-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--app-accent)_12%,transparent)] text-[var(--app-foreground)]' : 'border-transparent bg-transparent text-[var(--app-muted)]'}`} type="button" role="tab"
            aria-selected={activeTab === id} aria-controls={`workspace-panel-${id}`}
            onClick={() => setActiveTab(id)}>
            <Icon aria-hidden="true" size={18} />{label}
          </button>
        ))}
      </div>
      <div id={`workspace-panel-${activeTab}`} role="tabpanel" className="min-w-0">
        {activeTab === 'patients' && <PatientsPage profileId={profileId} />}
        {activeTab === 'extraction' && <LabExtractionPanel />}
        {activeTab === 'calculators' && <CalculatorsPanel />}
      </div>
    </section>
  )
}

export default WorkspacePage
