// src/features/patient/exams/LabReportDetails.tsx
import type { LabExtraction } from './examsApi'

type Report = LabExtraction['report']

export default function LabReportDetails({ report }: { report: Report }) {
 const fields = [
  ['Paciente no documento', report.patient_name], ['Nascimento', report.patient_dob],
  ['Laboratório', report.lab_name], ['Telefone', report.lab_phone], ['Convênio', report.insurance_provider],
  ['Solicitante', report.requesting_doctor], ['Responsável técnico', report.technical_manager], ['Data do laudo', report.report_date],
 ]
 return <div className="min-w-0">
  <dl className="grid gap-3 min-[601px]:grid-cols-2">{fields.map(([label, value]) => <div key={label}><dt className="text-[0.8rem] text-(--app-muted)">{label}</dt><dd className="m-0 wrap-anywhere">{value || 'Não identificado'}</dd></div>)}</dl>
  {(report.tests ?? []).map((test, index) => <section key={index}>
   <h4>{test.test_name}</h4>
   <p className="muted">Coleta: {test.collected_at || 'Não identificada'} · Liberação: {test.release_at || 'Não identificada'}</p>
   <p className="muted">Material: {test.material || 'Não identificado'} · Método: {test.method || 'Não identificado'}</p>
   <div className="overflow-x-auto"><table className="w-full border-collapse [&_td]:border-b [&_td]:border-(--app-outline) [&_td]:p-2 [&_td]:text-left [&_th]:border-b [&_th]:border-(--app-outline) [&_th]:p-2 [&_th]:text-left"><thead><tr><th>Parâmetro</th><th>Resultado</th><th>Unidade</th><th>Referência</th></tr></thead>
    <tbody>{(test.items ?? []).map((item, itemIndex) => <tr key={itemIndex}>
     <td>{item.parameter_name}</td><td>{item.result_value ?? 'Não identificado'}</td><td>{item.result_unit ?? '—'}</td><td>{item.reference_text ?? '—'}</td>
    </tr>)}</tbody>
   </table></div>
  </section>)}
 </div>
}
