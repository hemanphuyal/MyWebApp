import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRightLeft } from 'lucide-react'
import {
  getBsYears, getBsDaysInMonth, getAdDaysInMonth,
  bsToAd, adToBs, BS_MONTHS, AD_MONTHS, getAdYearRange,
} from '../../lib/bs-date-utils'

type Mode = 'AD_TO_BS' | 'BS_TO_AD'

export default function DateConverter() {
  const [mode, setMode] = useState<Mode>('AD_TO_BS')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDay, setSelectedDay] = useState('')

  const isAd = mode === 'AD_TO_BS'

  const years = useMemo(() => {
    if (!isAd) return getBsYears().slice().reverse()
    const r = getAdYearRange()
    const a: number[] = []
    for (let y = r.max; y >= r.min; y--) a.push(y)
    return a
  }, [isAd])

  const months = isAd ? AD_MONTHS : BS_MONTHS

  const daysInMonth = useMemo(() => {
    if (!selectedYear || !selectedMonth) return 31
    const y = parseInt(selectedYear), m = parseInt(selectedMonth)
    return isAd ? getAdDaysInMonth(y, m) : getBsDaysInMonth(y, m)
  }, [selectedYear, selectedMonth, isAd])

  const effectiveDay = useMemo(() => {
    if (!selectedDay) return ''
    return parseInt(selectedDay) > daysInMonth ? '' : selectedDay
  }, [selectedDay, daysInMonth])

  const result = useMemo(() => {
    if (!selectedYear || !selectedMonth || !effectiveDay) return null
    const y = parseInt(selectedYear), m = parseInt(selectedMonth), d = parseInt(effectiveDay)
    if (isAd) {
      const adDate = new Date(y, m - 1, d, 12, 0, 0)
      const bs = adToBs(adDate); if (!bs) return null
      return {
        fromLabel: 'AD Date',
        fromValue: adDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        toLabel: 'BS Date',
        toValue: `${bs.year} ${BS_MONTHS[bs.month - 1]} ${bs.day}`,
        dayOfWeek: adDate.toLocaleDateString('en-US', { weekday: 'long' }),
      }
    }
    const c = bsToAd(y, m, d); if (!c) return null
    const adDate = new Date(c.getFullYear(), c.getMonth(), c.getDate(), 12, 0, 0)
    return {
      fromLabel: 'BS Date',
      fromValue: `${y} ${BS_MONTHS[m - 1]} ${d}`,
      toLabel: 'AD Date',
      toValue: adDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      dayOfWeek: adDate.toLocaleDateString('en-US', { weekday: 'long' }),
    }
  }, [selectedYear, selectedMonth, effectiveDay, isAd])

  const switchMode = useCallback((m: Mode) => {
    setMode(m); setSelectedYear(''); setSelectedMonth(''); setSelectedDay('')
  }, [])

  const tabBtn = (active: boolean): React.CSSProperties => ({
    flex: 1, padding: '10px 16px', fontSize: '0.875rem', fontWeight: 500,
    background: active ? 'var(--text)' : 'transparent',
    color: active ? 'var(--bg)' : 'var(--text)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    cursor: 'pointer', font: 'inherit', transition: 'all var(--transition)',
  })

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/tools" className="small secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <ArrowLeft size={14} /> Tools
        </Link>
        <span className="small muted mono" style={{ display: 'block', marginTop: 24 }}>— Tools</span>
        <h1 style={{ marginTop: 16 }}>Date Converter</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>
          Convert between AD (English) and BS (Bikram Sambat) dates.
        </p>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={tabBtn(mode === 'AD_TO_BS')} onClick={() => switchMode('AD_TO_BS')}>AD → BS</button>
            <button style={tabBtn(mode === 'BS_TO_AD')} onClick={() => switchMode('BS_TO_AD')}>BS → AD</button>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 12 }}>
              Enter {isAd ? 'AD (English)' : 'BS (Nepali)'} date
            </div>
            <div className="grid grid-3">
              <div>
                <label>Year</label>
                <select className="input" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                  <option value="">Year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label>Month</label>
                <select className="input" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  <option value="">Month</option>
                  {months.map((n, i) => <option key={i} value={i + 1}>{n}</option>)}
                </select>
              </div>
              <div>
                <label>Day</label>
                <select className="input" value={effectiveDay} onChange={(e) => setSelectedDay(e.target.value)}>
                  <option value="">Day</option>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>

          {result && (
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="small muted">{result.fromLabel}</div>
              <div style={{ fontSize: '1rem', fontWeight: 500, marginTop: 6 }}>{result.fromValue}</div>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }}>
                <ArrowRightLeft size={18} className="muted" />
              </div>
              <div className="small muted">{result.toLabel}</div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: 6 }}>{result.toValue}</div>
              <div className="small secondary" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                Day of the week: <span style={{ color: 'var(--text)', fontWeight: 500 }}>{result.dayOfWeek}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
