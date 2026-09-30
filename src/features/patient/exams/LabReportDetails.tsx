// src/features/patient/exams/LabReportDetails.tsx
import type { LabExtraction } from './examsApi'

type Report = LabExtraction['report']

export default function LabReportDetails({ report }: { report: Report }) {
 const fields = [
  ['Paciente no documento', report.patient_name], ['Nascimento', report.patient_dob],
  ['Laboratório', report.lab_name], ['Telefone', report.lab_phone], ['Convênio', report.insurance_provider],
  ['Solicitante', report.requesting_doctor], ['Responsável técnico', report.technical_manager], ['Data do laudo', report.report_date],
 ]
 return <div className="exam-review__details">
  <dl>{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Não identificado'}</dd></div>)}</dl>
  {(report.tests ?? []).map((test, index) => <section key={index}>
   <h4>{test.test_name}</h4>
   <p className="muted">Coleta: {test.collected_at || 'Não identificada'} · Liberação: {test.release_at || 'Não identificada'}</p>
   <p className="muted">Material: {test.material || 'Não identificado'} · Método: {test.method || 'Não identificado'}</p>
   <div className="exam-review__table"><table><thead><tr><th>Parâmetro</th><th>Resultado</th><th>Unidade</th><th>Referência</th></tr></thead>
    <tbody>{(test.items ?? []).map((item, itemIndex) => <tr key={itemIndex}>
     <td>{item.parameter_name}</td><td>{item.result_value ?? 'Não identificado'}</td><td>{item.result_unit ?? '—'}</td><td>{item.reference_text ?? '—'}</td>
    </tr>)}</tbody>
   </table></div>
  </section>)}
 </div>
}
