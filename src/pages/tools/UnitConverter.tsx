import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowDownUp, Copy, Check } from 'lucide-react'

interface UnitDef { label: string; factor: number }
interface UnitCategory { label: string; base: string; units: Record<string, UnitDef> }

const categories: Record<string, UnitCategory> = {
  length: {
    label: 'Length', base: 'm',
    units: {
      km: { label: 'Kilometer (km)', factor: 1000 },
      m: { label: 'Meter (m)', factor: 1 },
      cm: { label: 'Centimeter (cm)', factor: 0.01 },
      mm: { label: 'Millimeter (mm)', factor: 0.001 },
      mi: { label: 'Mile (mi)', factor: 1609.344 },
      yd: { label: 'Yard (yd)', factor: 0.9144 },
      ft: { label: 'Foot (ft)', factor: 0.3048 },
      in: { label: 'Inch (in)', factor: 0.0254 },
      nmi: { label: 'Nautical Mile (nmi)', factor: 1852 },
    },
  },
  weight: {
    label: 'Weight', base: 'kg',
    units: {
      t: { label: 'Metric Ton (t)', factor: 1000 },
      kg: { label: 'Kilogram (kg)', factor: 1 },
      g: { label: 'Gram (g)', factor: 0.001 },
      mg: { label: 'Milligram (mg)', factor: 1e-6 },
      lb: { label: 'Pound (lb)', factor: 0.453592 },
      oz: { label: 'Ounce (oz)', factor: 0.0283495 },
      st: { label: 'Stone (st)', factor: 6.35029 },
    },
  },
  temperature: {
    label: 'Temperature', base: 'c',
    units: {
      c: { label: 'Celsius (°C)', factor: 0 },
      f: { label: 'Fahrenheit (°F)', factor: 0 },
      k: { label: 'Kelvin (K)', factor: 0 },
    },
  },
  volume: {
    label: 'Volume', base: 'l',
    units: {
      m3: { label: 'Cubic Meter (m³)', factor: 1000 },
      l: { label: 'Liter (L)', factor: 1 },
      ml: { label: 'Milliliter (mL)', factor: 0.001 },
      gal_us: { label: 'US Gallon', factor: 3.78541 },
      gal_uk: { label: 'UK Gallon', factor: 4.54609 },
      cup: { label: 'US Cup', factor: 0.236588 },
      fl_oz: { label: 'US Fluid Ounce', factor: 0.0295735 },
    },
  },
  area: {
    label: 'Area', base: 'm2',
    units: {
      km2: { label: 'Square Kilometer (km²)', factor: 1e6 },
      m2: { label: 'Square Meter (m²)', factor: 1 },
      cm2: { label: 'Square Centimeter (cm²)', factor: 1e-4 },
      ha: { label: 'Hectare (ha)', factor: 1e4 },
      ac: { label: 'Acre (ac)', factor: 4046.86 },
      ft2: { label: 'Square Foot (ft²)', factor: 0.092903 },
      ropani: { label: 'Ropani', factor: 508.72 },
      anna: { label: 'Anna', factor: 31.80 },
      bigha: { label: 'Bigha', factor: 6772.63 },
      kattha: { label: 'Kattha', factor: 338.63 },
      dhur: { label: 'Dhur', factor: 16.93 },
    },
  },
  speed: {
    label: 'Speed', base: 'ms',
    units: {
      ms: { label: 'Meter/second (m/s)', factor: 1 },
      kmh: { label: 'Kilometer/hour (km/h)', factor: 0.277778 },
      mph: { label: 'Mile/hour (mph)', factor: 0.44704 },
      kn: { label: 'Knot (kn)', factor: 0.514444 },
    },
  },
  time: {
    label: 'Time', base: 's',
    units: {
      ms_t: { label: 'Millisecond (ms)', factor: 0.001 },
      s: { label: 'Second (s)', factor: 1 },
      min: { label: 'Minute (min)', factor: 60 },
      hr: { label: 'Hour (hr)', factor: 3600 },
      day: { label: 'Day', factor: 86400 },
      wk: { label: 'Week', factor: 604800 },
      yr: { label: 'Year (365d)', factor: 31536000 },
    },
  },
  data: {
    label: 'Digital Storage', base: 'B',
    units: {
      b: { label: 'Bit (b)', factor: 0.125 },
      B: { label: 'Byte (B)', factor: 1 },
      KB: { label: 'Kilobyte (KB)', factor: 1024 },
      MB: { label: 'Megabyte (MB)', factor: 1048576 },
      GB: { label: 'Gigabyte (GB)', factor: 1073741824 },
      TB: { label: 'Terabyte (TB)', factor: 1099511627776 },
    },
  },
}

function convertTemp(value: number, from: string, to: string): number {
  if (from === to) return value
  let celsius: number
  if (from === 'c') celsius = value
  else if (from === 'f') celsius = (value - 32) * (5 / 9)
  else celsius = value - 273.15
  if (to === 'c') return celsius
  if (to === 'f') return celsius * (9 / 5) + 32
  return celsius + 273.15
}

function formatResult(num: number): string {
  if (num === 0) return '0'
  const abs = Math.abs(num)
  if (abs >= 1e15 || (abs > 0 && abs < 1e-10)) return num.toExponential(8)
  return parseFloat(num.toPrecision(10)).toString()
}

export default function UnitConverter() {
  const [category, setCategory] = useState('length')
  const cat = categories[category]
  const unitKeys = Object.keys(cat.units)
  const [fromUnit, setFromUnit] = useState(unitKeys[0])
  const [toUnit, setToUnit] = useState(unitKeys[1])
  const [inputValue, setInputValue] = useState('1')
  const [copied, setCopied] = useState(false)

  const handleCategoryChange = (val: string) => {
    setCategory(val)
    const keys = Object.keys(categories[val].units)
    setFromUnit(keys[0]); setToUnit(keys[1]); setInputValue('1')
  }

  const result = useMemo(() => {
    const num = parseFloat(inputValue)
    if (isNaN(num)) return ''
    if (category === 'temperature') return formatResult(convertTemp(num, fromUnit, toUnit))
    const baseValue = num * cat.units[fromUnit].factor
    return formatResult(baseValue / cat.units[toUnit].factor)
  }, [inputValue, fromUnit, toUnit, category, cat])

  const swap = () => {
    setFromUnit(toUnit); setToUnit(fromUnit)
    if (result) setInputValue(result)
  }

  const copyResult = () => {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/tools" className="small secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Tools
        </Link>
        <span className="small muted mono" style={{ display: 'block', marginTop: 24 }}>— Tools</span>
        <h1 style={{ marginTop: 16 }}>Unit Converter</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>
          Convert between units of length, weight, temperature, volume, area, speed, time and data.
        </p>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <label>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
              {Object.entries(categories).map(([key, c]) => (
                <button
                  key={key}
                  onClick={() => handleCategoryChange(key)}
                  style={{
                    padding: '6px 12px', fontSize: '0.8125rem', fontWeight: 500,
                    background: category === key ? 'var(--text)' : 'var(--bg)',
                    color: category === key ? 'var(--bg)' : 'var(--text)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    cursor: 'pointer', font: 'inherit', transition: 'all var(--transition)',
                  }}
                >{c.label}</button>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label>From</label>
                <select className="input" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                  {unitKeys.map((u) => <option key={u} value={u}>{cat.units[u].label}</option>)}
                </select>
                <input className="input mono" type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter value" style={{ marginTop: 8, fontSize: '1.125rem', fontWeight: 600 }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="btn btn--icon" onClick={swap} aria-label="Swap"><ArrowDownUp size={16} /></button>
              </div>

              <div>
                <label>To</label>
                <select className="input" value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                  {unitKeys.map((u) => <option key={u} value={u}>{cat.units[u].label}</option>)}
                </select>
                <div
                  onClick={copyResult}
                  style={{
                    marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', background: 'var(--bg)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer',
                  }}
                >
                  <span className="mono" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{result || '—'}</span>
                  {copied ? <Check size={16} /> : <Copy size={16} className="muted" />}
                </div>
              </div>
            </div>
          </div>

          {inputValue && result && (
            <p className="small secondary" style={{ textAlign: 'center' }}>
              {inputValue} {cat.units[fromUnit].label} = {result} {cat.units[toUnit].label}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
