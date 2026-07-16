import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, Percent, Ruler, Network, Binary, Cake, CalendarClock } from 'lucide-react'

export default function Tools() {
  const { t } = useTranslation()

  const tools = [
    { to: '/calendar', icon: <Calendar size={22} strokeWidth={1.5} />, title: t('tools.items.calendar.title'), desc: t('tools.items.calendar.desc') },
    { to: '/tools/date-converter', icon: <CalendarClock size={22} strokeWidth={1.5} />, title: t('tools.items.dateConverter.title'), desc: t('tools.items.dateConverter.desc') },
    { to: '/tools/age', icon: <Cake size={22} strokeWidth={1.5} />, title: t('tools.items.age.title'), desc: t('tools.items.age.desc') },
    { to: '/tools/percentage', icon: <Percent size={22} strokeWidth={1.5} />, title: t('tools.items.percentage.title'), desc: t('tools.items.percentage.desc') },
    { to: '/tools/unit-converter', icon: <Ruler size={22} strokeWidth={1.5} />, title: t('tools.items.unitConverter.title'), desc: t('tools.items.unitConverter.desc') },
    { to: '/tools/subnet', icon: <Network size={22} strokeWidth={1.5} />, title: t('tools.items.subnet.title'), desc: t('tools.items.subnet.desc') },
    { to: '/tools/binary', icon: <Binary size={22} strokeWidth={1.5} />, title: t('tools.items.binary.title'), desc: t('tools.items.binary.desc') },
  ]

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="small muted mono">— {t('tools.title')}</span>
        <h1 style={{ marginTop: 16 }}>{t('tools.title')}</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>{t('tools.lede')}</p>
        <div style={{ marginTop: 40 }}>
          <div className="grid grid-2">
            {tools.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="card"
                style={{ display: 'flex', flexDirection: 'column', gap: 12, textDecoration: 'none' }}
              >
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text)',
                  }}
                >
                  {tool.icon}
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>{tool.title}</div>
                <div className="small secondary">{tool.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
