import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check } from 'lucide-react'

type Base = 'binary' | 'decimal' | 'hex' | 'octal'

const bases: { id: Base; label: string; prefix: string; radix: number }[] = [
  { id: 'binary', label: 'Binary', prefix: '0b', radix: 2 },
  { id: 'decimal', label: 'Decimal', prefix: '', radix: 10 },
  { id: 'hex', label: 'Hexadecimal', prefix: '0x', radix: 16 },
  { id: 'octal', label: 'Octal', prefix: '0o', radix: 8 },
]

export default function BinaryConverter() {
  const [inputBase, setInputBase] = useState<Base>('decimal')
  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState<Record<Base, string>>({ binary: '', decimal: '', hex: '', octal: '' })
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const convert = () => {
    setError('')
    if (!inputValue.trim()) { setError('Enter a value to convert'); return }
    const base = bases.find((b) => b.id === inputBase)!
    const cleaned = inputValue.trim().replace(/^(0b|0x|0o)/i, '')
    const parsed = parseInt(cleaned, base.radix)
    if (isNaN(parsed)) { setError(`Invalid ${base.label} value`); return }
    setResults({
      binary: parsed.toString(2),
      decimal: parsed.toString(10),
      hex: parsed.toString(16).toUpperCase(),
      octal: parsed.toString(8),
    })
  }

  const copy = (val: string, field: string) => {
    navigator.clipboard.writeText(val)
    setCopied(field)
    setTimeout(() => setCopied(''), 1500)
  }

  const placeholder = inputBase === 'binary' ? '10110' : inputBase === 'hex' ? '1A2F' : inputBase === 'octal' ? '755' : '42'

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/tools" className="small secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Tools
        </Link>
        <span className="small muted mono" style={{ display: 'block', marginTop: 24 }}>— Tools</span>
        <h1 style={{ marginTop: 16 }}>Base Converter</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>
          Convert numbers between binary, decimal, hexadecimal and octal.
        </p>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <label>Input base</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 6 }}>
              {bases.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setInputBase(b.id); setResults({ binary: '', decimal: '', hex: '', octal: '' }) }}
                  style={{
                    padding: '10px 8px', fontSize: '0.8125rem', fontWeight: 600,
                    background: inputBase === b.id ? 'var(--text)' : 'var(--bg)',
                    color: inputBase === b.id ? 'var(--bg)' : 'var(--text)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    cursor: 'pointer', font: 'inherit', transition: 'all var(--transition)',
                  }}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label>Value</label>
              <input className="input mono" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={placeholder} />
            </div>
            {error && <div className="field-error">{error}</div>}
            <button className="btn btn--primary" onClick={convert} style={{ marginTop: 16, width: '100%' }}>Convert</button>
          </div>

          {results.decimal && (
            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {bases.map((b) => (
                  <div key={b.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', background: 'var(--bg)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  }}>
                    <div>
                      <div className="small muted" style={{ marginBottom: 2 }}>{b.label}</div>
                      <code className="mono" style={{ fontSize: '0.9375rem' }}>
                        {b.prefix && <span className="muted">{b.prefix}</span>}
                        {results[b.id]}
                      </code>
                    </div>
                    <button className="btn btn--ghost btn--icon" onClick={() => copy(b.prefix + results[b.id], b.id)} aria-label="Copy">
                      {copied === b.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Quick reference</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, fontSize: '0.75rem' }}>
              {['Dec', 'Bin', 'Hex', 'Oct'].map((h) => (
                <div key={h} className="small muted" style={{ padding: 6, fontWeight: 600 }}>{h}</div>
              ))}
              {[0, 1, 2, 4, 8, 16, 32, 64, 128, 255].map((n) => (
                <div key={n} style={{ display: 'contents' }}>
                  <div className="mono" style={{ padding: 6, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>{n}</div>
                  <div className="mono" style={{ padding: 6, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>{n.toString(2)}</div>
                  <div className="mono" style={{ padding: 6, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>{n.toString(16).toUpperCase()}</div>
                  <div className="mono" style={{ padding: 6, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>{n.toString(8)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
