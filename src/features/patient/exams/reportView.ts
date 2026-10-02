// src/features/patient/exams/reportView.ts
import type { LabExtraction, LabReport } from "./examsApi"
type Report = LabExtraction["report"]
export function savedReportView(report: LabReport): Report {
 return {
  patient_name: report.patient_name ?? null, patient_dob: report.patient_dob ?? null,
  lab_name: report.lab_name ?? null, lab_phone: report.lab_phone ?? null,
  insurance_provider: report.insurance_provider ?? null, requesting_doctor: report.requesting_doctor ?? null,
  technical_manager: report.technical_manager ?? null, report_date: report.report_date ?? null,
  tests: (report.panels ?? []).map(test => ({
   test_name: test.test_name, material: test.material ?? null, method: test.method ?? null,
   collected_at: test.collected_at ?? null, release_at: test.release_at ?? null,
   items: (test.observations ?? []).map(item => ({ parameter_name: item.parameter_name, result_value: item.result_value ?? null,
    result_unit: item.result_unit ?? null, reference_text: item.reference_text ?? null })),
  })),
 }
}

