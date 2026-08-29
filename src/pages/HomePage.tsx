import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, ChevronDown, ChevronRight, Upload, Cpu, FileCheck, Send,
  Zap, Clock, Languages, CircleAlert, Droplets, TreeDeciduous, Lightbulb,
  Trash2, Construction, Landmark, Sparkles, Shield, TrendingUp, MapPin,
  Target, Building2, Route, Brain, CheckCircle2,
} from 'lucide-react'
import { t } from '../lib/i18n'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    if (!started) return
    let current = 0
    const timer = setInterval(() => {
      current += target / 60
      if (current >= target) { setCount(target); clearInterval(timer) } else setCount(Math.floor(current))
    }, 1000 / 30)
    return () => clearInterval(timer)
  }, [started, target])
  useEffect(() => {
    const el = document.getElementById(`stat-${target}`)
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span id={`stat-${target}`} className="tabular-nums">{count.toLocaleString()}{suffix}</span>
}

export default function HomePage() {
  const dict = t()
  const reducedMotion = useReducedMotion()
  const [analysisStep, setAnalysisStep] = useState(0)

  useEffect(() => {
    if (reducedMotion) { setAnalysisStep(5); return }
    const timers = [600, 1400, 2200, 3000, 3600].map((ms, i) =>
      setTimeout(() => setAnalysisStep(i + 1), ms)
    )
    const loop = setTimeout(() => setAnalysisStep(0), 6000)
    return () => { timers.forEach(clearTimeout); clearTimeout(loop) }
  }, [reducedMotion])

  const categories = [
    { icon: Construction, label: dict.catPothole, color: '#6D28D9' },
    { icon: Trash2, label: dict.catGarbage, color: '#7C3AED' },
    { icon: Lightbulb, label: dict.catStreetlight, color: '#8B5CF6' },
    { icon: Droplets, label: dict.catWaterLeak, color: '#6D28D9' },
    { icon: CircleAlert, label: dict.catDrainage, color: '#7C3AED' },
    { icon: TreeDeciduous, label: dict.catTree, color: '#8B5CF6' },
    { icon: Shield, label: dict.catManhole, color: '#6D28D9' },
    { icon: Landmark, label: dict.catProperty, color: '#7C3AED' },
  ]

  const features = [
    { icon: Brain, title: 'AI Analysis', desc: 'Advanced AI detects and categorizes issues automatically.' },
    { icon: Target, title: 'Real-time Tracking', desc: 'Track your complaint status in real-time.' },
    { icon: Building2, title: 'Multi-Department', desc: 'Automatically routes complaints to the right department.' },
    { icon: TrendingUp, title: 'Community Impact', desc: 'Your reports help build better, cleaner cities.' },
  ]

  const steps = [
    { icon: FileCheck, num: '01', title: 'Report', desc: 'Share details and upload photos of the issue.' },
    { icon: Cpu, num: '02', title: 'AI Analysis', desc: 'Our AI analyzes and categorizes the problem.' },
    { icon: Building2, num: '03', title: 'Assign', desc: 'Automatically assigned to the right department.' },
    { icon: CheckCircle2, num: '04', title: 'Track', desc: 'Follow progress until the issue is resolved.' },
  ]

  const faqs = [
    { q: dict.faq1Q, a: dict.faq1A },
    { q: dict.faq2Q, a: dict.faq2A },
    { q: dict.faq3Q, a: dict.faq3A },
    { q: dict.faq4Q, a: dict.faq4A },
  ]

  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="page-container">
          {/* Centered hero text */}
          <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center max-w-[700px] mx-auto mb-12 lg:mb-16">
            <motion.div variants={fadeUp} className="badge badge-purple mb-6 justify-center mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Civic Assistant</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-[40px] sm:text-[48px] lg:text-[56px] xl:text-[64px] font-extrabold leading-[1.06] tracking-[-0.03em] mb-6">
              Report a civic
              <br />
              problem in <span className="text-gradient">your city.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-[16px] text-[#5F617A] mb-10 max-w-[520px] leading-relaxed mx-auto">
              Leo AI helps you report civic issues, track progress, and create a cleaner, better community.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-8 justify-center">
              <Link to="/report" className="btn-primary">
                <FileCheck className="w-4 h-4" />
                Report an Issue
              </Link>
              <Link to="/track" className="btn-secondary">
                <MapPin className="w-4 h-4" />
                Track a Complaint
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="text-[13px] text-[#8B8DA3]">
              Making cities smarter, one report at a time.
            </motion.p>
          </motion.div>

          {/* Hero Visual — centered below text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative" style={{ maxWidth: '450px', margin: '0 auto' }}
          >
              {/* Main visual container */}
              <div className="relative w-full" style={{ maxWidth: '450px', margin: '0 auto' }}>
                {/* Purple background shape */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] rounded-[28px]" />

                {/* Main card */}
                <div className="relative bg-white rounded-[22px] border border-[#E8E7F0] overflow-hidden shadow-[0_20px_60px_rgba(109,40,217,0.08)]">
                  {/* Image area */}
                  <div className="relative h-[280px] bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] overflow-hidden">
                    {/* Civic issue illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/80 border border-[#E8E7F0] flex items-center justify-center mx-auto mb-4">
                          <Construction className="w-10 h-10 text-[#8B5CF6]" />
                        </div>
                        <p className="text-[13px] font-semibold text-[#5F617A]">Civic Issue Detection</p>
                      </div>
                    </div>
                    {/* Purple overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>

                  {/* Content below image */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                      <span className="text-[11px] font-semibold text-[#8B8DA3] uppercase tracking-wider">AI-Powered</span>
                    </div>
                    <h3 className="text-[17px] font-bold text-[#111129] mb-1" style={{ fontFamily: 'Manrope' }}>Smart Issue Detection</h3>
                    <p className="text-[13px] text-[#5F617A]">Upload a photo or describe the issue — Leo AI handles the rest.</p>
                  </div>
                </div>

                {/* Floating card 1 — AI Analysis */}
                <motion.div
                  initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={analysisStep >= 1 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                  className="absolute -top-4 -left-4 glass-card !rounded-[16px] !p-4 !shadow-[0_10px_40px_rgba(55,35,100,0.10)] z-10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] flex items-center justify-center">
                      <Brain className="w-5 h-5 text-[#6D28D9]" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-[#8B8DA3] uppercase tracking-wider">AI Analysis</p>
                      <p className="text-[14px] font-bold text-[#111129]" style={{ fontFamily: 'Manrope' }}>Pothole Detected</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="priority-high badge !py-1 !px-2.5 !text-[11px]">High Priority</span>
                  </div>
                </motion.div>

                {/* Floating card 2 — Tracking */}
                <motion.div
                  initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
                  animate={analysisStep >= 3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5 }}
                  className="absolute -bottom-4 -right-4 glass-card !rounded-[16px] !p-4 !shadow-[0_10px_40px_rgba(55,35,100,0.10)] z-10 w-[200px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#6D28D9]" />
                    <span className="text-[12px] font-bold text-[#111129]" style={{ fontFamily: 'Manrope' }}>Status</span>
                  </div>
                  <span className="badge badge-info !py-1 !px-2.5 !text-[11px] mb-2 inline-flex">In Progress</span>
                  <p className="text-[11px] text-[#8B8DA3]">Updated 2h ago</p>
                  <div className="mt-2 progress-bar">
                    <div className="progress-fill" style={{ width: '60%' }} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-6">
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger}>
            <div className="glass-card-static !rounded-[20px] !p-8 lg:!p-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                {[
                  { value: 1240, suffix: '+', label: dict.statIssues, icon: FileText },
                  { value: 18, suffix: '', label: dict.statCategories, icon: Building2 },
                  { value: 3, suffix: '', label: dict.statLanguages, icon: Languages },
                  { value: 58, suffix: 's', label: dict.statTime, icon: Clock },
                ].map((stat, i) => (
                  <motion.div key={i} variants={fadeUp} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] mb-3 shadow-[0_4px_12px_rgba(109,40,217,0.20)]">
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-3xl lg:text-4xl font-extrabold text-[#111129] mb-1 tracking-tight" style={{ fontFamily: 'Manrope' }}>
                      <Counter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-[13px] text-[#8B8DA3] font-medium">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY LEO AI ═══ */}
      <section style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="section-label mb-3">WHY LEO AI?</motion.p>
            <motion.h2 variants={fadeUp} className="text-[32px] lg:text-[40px] font-extrabold section-heading mb-4">
              Smarter reporting. Faster solutions.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[16px] text-[#5F617A] max-w-2xl mx-auto">
              Our AI-powered platform simplifies civic problem reporting and ensures your voice leads to real action.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card !rounded-[18px] !p-7 text-center group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-[#F5F3FF] border border-[#E8E7F0] flex items-center justify-center mx-auto mb-5 group-hover:bg-[#EDE9FE] group-hover:border-[#C4B5FD] transition-all duration-300">
                  <f.icon className="w-6 h-6 text-[#6D28D9]" />
                </div>
                <h3 className="text-[17px] font-bold text-[#111129] mb-2" style={{ fontFamily: 'Manrope' }}>{f.title}</h3>
                <p className="text-[14px] text-[#5F617A] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="bg-[#F5F3FF]/50" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} className="text-center mb-14">
            <motion.p variants={fadeUp} className="section-label mb-3">SUPPORTED ISSUES</motion.p>
            <motion.h2 variants={fadeUp} className="text-[32px] lg:text-[40px] font-extrabold section-heading mb-4">
              {dict.catTitle}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[16px] text-[#5F617A] max-w-xl mx-auto">
              Leo AI understands common civic problems across multiple public services.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {categories.map((cat, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6 text-center group cursor-default hover:!shadow-[0_20px_60px_rgba(109,40,217,0.12)] hover:!-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F3FF] border border-[#E8E7F0] flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EDE9FE] transition-all duration-300">
                  <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <p className="text-[14px] font-semibold text-[#111129]">{cat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} className="text-center mb-16">
            <motion.p variants={fadeUp} className="section-label mb-3">HOW IT WORKS</motion.p>
            <motion.h2 variants={fadeUp} className="text-[32px] lg:text-[40px] font-extrabold section-heading">
              Your voice. Our process.
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} className="relative">
            {/* Connection line — desktop only */}
            <div className="hidden lg:block absolute top-[42px] left-[12.5%] right-[12.5%] h-[2px] bg-[#E8E7F0]" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center relative">
                  <div className="relative inline-flex mb-6">
                    <div className="w-[84px] h-[84px] rounded-full bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center shadow-[0_8px_24px_rgba(109,40,217,0.20)] relative z-10">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#111129] text-white text-[11px] font-bold flex items-center justify-center z-20">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#111129] mb-2" style={{ fontFamily: 'Manrope' }}>{step.title}</h3>
                  <p className="text-[14px] text-[#5F617A] max-w-[220px] mx-auto">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="bg-[#F5F3FF]/50" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
        <div className="max-w-3xl mx-auto px-5">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger}>
            <div className="text-center mb-14">
              <motion.p variants={fadeUp} className="section-label mb-3">FAQ</motion.p>
              <motion.h2 variants={fadeUp} className="text-[32px] lg:text-[40px] font-extrabold section-heading">
                {dict.faqTitle}
              </motion.h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => <FaqItem key={i} faq={faq} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section style={{ paddingTop: '120px', paddingBottom: '120px' }}>
        <div className="page-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger}>
            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#5122B8] via-[#7C3AED] to-[#A855F7] p-10 lg:p-16 text-center">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-[60px]" />
                <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/10 blur-[80px]" />
              </div>

              <motion.h2 variants={fadeUp} className="text-[28px] lg:text-[36px] font-extrabold text-white mb-4 relative" style={{ fontFamily: 'Manrope' }}>
                Turn a civic problem into
                <br />a clear next step.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[16px] text-white/70 mb-8 relative">
                Together, we can build better cities.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center relative">
                <Link to="/report" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-[14px] bg-white text-[#6D28D9] font-bold text-[15px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all" style={{ fontFamily: 'Manrope' }}>
                  <FileCheck className="w-4 h-4" />
                  Report an Issue
                </Link>
                <Link to="/track" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-[14px] border-2 border-white/30 text-white font-bold text-[15px] hover:bg-white/10 transition-all" style={{ fontFamily: 'Manrope' }}>
                  <MapPin className="w-4 h-4" />
                  Track a Complaint
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function FaqItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card-static !rounded-[18px] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={open}>
        <span className="text-[15px] font-semibold text-[#111129] pr-4" style={{ fontFamily: 'Manrope' }}>{faq.q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-[#8B8DA3] shrink-0" />
        </motion.div>
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }} className="overflow-hidden">
        <div className="px-5 pb-5">
          <p className="text-[14px] text-[#5F617A] leading-relaxed">{faq.a}</p>
        </div>
      </motion.div>
    </div>
  )
}

function FileText(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
}
