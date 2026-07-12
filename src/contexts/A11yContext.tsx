import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type A11yState = {
  fontStep: number // 0.85 .. 1.4
  highContrast: boolean
  extraDark: boolean
  letterSpacing: boolean
  lineHeight: boolean
  readable: boolean
  reduceMotion: boolean
  underlineLinks: boolean
  highlightFocus: boolean
}

const DEFAULT: A11yState = {
  fontStep: 1,
  highContrast: false,
  extraDark: false,
  letterSpacing: false,
  lineHeight: false,
  readable: false,
  reduceMotion: false,
  underlineLinks: false,
  highlightFocus: false,
}

type Ctx = {
  state: A11yState
  set: <K extends keyof A11yState>(k: K, v: A11yState[K]) => void
  reset: () => void
  incFont: () => void
  decFont: () => void
  resetFont: () => void
}

const A11yContext = createContext<Ctx | null>(null)
const STORAGE = 'a11y'

export function A11yProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<A11yState>(() => {
    if (typeof localStorage === 'undefined') return DEFAULT
    try {
      const raw = localStorage.getItem(STORAGE)
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT
    } catch { return DEFAULT }
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--step', String(state.fontStep))
    root.style.setProperty('--tracking', state.letterSpacing ? '0.05em' : 'normal')
    root.style.setProperty('--leading', state.lineHeight ? '1.9' : '1.6')
    root.setAttribute('data-readable', String(state.readable))
    root.setAttribute('data-contrast', state.highContrast ? 'high' : 'normal')
    root.setAttribute('data-motion', state.reduceMotion ? 'reduce' : 'auto')
    root.setAttribute('data-underline', String(state.underlineLinks))
    root.setAttribute('data-focus', String(state.highlightFocus))
    if (state.extraDark) root.setAttribute('data-theme', 'extra-dark')
    try { localStorage.setItem(STORAGE, JSON.stringify(state)) } catch { /* noop */ }
  }, [state])

  const api: Ctx = {
    state,
    set: (k, v) => setState((s) => ({ ...s, [k]: v })),
    reset: () => setState(DEFAULT),
    incFont: () => setState((s) => ({ ...s, fontStep: Math.min(1.4, +(s.fontStep + 0.1).toFixed(2)) })),
    decFont: () => setState((s) => ({ ...s, fontStep: Math.max(0.85, +(s.fontStep - 0.1).toFixed(2)) })),
    resetFont: () => setState((s) => ({ ...s, fontStep: 1 })),
  }

  return <A11yContext.Provider value={api}>{children}</A11yContext.Provider>
}

export function useA11y() {
  const ctx = useContext(A11yContext)
  if (!ctx) throw new Error('useA11y must be used within A11yProvider')
  return ctx
}
