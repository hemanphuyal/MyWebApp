import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon, PersonStanding } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import AccessibilityMenu from './AccessibilityMenu'
import avatar from '../assets/avatar.png'

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
    backdropFilter: 'saturate(140%) blur(10px)',
    WebkitBackdropFilter: 'saturate(140%) blur(10px)',
    borderBottom: '1px solid var(--border)',
  },
  bar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 'var(--nav-h)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: 10,
    fontWeight: 600, letterSpacing: '-0.02em', fontSize: '1rem',
  },
  brandAvatar: {
    width: 28, height: 28, borderRadius: '50%',
    objectFit: 'cover',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
  },
  brandMark: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 24, height: 24, borderRadius: '50%',
    background: 'var(--text)', color: 'var(--bg)',
    fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.02em',
  },
  nav: { display: 'flex', alignItems: 'center', gap: 4 },
  link: {
    padding: '8px 12px', borderRadius: 'var(--radius)',
    color: 'var(--text-secondary)', fontSize: '0.9375rem', fontWeight: 500,
    transition: 'color 180ms, background 180ms',
  },
  linkActive: { color: 'var(--text)', background: 'var(--surface-hover)' },
  actions: {
    display: 'flex', alignItems: 'center', gap: 4,
    marginLeft: 8, paddingLeft: 12,
    borderLeft: '1px solid var(--border)',
  },
  mobileActions: {
    display: 'flex', alignItems: 'center', gap: 2,
  },
}

const NAV_ITEMS = ['home', 'about', 'blog', 'tools', 'contact'] as const
const PATHS: Record<(typeof NAV_ITEMS)[number], string> = {
  home: '/', about: '/about', contact: '/contact', blog: '/blog', tools: '/tools',
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const [a11yOpen, setA11yOpen] = useState(false)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { if (!mobile) setOpen(false) }, [mobile])

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'ne' : 'en')

  const links = NAV_ITEMS.map((k) => (
    <NavLink
      key={k}
      to={PATHS[k]}
      onClick={() => setOpen(false)}
      style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : null) })}
    >
      {t(`nav.${k}`)}
    </NavLink>
  ))

  const IconButtons = (
    <>
      <button
        className="btn btn--ghost"
        onClick={toggleLang}
        aria-label={t('nav.language')}
        title={i18n.language === 'en' ? 'Switch to Nepali' : 'Switch to English'}
        style={{
          minWidth: 52,
          height: 36,
          padding: '0 12px',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}
      >
        {i18n.language === 'en' ? 'ने' : 'EN'}
      </button>
      <button className="btn btn--ghost btn--icon" onClick={toggle} aria-label={t('nav.theme')} title={theme === 'dark' ? t('theme.light') : t('theme.dark')}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button className="btn btn--ghost btn--icon" onClick={() => setA11yOpen(true)} aria-label={t('nav.accessibility')}>
        <PersonStanding size={18} />
      </button>
    </>
  )

  return (
    <>
      <header style={styles.header}>
        <div className="container" style={styles.bar}>
          <NavLink to="/" style={styles.brand} aria-label={t('common.name')}>
            <img src={avatar} alt="" style={styles.brandAvatar} />
            <span>HP.</span>
          </NavLink>

          {!mobile && (
            <div style={styles.nav}>
              {links}
              <div style={styles.actions}>{IconButtons}</div>
            </div>
          )}

          {mobile && (
            <div style={styles.mobileActions}>
              {IconButtons}
              <button className="btn btn--ghost btn--icon" onClick={() => setOpen((o) => !o)} aria-label={open ? t('nav.close') : t('nav.menu')} aria-expanded={open} style={{ marginLeft: 4 }}>
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          )}
        </div>

        {mobile && open && (
          <div style={{ borderTop: '1px solid var(--border)' }}>
            <div className="container" style={{ padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {links}
            </div>
          </div>
        )}
      </header>

      <AccessibilityMenu open={a11yOpen} onClose={() => setA11yOpen(false)} />
    </>
  )
}
