// src/features/calculators/CalculatorsPanel.tsx
import { useState } from 'react'
import { calculators } from './registry'

function CalculatorsPanel() {
  const [activeId, setActiveId] = useState(calculators[0]?.id)
  const active = calculators.find(calculator => calculator.id === activeId) ?? calculators[0]
  if (!active) return null
  const { Component } = active

  return (
    <div className="grid items-start gap-4 min-[761px]:grid-cols-[minmax(11rem,0.3fr)_minmax(0,1fr)]">
      <nav className="grid gap-2" aria-label="Calculadoras">
        {calculators.map(({ id, label, category }) => (
          <button key={id} type="button"
            className="grid cursor-pointer gap-[0.15rem] rounded-xl border border-(--app-outline) bg-(--app-surface) px-[0.9rem] py-3 text-left text-inherit aria-pressed:border-(--app-accent) aria-pressed:bg-[color-mix(in_srgb,var(--app-accent)_10%,var(--app-surface))]"
            aria-pressed={id === active.id} onClick={() => setActiveId(id)}>
            <strong>{label}</strong>
            <small className="text-(--app-muted)">{category}</small>
          </button>
        ))}
      </nav>
      <section className="grid gap-4 rounded-2xl border border-(--app-outline) bg-(--app-surface) p-4" aria-labelledby="calculator-title">
        <div>
          <h2 className="mb-1" id="calculator-title">{active.label}</h2>
          <p className="muted">{active.description}</p>
        </div>
        <Component />
      </section>
    </div>
  )
}

export default CalculatorsPanel
