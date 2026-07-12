import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import ne from './locales/ne'

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ne: { translation: ne } },
  lng: stored || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  try { localStorage.setItem('lang', lng) } catch { /* noop */ }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng === 'ne' ? 'ne' : 'en'
  }
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = (stored === 'ne') ? 'ne' : 'en'
}

export default i18n
