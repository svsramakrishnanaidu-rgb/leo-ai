import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe2, ChevronDown, Sparkles, FileText, MapPin, BarChart3, Route, Brain, Camera, Shield, Mic, Languages, Search } from 'lucide-react'
import { cn } from '../../lib/utils'
import { t, setLanguage, getLanguage, type Language } from '../../lib/i18n'

const navLinks = () => [
  { to: '/', label: t().navHome },
  { to: '/report', label: t().navReport },
  { to: '/track', label: t().navTrack },
  { to: '/map', label: t().navMap },
  { to: '/dashboard', label: t().navDashboard },
]

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'hi', label: 'हिंदी' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [featuresOpen, setFeaturesOpen] = useState(false)
  const [lang, setLang] = useState<Language>(getLanguage())
  const location = useLocation()
  const dict = t()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])

  const handleLangChange = (l: Language) => {
    setLang(l)
    setLanguage(l)
    setLangOpen(false)
  }

  const links = navLinks()
  const langLabel = languages.find(l => l.code === lang)?.label || 'English'

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
          'bg-white/95 backdrop-blur-xl border-[#E8E7F0] shadow-sm'
        )}
      >
        <div className="page-container">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'Manrope' }}>
                <span className="text-[#111129]">Leo</span>
                <span className="text-[#6D28D9]">AI</span>
              </span>
            </Link>

            {/* Desktop right */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Features dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-medium text-[#5F617A] hover:text-[#111129] hover:bg-[#F5F3FF] transition-all"
                >
                  Features
                  <ChevronDown className={cn('w-3 h-3 transition-transform', featuresOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {featuresOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setFeaturesOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-[520px] bg-white rounded-2xl border border-[#E8E7F0] shadow-lg shadow-black/5 overflow-hidden z-50 p-4"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { icon: Brain, label: 'AI Analysis', desc: 'Smart issue classification', to: '/report', color: '#6D28D9' },
                            { icon: FileText, label: 'Report Issue', desc: 'File a civic complaint', to: '/report', color: '#7C3AED' },
                            { icon: Route, label: 'Track Complaint', desc: 'Follow your report status', to: '/track', color: '#8B5CF6' },
                            { icon: MapPin, label: 'Issue Map', desc: 'View civic issues nearby', to: '/map', color: '#6D28D9' },
                            { icon: BarChart3, label: 'Analytics Dashboard', desc: 'Public complaint statistics', to: '/dashboard', color: '#7C3AED' },
                            { icon: Camera, label: 'Photo Detection', desc: 'Upload issue photos for AI', to: '/report', color: '#8B5CF6' },
                            { icon: Mic, label: 'Voice Input', desc: 'Describe issues by speaking', to: '/report', color: '#6D28D9' },
                            { icon: Shield, label: 'Safety Alerts', desc: 'Emergency detection system', to: '/report', color: '#7C3AED' },
                          ].map((feature, i) => (
                            <Link
                              key={i}
                              to={feature.to}
                              onClick={() => setFeaturesOpen(false)}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F5F3FF] transition-all group"
                            >
                              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${feature.color}15` }}>
                                <feature.icon className="w-4.5 h-4.5" style={{ color: feature.color }} />
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-[#111129] group-hover:text-[#6D28D9] transition-colors">{feature.label}</p>
                                <p className="text-[11px] text-[#8B8DA3]">{feature.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#E8E7F0]">
                          <p className="text-[11px] text-[#8B8DA3] text-center">All features are free • No account required</p>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Language dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium text-[#5F617A] hover:bg-[#F5F3FF] transition-all"
                >
                  <Globe2 className="w-4 h-4" />
                  {langLabel}
                  <ChevronDown className={cn('w-3 h-3 transition-transform', langOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {langOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-[#E8E7F0] shadow-lg shadow-black/5 overflow-hidden z-50"
                      >
                        {languages.map((l) => (
                          <button
                            key={l.code}
                            onClick={() => handleLangChange(l.code)}
                            className={cn(
                              'w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors',
                              lang === l.code ? 'bg-[#F5F3FF] text-[#6D28D9]' : 'text-[#5F617A] hover:bg-[#FAFAFF]'
                            )}
                          >
                            {l.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/report" className="btn-primary !py-2.5 !px-6 !text-[13px] !rounded-xl">
                {dict.navReportNow}
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[#5F617A] hover:bg-[#F5F3FF] transition-all"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[72px] left-0 right-0 bg-white border-b border-[#E8E7F0] shadow-lg z-50 lg:hidden"
            >
              <div className="page-container py-4">
                {/* Mobile features */}
                <div className="grid grid-cols-2 gap-2 mb-4 px-2">
                  {[
                    { icon: Brain, label: 'AI Analysis', to: '/report' },
                    { icon: FileText, label: 'Report Issue', to: '/report' },
                    { icon: Route, label: 'Track Complaint', to: '/track' },
                    { icon: MapPin, label: 'Issue Map', to: '/map' },
                    { icon: BarChart3, label: 'Analytics', to: '/dashboard' },
                    { icon: Camera, label: 'Photo Detection', to: '/report' },
                    { icon: Mic, label: 'Voice Input', to: '/report' },
                    { icon: Shield, label: 'Safety Alerts', to: '/report' },
                  ].map((f, i) => (
                    <Link
                      key={i}
                      to={f.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F5F3FF] hover:bg-[#EDE9FE] transition-all"
                    >
                      <f.icon className="w-4 h-4 text-[#6D28D9]" />
                      <span className="text-[13px] font-medium text-[#111129]">{f.label}</span>
                    </Link>
                  ))}
                </div>

                {/* Mobile language */}
                <div className="flex gap-2 mb-4 px-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLangChange(l.code)}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all',
                        lang === l.code
                          ? 'bg-[#6D28D9] text-white'
                          : 'bg-[#F5F3FF] text-[#5F617A] border border-[#E8E7F0]'
                      )}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                <div className="px-2">
                  <Link to="/report" className="btn-primary w-full text-center !text-[14px]">
                    {dict.navReportNow}
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
