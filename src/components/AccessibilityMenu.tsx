import { useEffect, useRef } from 'react'
import { X, Plus, Minus, RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useA11y, type A11yState } from '../contexts/A11yContext'

type Toggle = { key: keyof A11yState; label: string }

export default function AccessibilityMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const { state, set, reset, incFont, decFont, resetFont } = useA11y()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const toggles: Toggle[] = [
    { key: 'highContrast',   label: t('a11y.highContrast') },
    { key: 'extraDark',      label: t('a11y.extraDark') },
    { key: 'letterSpacing',  label: t('a11y.letterSpacing') },
    { key: 'lineHeight',     label: t('a11y.lineHeight') },
    { key: 'readable',       label: t('a11y.readable') },
    { key: 'reduceMotion',   label: t('a11y.reduceMotion') },
    { key: 'underlineLinks', label: t('a11y.underline') },
    { key: 'highlightFocus', label: t('a11y.highlightFocus') },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('a11y.title')}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'color-mix(in oklab, #000 55%, transparent)',
        display: 'flex', justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(380px, 100%)',
          background: 'var(--bg)', borderLeft: '1px solid var(--border)',
          height: '100dvh', overflow: 'auto',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 500 }}>{t('a11y.title')}</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label={t('a11y.close')}><X size={18} /></button>
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ marginBottom: 10 }}>{t('a11y.fontSize')} — {Math.round(state.fontStep * 100)}%</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={decFont} aria-label={t('a11y.decrease')}><Minus size={16} /></button>
              <button className="btn" onClick={resetFont} aria-label={t('a11y.reset')}><RotateCcw size={16} /></button>
              <button className="btn" onClick={incFont} aria-label={t('a11y.increase')}><Plus size={16} /></button>
            </div>
          </div>

          <hr className="divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {toggles.map((tg) => (
              <label key={tg.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 0', cursor: 'pointer', marginBottom: 0, color: 'var(--text)',
              }}>
                <span>{tg.label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(state[tg.key])}
                  onChange={(e) => set(tg.key, e.target.checked as never)}
                  style={{ width: 18, height: 18, accentColor: 'var(--text)' }}
                />
              </label>
            ))}
          </div>

          <button className="btn" onClick={reset}>{t('a11y.reset')}</button>
        </div>
      </div>
    </div>
  )
}
