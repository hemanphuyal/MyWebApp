import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 64 }}>
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'grid', gap: 32, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{t('common.name')}</div>
            <p className="small secondary">{t('common.role')}</p>
          </div>
          <div>
            <div className="small muted" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('nav.menu')}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
              <li><Link to="/blog">{t('nav.blog')}</Link></li>
              <li><Link to="/tools">{t('nav.tools')}</Link></li>
            </ul>
          </div>
          <div>
            <div className="small muted" style={{ marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><a href="mailto:hello@hemanphuyal.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><Mail size={14} /> hello@hemanphuyal.com</a></li>
              <li><span className="secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><MapPin size={14} /> {t('common.location')}</span></li>
              <li>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    alignItems: 'center',
                  }}
                >
                  <a
                    href="https://github.com/hemanphuyal"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <ExternalLink size={14} />
                    GitHub
                  </a>

                  <a
                    href="https://linkedin.com/in/hemanphuyal"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <ExternalLink size={14} />
                    LinkedIn
                  </a>

                  <a
                    href="https://x.com/hemanphuyal"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <ExternalLink size={14} />
                    X (Twitter)
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <hr className="divider" style={{ margin: '32px 0 20px' }} />

        <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  }}
>
  <span className="small muted">
    © {year} {t('common.name')}.  {t('common.allRightsReserved')}
  </span>

  <div
    style={{
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
    }}
  >
    <Link to="#" className="small muted">
      Privacy Policy
    </Link>

    <Link to="#" className="small muted">
      Terms of Service
    </Link>

    <Link to="#" className="small muted">
      Cookie Policy
    </Link>
  </div>
</div>
      </div>
    </footer>
  )
}
