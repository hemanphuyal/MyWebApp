import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App'
import { ThemeProvider } from './contexts/ThemeContext'
import { A11yProvider } from './contexts/A11yContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <A11yProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </A11yProvider>
    </ThemeProvider>
  </StrictMode>,
)
