// src/features/calculators/CalculatorsPanel.tsx
import { useState } from 'react'
import { calculators } from './registry'
import './CalculatorsPanel.css'

function CalculatorsPanel() {
  const [activeId, setActiveId] = useState(calculators[0]?.id)
  const active = calculators.find(calculator => calculator.id === activeId) ?? calculators[0]
  if (!active) return null
  const { Component } = active

  return (
    <div className="calculators">
      <nav className="calculators__list" aria-label="Calculadoras">
        {calculators.map(({ id, label, category }) => (
          <button key={id} type="button" className="calculators__item"
            aria-pressed={id === active.id} onClick={() => setActiveId(id)}>
            <strong>{label}</strong>
            <small>{category}</small>
          </button>
        ))}
      </nav>
      <section className="calculators__content" aria-labelledby="calculator-title">
        <div>
          <h2 id="calculator-title">{active.label}</h2>
          <p className="muted">{active.description}</p>
        </div>
        <Component />
      </section>
    </div>
  )
}

export default CalculatorsPanel
