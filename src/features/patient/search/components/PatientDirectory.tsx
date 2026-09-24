// src/features/patient/search/components/PatientDirectory.tsx
import { useState } from 'react'
import { usePatients } from '../hooks/usePatients'
import { filterPatients } from '../utils/filterPatients'
import PatientList from './PatientList'
import './PatientDirectory.css'

function PatientDirectory() {
  const [query, setQuery] = useState('')
  const { patients, loading, failed, refresh } = usePatients()
  const visiblePatients = filterPatients(patients, query)

  return (
    <section className="content-stack" aria-labelledby="patients-title">
      <div className="patients-heading">
        <div>
          <span className="eyebrow">Seus cuidados</span>
          <h1 id="patients-title">Pacientes</h1>
          <p className="muted">Encontre os pacientes aos quais você tem acesso.</p>
        </div>
        <button className="button button-secondary" onClick={refresh} disabled={loading}>
          {loading ? 'Carregando…' : 'Atualizar'}
        </button>
      </div>
      <div className="patients-search">
        <label className="field" htmlFor="patient-search">
          <span>Buscar pacientes</span>
          <input id="patient-search" type="search" value={query}
            placeholder="Nome, CPF, CNS ou telefone" onChange={(event) => setQuery(event.target.value)} />
        </label>
        {query && <button className="button button-secondary" onClick={() => setQuery('')}>Limpar busca</button>}
      </div>
      {loading ? <p role="status" className="patients-empty muted">Carregando pacientes…</p>
        : failed ? (
          <div className="patients-empty">
            <p role="alert" className="error-banner">Não foi possível carregar os pacientes. Tente novamente.</p>
            <button className="button button-primary" onClick={refresh}>Tentar novamente</button>
          </div>
        ) : (
          <>
            <p className="muted" role="status">{visiblePatients.length} {visiblePatients.length === 1 ? 'paciente' : 'pacientes'} na lista</p>
            {visiblePatients.length === 0 ? (
              <div className="patients-empty info-card">
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
