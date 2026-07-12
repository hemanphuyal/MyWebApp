import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="section" style={{ minHeight: 'calc(100dvh - var(--nav-h) - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 480 }}>
        <div className="mono muted" style={{ fontSize: '4rem', letterSpacing: '-0.03em', lineHeight: 1 }}>{t('notFound.title')}</div>
        <p style={{ marginTop: 20, color: 'var(--text)' }}>{t('notFound.sub')}</p>
        <div style={{ marginTop: 28 }}>
          <Link to="/" className="btn"><ArrowLeft size={16} /> {t('notFound.back')}</Link>
        </div>
      </div>
    </section>
  )
}
