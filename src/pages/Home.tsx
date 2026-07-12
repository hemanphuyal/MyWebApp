import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Cloud, Network, Shield, Headset } from 'lucide-react'
import avatar from '../assets/avatarnew.png'


const skillLabels = {
  en: {
    
    network: 'Network',
    cloud: 'Cloud',
    security: 'Cybersecurity',
    database: 'Data & Storage',
    techsupport: 'Technical Support',
  },
  ne: {
    
    network: 'नेटवर्क',
    cloud: 'क्लाउड',
    security: 'साइबर सुरक्षा',
    database: 'डाटा तथा स्टोरेज',
    techsupport: 'प्राविधिक सहायता',
  },
}

const SKILLS = [
  { icon: Network, key: 'network' },
  { icon: Cloud, key: 'cloud' },
  { icon: Shield, key: 'security' },
  { icon: Headset, key: 'techsupport' },
] as const

const STACK = ['Python', 'AWS', 'Azure', 'Git', 'Linux', 'Windows', 'AI']

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
}

export default function Home() {
  const { t, i18n } = useTranslation()

  const labels = i18n.language.startsWith('ne')
    ? skillLabels.ne
    : skillLabels.en

  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="container" style={{ maxWidth: 820, display: 'flex', alignItems: 'flex-start', gap: 28, flexWrap: 'wrap' }}>
          <motion.img
            {...fadeUp}
            src={avatar}
            alt={t('common.name')}
            style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }}
          />
          <div style={{ flex: '1 1 320px' }}>
            <motion.div {...fadeUp}>
              <span className="badge mono">{t('common.location')}</span>
            </motion.div>
            <motion.h1 {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} style={{ marginTop: 24 }}>
              {t('common.name')}
            </motion.h1>
            <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} style={{ marginTop: 16, fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
              {t('common.role')}
            </motion.p>
            <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} style={{ marginTop: 24, maxWidth: 620, lineHeight: 1.7 }}>
              {t('home.intro')}
            </motion.p>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }} style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
              <Link to="/about" className="btn btn--primary">{t('home.ctaAbout')} <ArrowRight size={16} /></Link>
              <Link to="/contact" className="btn">{t('home.ctaContact')}</Link>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Skills */}
      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="01" title={t('home.skills')} />

          <div className="grid grid-3" style={{ marginTop: 32 }}>
            {SKILLS.map(({ icon: Icon, key }) => (
              <div key={key} className="card">
                <Icon size={20} strokeWidth={1.5} />
                <div style={{ marginTop: 16, fontWeight: 500 }}>
                  {labels[key]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Stack */}
      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="02" title={t('home.stack')} />
          <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STACK.map((s) => <span key={s} className="badge">{s}</span>)}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Projects */}
      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="03" title={t('home.projects')} />
          <div className="card" style={{ marginTop: 32, padding: 40, textAlign: 'center' }}>
            <p className="secondary">{t('home.projectsSoon')}</p>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* Activity + Blog */}
      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            <div>
              <SectionHeader eyebrow="04" title={t('home.activity')} />
              <p className="secondary" style={{ marginTop: 16 }}>{t('home.activityDesc')}</p>
            </div>
            <div>
              <SectionHeader eyebrow="05" title={t('home.latestBlog')} />
              <div style={{ marginTop: 16 }}>
                <Link to="/blog" className="btn btn--ghost" style={{ padding: 0, height: 'auto' }}>
                  {t('common.comingSoon')} <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
      <span className="small muted mono">{eyebrow}</span>
      <h2>{title}</h2>
    </div>
  )
}
