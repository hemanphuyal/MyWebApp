import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import Services from './pages/Services'
import Tools from './pages/Tools'
import CalendarPage from './pages/CalendarPage'
import PercentageCalc from './pages/tools/PercentageCalc'
import UnitConverter from './pages/tools/UnitConverter'
import SubnetCalculator from './pages/tools/SubnetCalculator'
import BinaryConverter from './pages/tools/BinaryConverter'
import AgeCalculator from './pages/tools/AgeCalculator'
import DateConverter from './pages/tools/DateConverter'
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
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tools/percentage" element={<PercentageCalc />} />
          <Route path="/tools/unit-converter" element={<UnitConverter />} />
          <Route path="/tools/subnet" element={<SubnetCalculator />} />
          <Route path="/tools/binary" element={<BinaryConverter />} />
          <Route path="/tools/age" element={<AgeCalculator />} />
          <Route path="/tools/date-converter" element={<DateConverter />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
