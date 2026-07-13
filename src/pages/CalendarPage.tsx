import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSwipeable } from "react-swipeable";
import {
  adToBS, bsToAD, daysInBSMonth, isHoliday,
  BS_MONTHS_EN, BS_MONTHS_NE, WEEKDAYS_EN_SHORT, WEEKDAYS_NE_SHORT,
  BS_MIN_YEAR, BS_MAX_YEAR, toNepaliDigits,
  formatAD, formatBSNepali,
  type BSDate,
} from '../lib/bs'

const HOLIDAY = '#e11d48'

export default function CalendarPage() {
  const { t, i18n } = useTranslation()
  const isNe = i18n.language === 'ne'
  const location = useLocation()

  const today = new Date()
  const todayBS = adToBS(today)

  const [view, setView] = useState<{ y: number; m: number }>({ y: todayBS.y, m: todayBS.m })
  const [selected, setSelected] = useState<BSDate>(todayBS)

  // Jump to today when navigated from TodayDate link
  useEffect(() => {
    const state = location.state as { jumpToday?: number } | null
    if (state?.jumpToday) {
      setView({ y: todayBS.y, m: todayBS.m })
      setSelected(todayBS)
    }
  }, [location.state, todayBS.y, todayBS.m, todayBS.d])

  const monthDays = daysInBSMonth(view.y, view.m)
  const firstWeekday = useMemo(
    () => bsToAD({ y: view.y, m: view.m, d: 1 }).getUTCDay(),
    [view.y, view.m],
  )

  const weekdays = isNe ? WEEKDAYS_NE_SHORT : WEEKDAYS_EN_SHORT

  const canPrev = !(view.y === BS_MIN_YEAR && view.m === 1)
  const canNext = !(view.y === BS_MAX_YEAR && view.m === 12)

  const go = (dir: -1 | 1) => {
    setView((v) => {
      let m = v.m + dir
      let y = v.y
      if (m < 1) { m = 12; y -= 1 }
      if (m > 12) { m = 1; y += 1 }
      if (y < BS_MIN_YEAR || y > BS_MAX_YEAR) return v
      return { y, m }
    })
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (canNext) go(1);
    },
    onSwipedRight: () => {
      if (canPrev) go(-1);
    },
    preventScrollOnSwipe: true,
    trackMouse: true, // Optional: allows desktop mouse dragging
    delta: 60,        // Minimum swipe distance (px)
  });

  const cells: Array<{ d: number | null; bs?: BSDate; wd?: number; holiday?: boolean; isToday?: boolean; isSelected?: boolean; ad?: Date }> = []
  for (let i = 0; i < firstWeekday; i++) cells.push({ d: null })
  for (let d = 1; d <= monthDays; d++) {
    const bs = { y: view.y, m: view.m, d }
    const ad = bsToAD(bs)
    const wd = ad.getUTCDay()
    const holiday = isHoliday(bs)
    const isToday = bs.y === todayBS.y && bs.m === todayBS.m && bs.d === todayBS.d
    const isSelected = bs.y === selected.y && bs.m === selected.m && bs.d === selected.d
    cells.push({ d, bs, wd, holiday, isToday, isSelected, ad })
  }
  while (cells.length % 7 !== 0) cells.push({ d: null })

  const headerBS = isNe
    ? `${BS_MONTHS_NE[view.m - 1]} ${toNepaliDigits(view.y)}`
    : `${BS_MONTHS_EN[view.m - 1]} ${view.y}`

  const firstAD = bsToAD({ y: view.y, m: view.m, d: 1 })
  const lastAD = bsToAD({ y: view.y, m: view.m, d: monthDays })
  const adRange = `${firstAD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${lastAD.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`


  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="small muted mono">— {t('calendar.title')}</span>
        <h1 style={{ marginTop: 16 }}>{t('calendar.title')}</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>{t('calendar.sub')}</p>

        {/* Month header with today date on right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 40, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em' }} lang={isNe ? 'ne' : 'en'}>
              {headerBS}
            </div>
            <div className="small secondary mono">{adRange}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
              <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: isHoliday(todayBS) ? HOLIDAY : 'var(--text)' }}>
                {formatAD(today)}
              </span>
              <span lang="ne" style={{ fontSize: '0.6875rem', fontWeight: 500, color: isHoliday(todayBS) ? HOLIDAY : 'var(--text-secondary)' }}>
                {formatBSNepali(todayBS)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button className="btn btn--ghost btn--icon" onClick={() => go(-1)} disabled={!canPrev} aria-label={t('calendar.prev')}>
                <ChevronLeft size={18} />
              </button>
              <button className="btn btn--ghost btn--icon" onClick={() => go(1)} disabled={!canNext} aria-label={t('calendar.next')}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>


        {/* Grid */}
        <div {...swipeHandlers}>
          <div
            role="grid"
            aria-label={headerBS}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--surface)',
            }}
          >
            {/* Weekday header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
              {weekdays.map((wd, i) => {
                const sat = i === 6
                return (
                  <div
                    key={i}
                    role="columnheader"
                    style={{
                      padding: '10px 4px',
                      textAlign: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: sat ? HOLIDAY : 'var(--text-secondary)',
                      borderRight: i < 6 ? '1px solid var(--border)' : 'none',
                    }}
                    lang={isNe ? 'ne' : 'en'}
                  >
                    {wd}
                  </div>
                )
              })}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {cells.map((c, idx) => {
                const col = idx % 7
                const row = Math.floor(idx / 7)
                const totalRows = Math.ceil(cells.length / 7)
                const border: React.CSSProperties = {
                  borderRight: col < 6 ? '1px solid var(--border)' : 'none',
                  borderBottom: row < totalRows - 1 ? '1px solid var(--border)' : 'none',
                }

                if (c.d === null) {
                  return <div key={idx} style={{ aspectRatio: '1 / 1', background: 'var(--bg)', opacity: 0.4, ...border }} />
                }

                const dayColor = c.holiday ? HOLIDAY : 'var(--text)'
                const bsDayLabel = isNe ? toNepaliDigits(c.d) : String(c.d)
                const adDay = c.ad ? c.ad.getUTCDate() : ''

                return (
                  <button
                    key={idx}
                    type="button"
                    role="gridcell"
                    onClick={() => c.bs && setSelected(c.bs)}
                    aria-current={c.isToday ? 'date' : undefined}
                    aria-pressed={c.isSelected}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: c.isSelected
                        ? 'var(--surface-hover)'
                        : c.isToday
                          ? 'var(--surface-hover)'
                          : 'transparent',
                      outline: c.isSelected ? '2px solid var(--text)' : c.isToday ? '1px dashed var(--text-muted)' : 'none',
                      outlineOffset: -2,
                      transition: 'background var(--transition)',
                      ...border,
                    }}
                    onMouseEnter={(e) => {
                      if (!c.isSelected && !c.isToday) (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-hover)'
                    }}
                    onMouseLeave={(e) => {
                      if (!c.isSelected && !c.isToday) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 6,
                        fontSize: '0.65rem',
                        color: c.holiday ? HOLIDAY : 'var(--text-muted)',
                        fontWeight: 500,
                      }}
                    >
                      {adDay}
                    </span>
                    <span
                      lang={isNe ? 'ne' : 'en'}
                      style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                        fontWeight: 600,
                        color: dayColor,
                        lineHeight: 1,
                      }}
                    >
                      {bsDayLabel}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="small secondary" style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: HOLIDAY, borderRadius: 2, display: 'inline-block' }} />
            {t('calendar.holiday')}
          </span>
          <span>{t('calendar.legendSat')}</span>
          <span>{t('calendar.legendSun')}</span>
        </div>
      </div>
    </section>
  )
}
