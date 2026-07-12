import { useTranslation } from 'react-i18next'
import { Download } from 'lucide-react'
import avatar from '../assets/avatar.png'

export default function About() {
  const { t } = useTranslation()

  const experience = t('about.experienceItems', {
    returnObjects: true,
  }) as Array<{ year: string; title: string; desc: string }>

  const technical = t('about.technicalItems', {
    returnObjects: true,
  }) as string[]

  const soft = t('about.softItems', {
    returnObjects: true,
  }) as string[]

  return (
    <>
      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="small muted mono">— {t('about.title')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
            <img src={avatar} alt={t('common.name')} style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
            <h1 style={{ margin: 0 }}>{t('common.name')}</h1>
          </div>
          <p style={{ marginTop: 24, lineHeight: 1.7, fontSize: '1.0625rem' }}>{t('about.bio')}</p>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2>{t('about.journey')}</h2>
          <p className="secondary" style={{ marginTop: 16, lineHeight: 1.7 }}>{t('about.journeyText')}</p>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2>{t('about.experience')}</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '32px 0 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {experience.map((e, i) => (
              <li key={i} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr', gap: 24,
                padding: '20px 0',
                borderTop: i === 0 ? '1px solid var(--border)' : 'none',
                borderBottom: '1px solid var(--border)',
              }}>
                <span className="mono small muted" style={{ paddingTop: 4 }}>{e.year}</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{e.title}</div>
                  <p className="secondary small" style={{ marginTop: 4 }}>{e.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="grid grid-2">
            <div>
              <h2>{t('about.technical')}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                {technical.map((s) => (
                  <span key={s} className="badge">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2>{t('about.soft')}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
                {soft.map((s) => (
                  <span key={s} className="badge">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="grid grid-2">
            <div>
              <h3>{t('about.goals')}</h3>
              <p className="secondary" style={{ marginTop: 12, lineHeight: 1.7 }}>{t('about.goalsText')}</p>
            </div>
            <div>
              <h3>{t('about.values')}</h3>
              <p className="secondary" style={{ marginTop: 12, lineHeight: 1.7 }}>{t('about.valuesText')}</p>
            </div>
          </div>
          <div style={{ marginTop: 40 }}>
            <button className="btn" disabled aria-disabled="true"><Download size={16} /> {t('about.resume')}</button>
          </div>
        </div>
      </section>
    </>
  )
}
