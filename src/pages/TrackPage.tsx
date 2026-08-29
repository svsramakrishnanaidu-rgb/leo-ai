import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Clock, CheckCircle2, AlertCircle, Eye, Send, Wrench } from 'lucide-react'
import { t } from '../lib/i18n'
import { getComplaintByTrackingId, getDemoComplaints } from '../lib/storage'
import type { Complaint, ComplaintStatus } from '../types'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { visible: { transition: { staggerChildren: 0.06 } } }

export default function TrackPage() {
  const dict = t()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<Complaint | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [demoId] = useState('LEO-2026-1001')

  useEffect(() => {
    const state = location.state as { trackingId?: string } | null
    if (state?.trackingId) { setQuery(state.trackingId); handleSearch(state.trackingId) }
  }, [location.state])

  const handleSearch = (id?: string) => {
    const searchId = (id || query).trim().toUpperCase()
    if (!searchId) return
    const userComplaint = getComplaintByTrackingId(searchId)
    if (userComplaint) { setResult(userComplaint); setNotFound(false); return }
    const demo = getDemoComplaints().find(c => c.trackingId === searchId)
    if (demo) { setResult(demo); setNotFound(false); return }
    setResult(null); setNotFound(true)
  }

  const statusSteps: { key: ComplaintStatus; label: string }[] = [
    { key: 'submitted', label: dict.trackSubmitted },
    { key: 'department_identified', label: dict.trackDeptIdentified },
    { key: 'under_review', label: dict.trackUnderReview },
    { key: 'work_started', label: dict.trackWorkStarted },
    { key: 'resolved', label: dict.trackResolved },
  ]

  const getStatusIndex = (status: ComplaintStatus) => statusSteps.findIndex(s => s.key === status)
  const statusIcons: Record<string, typeof Send> = { submitted: Send, department_identified: AlertCircle, under_review: Eye, work_started: Wrench, resolved: CheckCircle2 }

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-[32px] lg:text-[38px] font-extrabold section-heading mb-2">{dict.trackTitle}</h1>
        </motion.div>

        {/* Search */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6 mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B8DA3]" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder={dict.trackPlaceholder} className="form-input !pl-11" />
            </div>
            <button onClick={() => handleSearch()} className="btn-primary"><Search className="w-4 h-4" /> {dict.trackSearch}</button>
          </div>
          <p className="text-[13px] text-[#8B8DA3] mt-3">💡 {dict.trackDemoHint} <button onClick={() => { setQuery(demoId); handleSearch(demoId) }} className="text-[#6D28D9] hover:text-[#8B5CF6] font-semibold underline">{demoId}</button></p>
        </motion.div>

        {notFound && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card-static !rounded-[18px] !p-8 text-center">
            <AlertCircle className="w-12 h-12 text-[#8B8DA3] mx-auto mb-4" />
            <h3 className="text-[18px] font-bold text-[#111129] mb-2" style={{ fontFamily: 'Manrope' }}>{dict.trackNotFound}</h3>
            <p className="text-[14px] text-[#5F617A]">{dict.trackNotFoundDesc}</p>
          </motion.div>
        )}

        {result && (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
            <motion.div variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6">
              <div className="flex items-start justify-between mb-5">
                <h2 className="text-[18px] font-bold text-[#111129] flex-1" style={{ fontFamily: 'Manrope' }}>{result.title}</h2>
                <span className={`badge ${result.priority === 'critical' ? 'priority-critical' : result.priority === 'high' ? 'priority-high' : result.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                  {result.priority.toUpperCase()}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[['Category', result.categoryLabel], ['Department', result.departmentLabel], ['Location', result.location], ['Submitted', new Date(result.submittedAt).toLocaleDateString('en-IN')]].map(([label, value]) => (
                  <div key={label} className="bg-[#FAFAFF] rounded-[12px] p-3 border border-[#E8E7F0]">
                    <p className="text-[10px] text-[#8B8DA3] uppercase tracking-wider font-semibold">{label}</p>
                    <p className="text-[14px] text-[#111129] font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-[14px] text-[#5F617A] leading-relaxed">{result.description}</p>
            </motion.div>

            {/* Timeline */}
            <motion.div variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6">
              <h3 className="text-[16px] font-bold text-[#111129] mb-6" style={{ fontFamily: 'Manrope' }}>Tracking Timeline</h3>
              <div className="space-y-0">
                {statusSteps.map((step, i) => {
                  const currentIdx = getStatusIndex(result.status)
                  const isCompleted = i <= currentIdx
                  const isCurrent = i === currentIdx
                  const Icon = statusIcons[step.key] || Send
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${isCompleted ? 'bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] text-white shadow-[0_4px_12px_rgba(109,40,217,0.25)]' : 'bg-[#F0EFF5] text-[#8B8DA3]'} ${isCurrent ? 'ring-4 ring-[#C4B5FD] ring-offset-2 ring-offset-white' : ''}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {i < statusSteps.length - 1 && <div className={`w-0.5 h-10 ${isCompleted ? 'bg-[#8B5CF6]' : 'bg-[#E8E7F0]'}`} />}
                      </div>
                      <div className="pb-6">
                        <p className={`text-[14px] font-semibold ${isCompleted ? 'text-[#111129]' : 'text-[#8B8DA3]'}`}>{step.label}</p>
                        {result.timeline.find(t => t.status === step.key) && (
                          <p className="text-[12px] text-[#8B8DA3] mt-0.5">
                            {new Date(result.timeline.find(t => t.status === step.key)!.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                        {result.timeline.find(t => t.status === step.key)?.note && (
                          <p className="text-[12px] text-[#5F617A] mt-1 italic">{result.timeline.find(t => t.status === step.key)!.note}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
