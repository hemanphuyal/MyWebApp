import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, ExternalLink, Send, User, AtSign, MessageSquare, Type } from 'lucide-react'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLRklbPasarYp-y5aEe05dQZovea0m1X9pqf3u2-orSNoJtHcFQEJqgFzgd05qb5pUwg/exec'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => { setStatus('idle'); setErrorMsg('') }, 5000)
      return () => clearTimeout(timer)
    }
  }, [status])

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    if (status !== 'idle') { setStatus('idle'); setErrorMsg('') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim()
    const subject = form.subject.trim() || 'Website Enquiry'
    const message = form.message.trim()

    if (!name) return setStatus('error'), setErrorMsg(t('contact.errors.name'))
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus('error'), setErrorMsg(t('contact.errors.email'))
    if (!message) return setStatus('error'), setErrorMsg(t('contact.errors.message'))

    setStatus('sending'); setErrorMsg('')
    try {
      const body = new URLSearchParams()
      body.append('name', name)
      body.append('email', email)
      // Map subject into the "service" field the Apps Script expects
      body.append('service', subject)
      body.append('message', message)
      const response = await fetch(SCRIPT_URL, { method: 'POST', body })
      const result = await response.json().catch(() => ({ status: 'success' }))
      if (result.status === 'success') {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
        setErrorMsg(result.message || t('contact.errors.message'))
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="small muted mono">— {t('contact.title')}</span>
        <h1 style={{ marginTop: 16 }}>{t('contact.title')}</h1>
        <p className="secondary" style={{ marginTop: 16, maxWidth: 560, lineHeight: 1.7 }}>{t('contact.lede')}</p>

        <div className="grid" style={{ marginTop: 48, gridTemplateColumns: '1.4fr 1fr', gap: 40 }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Field icon={<User size={16} />} id="c-name" label={t('contact.name')}>
              <input id="c-name" className="input" autoComplete="name" value={form.name} onChange={update('name')} maxLength={100} />
            </Field>
            <Field icon={<AtSign size={16} />} id="c-email" label={t('contact.email')}>
              <input id="c-email" type="email" className="input" autoComplete="email" value={form.email} onChange={update('email')} maxLength={255} />
            </Field>
            <Field icon={<Type size={16} />} id="c-subject" label={t('contact.subject')}>
              <input id="c-subject" className="input" value={form.subject} onChange={update('subject')} maxLength={150} placeholder="Website Enquiry" />
            </Field>
            <Field icon={<MessageSquare size={16} />} id="c-message" label={t('contact.message')}>
              <textarea id="c-message" className="textarea" value={form.message} onChange={update('message')} maxLength={2000} rows={5} />
            </Field>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                <Send size={16} /> {status === 'sending' ? 'Sending…' : t('contact.send')}
              </button>
              {status === 'success' && (
                <span role="status" className="small" style={{ color: 'var(--text)' }}>
                  ✓ {t('contact.success')}
                </span>
              )}
              {status === 'error' && errorMsg && (
                <span role="alert" className="small" style={{ color: 'var(--text-secondary)' }}>{errorMsg}</span>
              )}
            </div>
          </form>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="small muted mono" style={{ marginBottom: 12 }}>EMAIL</div>
              <a href="mailto:hello@hemanphuyal.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} /> hello@hemanphuyal.com
              </a>
            </div>
            <div className="card">
              <div className="small muted mono" style={{ marginBottom: 12 }}>LOCATION</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} /> {t('common.location')}
              </div>
            </div>
            <div className="card">
              <div className="small muted mono" style={{ marginBottom: 12 }}>
                Socials
              </div>

              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <li>
                  <a
                    href="https://www.linkedin.com/in/hemanphuyal/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <ExternalLink size={16} /> LinkedIn
                  </a>
                </li>

                <li>
                  <a
                    href="https://x.com/hemanphuyal"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <ExternalLink size={16} /> X
                  </a>
                </li>

                <li>
                  <a
                    href="https://github.com/hemanphuyal"
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  >
                    <ExternalLink size={16} /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .section .grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function Field({ icon, id, label, children }: { icon: React.ReactNode; id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: 'var(--text-muted)' }}>{icon}</span> {label}
      </label>
      {children}
    </div>
  )
}
