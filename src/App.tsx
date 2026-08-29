import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Background from './components/layout/Background'
import HomePage from './pages/HomePage'
import ReportPage from './pages/ReportPage'
import TrackPage from './pages/TrackPage'
import MapPage from './pages/MapPage'
import DashboardPage from './pages/DashboardPage'
import AccessibilityPage from './pages/AccessibilityPage'
import { initLanguage } from './lib/i18n'
import Chatbot from './components/ui/Chatbot'

export default function App() {
  useEffect(() => {
    initLanguage()
  }, [])

  return (
    <BrowserRouter>
      <Background />
      <div className="relative z-10 min-h-screen flex flex-col main-content">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/track" element={<TrackPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  )
}
