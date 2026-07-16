import { useMemo, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import {
  getBsYears, getBsDaysInMonth, getAdDaysInMonth,
  bsToAd, adToBs, BS_MONTHS, AD_MONTHS, getAdYearRange,
} from '../../lib/bs-date-utils'

type CalendarType = 'AD' | 'BS'

export default function AgeCalculator() {
  const [calendarType, setCalendarType] = useState<CalendarType>('AD')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedDay, setSelectedDay] = useState('')

  const years = useMemo(() => {
    if (calendarType === 'BS') return getBsYears().slice().reverse()
    const r = getAdYearRange()
    const a: number[] = []
    for (let y = r.max; y >= r.min; y--) a.push(y)
    return a
  }, [calendarType])

  const months = calendarType === 'BS' ? BS_MONTHS : AD_MONTHS

  const daysInMonth = useMemo(() => {
    if (!selectedYear || !selectedMonth) return 30
    const y = parseInt(selectedYear), m = parseInt(selectedMonth)
    return calendarType === 'BS' ? getBsDaysInMonth(y, m) : getAdDaysInMonth(y, m)
  }, [selectedYear, selectedMonth, calendarType])

  const effectiveDay = useMemo(() => {
    if (!selectedDay) return ''
    return parseInt(selectedDay) > daysInMonth ? '' : selectedDay
  }, [selectedDay, daysInMonth])

  const result = useMemo(() => {
    if (!selectedYear || !selectedMonth || !effectiveDay) return null
    const y = parseInt(selectedYear), m = parseInt(selectedMonth), d = parseInt(effectiveDay)
    let birthAdDate: Date
    let birthBs: { year: number; month: number; day: number } | null = null
    if (calendarType === 'BS') {
      const c = bsToAd(y, m, d); if (!c) return null
      birthAdDate = new Date(c.getFullYear(), c.getMonth(), c.getDate(), 12, 0, 0)
      birthBs = { year: y, month: m, day: d }
    } else {
      birthAdDate = new Date(y, m - 1, d, 12, 0, 0)
      birthBs = adToBs(birthAdDate)
    }
    const now = new Date()
    if (birthAdDate > now || isNaN(birthAdDate.getTime())) return null
    let years = now.getFullYear() - birthAdDate.getFullYear()
    let months = now.getMonth() - birthAdDate.getMonth()
    let days = now.getDate() - birthAdDate.getDate()
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }
    const diffMs = now.getTime() - birthAdDate.getTime()
    const totalDays = Math.floor(diffMs / 86400000)
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months
    const totalHours = Math.floor(diffMs / 3600000)
    const nextBirthday = new Date(now.getFullYear(), birthAdDate.getMonth(), birthAdDate.getDate(), 12, 0, 0)
    if (nextBirthday <= now) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / 86400000)
    return {
      years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysUntilBirthday,
      dayOfWeek: birthAdDate.toLocaleDateString('en-US', { weekday: 'long' }),
      bsDisplay: birthBs ? `${birthBs.year} ${BS_MONTHS[birthBs.month - 1]} ${birthBs.day}` : null,
      adDisplay: birthAdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    }
  }, [selectedYear, selectedMonth, effectiveDay, calendarType])

  const switchType = useCallback((t: CalendarType) => {
    setCalendarType(t); setSelectedYear(''); setSelectedMonth(''); setSelectedDay('')
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
        <h1 style={{ marginTop: 16 }}>Age Calculator</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>
          Calculate your exact age using AD (English) or BS (Nepali) birth date.
        </p>

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={tabBtn(calendarType === 'AD')} onClick={() => switchType('AD')}>AD (English)</button>
            <button style={tabBtn(calendarType === 'BS')} onClick={() => switchType('BS')}>BS (Nepali)</button>
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Select birth date ({calendarType})</div>
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
            <>
              <div className="card" style={{ textAlign: 'center' }}>
                <div className="small muted">Your age</div>
                <div className="mono" style={{ fontSize: '1.75rem', fontWeight: 600, marginTop: 8 }}>
                  {result.years} years, {result.months} months, {result.days} days
                </div>
                <div className="small secondary" style={{ marginTop: 8 }}>Born on a {result.dayOfWeek}</div>
              </div>

              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span className="small secondary">AD Date</span>
                  <span className="small" style={{ fontWeight: 500 }}>{result.adDisplay}</span>
                </div>
                {result.bsDisplay && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                    <span className="small secondary">BS Date</span>
                    <span className="small" style={{ fontWeight: 500 }}>{result.bsDisplay}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                  <span className="small secondary">Next birthday</span>
                  <span className="small" style={{ fontWeight: 500 }}>
                    {result.daysUntilBirthday === 365 || result.daysUntilBirthday === 366
                      ? 'Today!' : `${result.daysUntilBirthday} days`}
                  </span>
                </div>
              </div>

              <div className="card">
                <div style={{ fontWeight: 600, marginBottom: 12 }}>Detailed breakdown</div>
                <div className="grid grid-2">
                  {[
                    { label: 'Total months', value: result.totalMonths.toLocaleString() },
                    { label: 'Total weeks', value: result.totalWeeks.toLocaleString() },
                    { label: 'Total days', value: result.totalDays.toLocaleString() },
                    { label: 'Total hours', value: result.totalHours.toLocaleString() },
                  ].map((i) => (
                    <div key={i.label} style={{ padding: 14, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                      <div className="mono" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{i.value}</div>
                      <div className="small muted" style={{ marginTop: 4 }}>{i.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
