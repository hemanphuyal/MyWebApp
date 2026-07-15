import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Briefcase, Wrench, Sparkles, Send } from 'lucide-react'

type Category = 'digital' | 'technical'

export default function Services() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [active, setActive] = useState<Category | null>(null)

  const requestService = (item: string) => {
    const prefix = t('services.digital.subjectPrefix')
    const subject = `${prefix}: ${item}`
    navigate(`/contact?subject=${encodeURIComponent(subject)}`)
  }

  const categories: Array<{ key: Category; icon: React.ReactNode; comingSoon?: boolean }> = [
    { key: 'digital', icon: <Briefcase size={22} strokeWidth={1.5} /> },
    { key: 'technical', icon: <Wrench size={22} strokeWidth={1.5} />, comingSoon: true },
  ]

  const digitalItems = t('services.digital.items', { returnObjects: true }) as string[]

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="small muted mono">— {t('services.title')}</span>
        <h1 style={{ marginTop: 16 }}>
          {active ? t(`services.${active}.title`) : t('services.title')}
        </h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 620, lineHeight: 1.7 }}>
          {active ? t(`services.${active}.lede`) : t('services.lede')}
        </p>

        {/* Disclaimer */}
        <div
          className="card"
          style={{ marginTop: 32, padding: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}
        >
          <Sparkles size={18} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
          <p className="small secondary" style={{ margin: 0, lineHeight: 1.7 }}>
            {t('services.disclaimer')}
          </p>
        </div>

        <div style={{ marginTop: 40 }}>
          {active === null && (
            <div className="grid grid-2">
              {categories.map(({ key, icon, comingSoon }) => (
                <button
                  key={key}
                  onClick={() => !comingSoon && setActive(key)}
                  disabled={comingSoon}
                  className="card"
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 12,
                    textAlign: 'left', cursor: comingSoon ? 'not-allowed' : 'pointer',
                    opacity: comingSoon ? 0.6 : 1,
                    background: 'var(--surface)',
                  }}
                >
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)', background: 'var(--bg)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text)',
                    }}
                  >
                    {icon}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>
                      {t(`services.${key}.title`)}
                    </div>
                    {!comingSoon && <ArrowRight size={16} />}
                  </div>
                  <div className="small secondary">
                    {comingSoon ? t('common.comingSoon') : t(`services.${key}.desc`)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {active === 'digital' && (
            <>
              <button
                onClick={() => setActive(null)}
                className="btn btn--ghost"
                style={{ padding: 0, height: 'auto', marginBottom: 24 }}
              >
                <ArrowLeft size={16} /> {t('services.back')}
              </button>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
                {digitalItems.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      padding: '18px 4px',
                      borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                    }}
                  >
                    <span className="mono small muted" style={{ minWidth: 32 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{ flex: 1, minWidth: 180 }}>{item}</span>
                    <button
                      type="button"
                      onClick={() => requestService(item)}
                      className="btn btn--primary"
                      style={{ fontSize: '0.85rem', padding: '8px 14px', height: 'auto' }}
                    >
                      <Send size={14} /> {t('services.digital.getService')}
                    </button>
                  </li>
                ))}
                <li
                  style={{
                    padding: '18px 4px',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 16,
                  }}
                >
                  <span className="mono small muted" style={{ minWidth: 32 }}>—</span>
                  <span className="secondary" style={{ flex: 1 }}>{t('services.digital.more')}</span>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
