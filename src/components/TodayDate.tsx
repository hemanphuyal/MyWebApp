import { Link } from 'react-router-dom'
import { adToBS, formatAD, formatBSNepali, isHoliday } from '../lib/bs'

type Props = {
  layout?: 'inline' | 'stacked'
  onNavigate?: () => void
}

export default function TodayDate({ layout = 'inline', onNavigate }: Props) {
  const now = new Date()
  const bs = adToBS(now)
  const holiday = isHoliday(bs)

  const color = holiday ? '#e11d48' : 'var(--text-secondary)'
  const strong = holiday ? '#e11d48' : 'var(--text)'

  const wrap: React.CSSProperties = layout === 'stacked'
    ? { display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }
    : { display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'flex-end', lineHeight: 1.2 }

  return (
    <Link
      to="/calendar"
      state={{ jumpToday: Date.now() }}
      onClick={onNavigate}
      aria-label="Open calendar for today"
      title="Open calendar for today"
      style={{
        ...wrap,
        padding: '2px 6px',
        borderRadius: 'var(--radius)',
        textDecoration: 'none',
      }}
    >
      <span
        className="mono"
        style={{ fontSize: '0.75rem', fontWeight: 600, color: strong, letterSpacing: '-0.01em' }}
      >
        {formatAD(now)}
      </span>
      <span
        style={{ fontSize: '0.6875rem', color, fontWeight: 500 }}
        lang="ne"
      >
        {formatBSNepali(bs)}
      </span>
    </Link>
  )
}
