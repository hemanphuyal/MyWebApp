import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

type CalcMode = 'percentOf' | 'whatPercent' | 'percentChange' | 'addPercent' | 'subtractPercent'

const modes: { id: CalcMode; label: string; description: string }[] = [
  { id: 'percentOf', label: 'X% of Y', description: 'Find a percentage of a number' },
  { id: 'whatPercent', label: 'X is what % of Y', description: 'Find what percent X is of Y' },
  { id: 'percentChange', label: '% Change', description: 'Percentage change from X to Y' },
  { id: 'addPercent', label: 'Add %', description: 'Add a percentage to a number' },
  { id: 'subtractPercent', label: 'Subtract %', description: 'Subtract a percentage from a number' },
]

export default function PercentageCalc() {
  const [mode, setMode] = useState<CalcMode>('percentOf')
  const [val1, setVal1] = useState('')
  const [val2, setVal2] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [explanation, setExplanation] = useState('')

  const calculate = () => {
    const a = parseFloat(val1)
    const b = parseFloat(val2)
    if (isNaN(a) || isNaN(b)) { setResult('Enter valid numbers'); setExplanation(''); return }
    let res: number, exp: string
    switch (mode) {
      case 'percentOf': res = (a / 100) * b; exp = `${a}% of ${b} = ${res}`; break
      case 'whatPercent': res = (a / b) * 100; exp = `${a} is ${res.toFixed(2)}% of ${b}`; break
      case 'percentChange': res = ((b - a) / Math.abs(a)) * 100; exp = `Change from ${a} to ${b} = ${res > 0 ? '+' : ''}${res.toFixed(2)}%`; break
      case 'addPercent': res = a + (a * b) / 100; exp = `${a} + ${b}% = ${res}`; break
      case 'subtractPercent': res = a - (a * b) / 100; exp = `${a} - ${b}% = ${res}`; break
    }
    setResult(Number.isInteger(res) ? String(res) : res.toFixed(4).replace(/\.?0+$/, ''))
    setExplanation(exp)
  }

  const labels: Record<CalcMode, [string, string]> = {
    percentOf: ['Percentage (%)', 'Number'],
    whatPercent: ['Value (X)', 'Total (Y)'],
    percentChange: ['From', 'To'],
    addPercent: ['Number', 'Percentage (%)'],
    subtractPercent: ['Number', 'Percentage (%)'],
  }
  const [label1, label2] = labels[mode]

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/tools" className="small secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Tools
        </Link>
        <span className="small muted mono" style={{ display: 'block', marginTop: 24 }}>— Tools</span>
        <h1 style={{ marginTop: 16 }}>Percentage Calculator</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>
          Calculate percentages, changes, additions and subtractions.
        </p>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <label>Calculation type</label>
            <div style={{ display: 'grid', gap: 8, marginTop: 6 }}>
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setMode(m.id); setResult(null) }}
                  style={{
                    textAlign: 'left', padding: '12px 14px',
                    background: mode === m.id ? 'var(--text)' : 'var(--bg)',
                    color: mode === m.id ? 'var(--bg)' : 'var(--text)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    cursor: 'pointer', font: 'inherit', transition: 'all var(--transition)',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{m.label}</div>
                  <div className="small" style={{ opacity: 0.7, marginTop: 2 }}>{m.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label>{label1}</label>
                <input className="input mono" type="number" value={val1} onChange={(e) => setVal1(e.target.value)} placeholder="Enter value" />
              </div>
              <div>
                <label>{label2}</label>
                <input className="input mono" type="number" value={val2} onChange={(e) => setVal2(e.target.value)} placeholder="Enter value" />
              </div>
              <button className="btn btn--primary" onClick={calculate}>Calculate</button>
            </div>
          </div>

          {result && (
            <div className="card">
              <div className="small muted">Result</div>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 600, marginTop: 8 }}>{result}</div>
              {explanation && <div className="small secondary" style={{ marginTop: 8 }}>{explanation}</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
