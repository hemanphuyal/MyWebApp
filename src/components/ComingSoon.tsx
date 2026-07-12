import type { ReactNode } from 'react'

export default function ComingSoon({ icon, title, sub }: { icon: ReactNode; title: string; sub: string }) {
  return (
    <section className="section" style={{ minHeight: 'calc(100dvh - var(--nav-h) - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          display: 'inline-flex', width: 64, height: 64,
          alignItems: 'center', justifyContent: 'center',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          color: 'var(--text)',
        }}>{icon}</div>
        <h1 style={{ marginTop: 32 }}>{title}</h1>
        <p className="secondary" style={{ marginTop: 12 }}>{sub}</p>
      </div>
    </section>
  )
}
