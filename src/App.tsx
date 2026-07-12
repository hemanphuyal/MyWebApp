import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Tools from './pages/Tools'
import NotFound from './pages/NotFound'

export default function App() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  return (
    <>
      <a href="#main" className="skip-link">{t('common.skipToContent')}</a>
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
