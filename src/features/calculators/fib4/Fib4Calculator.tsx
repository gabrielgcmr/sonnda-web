// src/features/calculators/fib4/Fib4Calculator.tsx
import { useState } from 'react'
import { calculateFib4, interpretFib4, isValidFib4Input, type Fib4Risk } from './fib4'

const riskLabels: Record<Fib4Risk, string> = {
  low: 'Baixo risco de fibrose avançada',
  indeterminate: 'Risco indeterminado',
  high: 'Alto risco de fibrose avançada',
}

const fields = [
  { key: 'age', label: 'Idade (anos)', step: '1' },
  { key: 'ast', label: 'AST (U/L)', step: 'any' },
  { key: 'alt', label: 'ALT (U/L)', step: 'any' },
  { key: 'platelets', label: 'Plaquetas (10⁹/L)', step: 'any' },
] as const

type FieldKey = (typeof fields)[number]['key']

function Fib4Calculator() {
  const [values, setValues] = useState<Record<FieldKey, string>>({ age: '', ast: '', alt: '', platelets: '' })

  const input = {
    age: parseFloat(values.age.replace(',', '.')),
    ast: parseFloat(values.ast.replace(',', '.')),
    alt: parseFloat(values.alt.replace(',', '.')),
    platelets: parseFloat(values.platelets.replace(',', '.')),
  }
  const valid = isValidFib4Input(input)
  const result = valid ? calculateFib4(input) : null

  return (
    <div className="calculator">
      <div className="field-group calculator__fields">
        {fields.map(({ key, label, step }) => (
          <label key={key} className="field">
            <span>{label}</span>
            <input type="number" inputMode="decimal" min="0" step={step} value={values[key]}
              onChange={event => setValues(current => ({ ...current, [key]: event.target.value }))} />
          </label>
        ))}
      </div>
      <div className="calculator__result" aria-live="polite">
        {result === null ? (
          <p className="muted">Preencha todos os campos com valores positivos.</p>
        ) : (
          <>
            <strong className="calculator__value">{result.toFixed(2).replace('.', ',')}</strong>
            <span>{riskLabels[interpretFib4(result, input.age)]}</span>
          </>
        )}
      </div>
      <p className="muted calculator__reference">
        Referência: &lt; 1,3 baixo risco (&lt; 2,0 se idade ≥ 65); 1,3–2,67 indeterminado; &gt; 2,67 alto risco.
      </p>
    </div>
  )
}

export default Fib4Calculator
