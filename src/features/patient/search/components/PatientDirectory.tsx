// src/features/patient/search/components/PatientDirectory.tsx
import { useState } from 'react'
import { usePatients } from '../hooks/usePatients'
import { filterPatients } from '../utils/filterPatients'
import PatientList from './PatientList'

function PatientDirectory() {
  const [query, setQuery] = useState('')
  const { patients, loading, failed, refresh } = usePatients()
  const visiblePatients = filterPatients(patients, query)

  return (
    <section className="grid gap-6" aria-labelledby="patients-title">
      <div className="flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-stretch">
        <div>
          <span className="eyebrow">Seus cuidados</span>
          <h1 className="text-[clamp(1.6rem,3vw,2.2rem)]" id="patients-title">Pacientes</h1>
          <p className="muted">Encontre os pacientes aos quais você tem acesso.</p>
        </div>
        <button className="button button-secondary" onClick={refresh} disabled={loading}>
          {loading ? 'Carregando…' : 'Atualizar'}
        </button>
      </div>
      <div className="flex items-end justify-between gap-4 max-[600px]:flex-col max-[600px]:items-stretch">
        <label className="field flex-1" htmlFor="patient-search">
          <span>Buscar pacientes</span>
          <input id="patient-search" type="search" value={query}
            placeholder="Nome, CPF, CNS ou telefone" onChange={(event) => setQuery(event.target.value)} />
        </label>
        {query && <button className="button button-secondary" onClick={() => setQuery('')}>Limpar busca</button>}
      </div>
      {loading ? <p role="status" className="muted grid justify-items-center gap-4 px-4 py-8 text-center">Carregando pacientes…</p>
        : failed ? (
          <div className="grid justify-items-center gap-4 px-4 py-8 text-center">
            <p role="alert" className="error-banner">Não foi possível carregar os pacientes. Tente novamente.</p>
            <button className="button button-primary" onClick={refresh}>Tentar novamente</button>
          </div>
        ) : (
          <>
            <p className="muted" role="status">{visiblePatients.length} {visiblePatients.length === 1 ? 'paciente' : 'pacientes'} na lista</p>
            {visiblePatients.length === 0 ? (
              <div className="info-card grid justify-items-center gap-4 px-4 py-8 text-center">
                <h2>{query.trim() ? 'Nenhum paciente encontrado' : 'Nenhum paciente disponível'}</h2>
                <p className="muted">{query.trim() ? 'Tente buscar por outro dado do paciente.' : 'Seus pacientes e os compartilhados com você aparecerão aqui.'}</p>
              </div>
            ) : (
              <PatientList patients={visiblePatients} />
            )}
          </>
        )}
    </section>
  )
}

export default PatientDirectory
