import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Upload, X, MapPin, ArrowRight, ArrowLeft, Loader2,
  Check, Copy, Download, ExternalLink, Sparkles, AlertTriangle,
  ChevronRight, FileCheck, Info, RefreshCw, Brain, Route,
} from 'lucide-react'
import { t, setLanguage, getLanguage, priorityLabels } from '../lib/i18n'
import { analyzeIssue, generateComplaint } from '../lib/ai'
import { saveComplaint as saveToStorage } from '../lib/storage'
import { generateTrackingId } from '../lib/utils'
import LocationSearch from '../components/ui/LocationSearch'
import type { Complaint, IssueCategory, Priority, AiAnalysis, Language } from '../types'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function ReportPage() {
  const dict = t()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [landmark, setLandmark] = useState('')
  const [latitude, setLatitude] = useState<number | undefined>()
  const [longitude, setLongitude] = useState<number | undefined>()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [language, setLang] = useState<Language>(getLanguage())
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [complaint, setComplaint] = useState<{ title: string; body: string; requestedAction: string } | null>(null)
  const [generating, setGenerating] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [trackingId, setTrackingId] = useState('')

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) setVoiceSupported(false)
  }, [])

  const toggleVoice = () => {
    if (!voiceSupported) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    if (listening) { window._speechRec?.stop(); setListening(false); return }
    const rec = new SR()
    window._speechRec = rec
    rec.lang = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN'
    rec.interimResults = false
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ')
      setDescription(prev => prev ? `${prev} ${transcript}` : transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    rec.start()
    setListening(true)
  }

  const handleImage = useCallback((file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return
    if (file.size > 5 * 1024 * 1024) return
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleImage(file)
  }, [handleImage])

  const runAnalysis = async () => {
    if (!description.trim() || description.trim().length < 5 || !location.trim()) return
    setStep(2); setAnalyzing(true); setAnalysisError('')
    try {
      const result = await analyzeIssue(description, language)
      setAnalysis(result)
    } catch { setAnalysisError(dict.error) }
    finally { setAnalyzing(false) }
  }

  const runGeneration = async () => {
    if (!analysis) return
    setGenerating(true)
    try {
      const result = await generateComplaint({ text: description, category: analysis.category, department: analysis.department, location, priority: analysis.priority, language })
      setComplaint(result); setStep(3)
    } catch {
      setComplaint({ title: `${analysis.categoryLabel} - ${location}`, body: `To,\nThe Officer concerned,\n${analysis.departmentLabel}\n\nSubject: Complaint regarding ${analysis.categoryLabel}\n\nRespected Sir/Madam,\n\n${description}\n\nLocation: ${location}\n\nI request you to kindly look into this matter.\n\nYours faithfully,\n[Your Name]`, requestedAction: analysis.requestedAction })
      setStep(3)
    } finally { setGenerating(false) }
  }

  const handleSubmit = () => {
    if (!analysis || !complaint) return
    const id = generateTrackingId()
    const now = new Date().toISOString()
    saveToStorage({
      id: `user-${Date.now()}`, trackingId: id, title: complaint.title, description, category: analysis.category as IssueCategory,
      categoryLabel: analysis.categoryLabel, department: analysis.department, departmentLabel: analysis.departmentLabel,
      priority: analysis.priority as Priority, status: 'submitted', location, latitude, longitude, landmark, language,
      submittedAt: now, updatedAt: now, requestedAction: complaint.requestedAction, supports: 0,
      timeline: [{ status: 'submitted', label: 'Complaint submitted', timestamp: now }, { status: 'department_identified', label: `${analysis.departmentLabel} identified`, timestamp: now }],
    })
    setTrackingId(id); setSubmitted(true)
  }

  const copyComplaint = () => { if (complaint) navigator.clipboard.writeText(complaint.body) }
  const downloadComplaint = () => {
    if (!complaint) return
    const blob = new Blob([complaint.body], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `complaint-${trackingId || 'draft'}.txt`; a.click(); URL.revokeObjectURL(url)
  }

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : 100
  const canProceedStep1 = description.trim().length >= 5 && location.trim().length > 0

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-[900px] mx-auto px-5">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-[32px] lg:text-[38px] font-extrabold section-heading mb-2">{dict.reportTitle}</h1>
          <p className="text-[15px] text-[#5F617A]">Describe the problem and Leo AI will help identify the right category and department.</p>
        </motion.div>

        {/* Progress */}
        <div className="glass-card-static !rounded-[18px] !p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            {[dict.reportStep1, dict.reportStep2, dict.reportStep3].map((label, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`step-circle ${step > i + 1 ? 'step-done' : step === i + 1 ? 'step-active' : 'step-pending'}`}>
                  {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[13px] font-semibold hidden sm:block ${step === i + 1 ? 'text-[#111129]' : 'text-[#8B8DA3]'}`}>{label}</span>
                {i < 2 && <ChevronRight className="w-4 h-4 text-[#E8E7F0] mx-1" />}
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" initial={{ width: '0%' }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} />
          </div>
        </div>

        {/* Success Modal */}
        <AnimatePresence>
          {submitted && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/30 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[22px] p-8 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.12)] text-center">
                <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center mx-auto mb-5">
                  <Check className="w-8 h-8 text-[#22C55E]" />
                </div>
                <h2 className="text-[20px] font-bold text-[#111129] mb-2" style={{ fontFamily: 'Manrope' }}>{dict.reportSuccess}</h2>
                <div className="bg-[#F5F3FF] rounded-[14px] p-4 mb-6">
                  <p className="text-[11px] text-[#8B8DA3] uppercase tracking-wider mb-1">{dict.reportTrackId}</p>
                  <p className="text-[18px] font-mono font-bold text-[#6D28D9]">{trackingId}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={() => navigator.clipboard.writeText(trackingId)} className="btn-secondary w-full justify-center">{dict.reportCopyId}</button>
                  <button onClick={() => navigate('/track', { state: { trackingId } })} className="btn-primary w-full justify-center">{dict.reportTrackBtn} <ArrowRight className="w-4 h-4" /></button>
                  <button onClick={() => { setSubmitted(false); setStep(1); setDescription(''); setLocation(''); setLandmark(''); setImagePreview(null); setAnalysis(null); setComplaint(null); setTrackingId('') }} className="btn-ghost w-full justify-center">{dict.reportNewBtn}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: Describe */}
        {step === 1 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            <div className="glass-card-static !rounded-[18px] !p-6">
              <label className="block text-[14px] font-semibold text-[#111129] mb-3" style={{ fontFamily: 'Manrope' }}>{dict.reportDescLabel}</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={dict.reportDescPlaceholder} rows={5} maxLength={2000} className="form-textarea" />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  {voiceSupported && (
                    <button onClick={toggleVoice} className={`btn-ghost !px-3 !py-1.5 !text-[12px] ${listening ? '!text-[#6D28D9] !bg-[#F5F3FF]' : ''}`}>
                      {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {listening ? 'Stop' : dict.reportVoiceBtn}
                    </button>
                  )}
                </div>
                <span className="text-[12px] text-[#8B8DA3]">{description.length}/2000</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {((dict.reportChips || []) as string[]).map((chip: string, i: number) => (
                  <button key={i} onClick={() => setDescription(chip)} className="badge badge-purple !cursor-pointer hover:!bg-[#EDE9FE] transition-colors">{chip}</button>
                ))}
              </div>
            </div>

            <div className="glass-card-static !rounded-[18px] !p-6">
              <label className="block text-[14px] font-semibold text-[#111129] mb-3" style={{ fontFamily: 'Manrope' }}>{dict.reportLocationLabel}</label>
              <LocationSearch value={location} onChange={setLocation} onCoordinates={(lat, lng) => { setLatitude(lat); setLongitude(lng) }} placeholder="Search for an address or detect your location..." />
              {(latitude || longitude) && <p className="text-[12px] text-[#8B8DA3] mt-2">📍 Coordinates: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}</p>}
              <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Landmark (optional)" className="form-input mt-3" />
            </div>

            <div className="glass-card-static !rounded-[18px] !p-6">
              <label className="block text-[14px] font-semibold text-[#111129] mb-3" style={{ fontFamily: 'Manrope' }}>{dict.reportImageLabel}</label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Uploaded" className="w-full max-h-48 object-contain rounded-[14px] border border-[#E8E7F0]" />
                  <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white border border-[#E8E7F0] flex items-center justify-center text-[#5F617A] hover:bg-[#FEF2F2] transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#E8E7F0] rounded-[14px] p-8 text-center cursor-pointer hover:border-[#C4B5FD] hover:bg-[#F5F3FF] transition-all">
                  <Upload className="w-8 h-8 text-[#C4B5FD] mx-auto mb-3" />
                  <p className="text-[14px] text-[#5F617A]">{dict.reportImageDrop}</p>
                  <p className="text-[12px] text-[#8B8DA3] mt-1">{dict.reportImageTypes}</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} className="hidden" />
            </div>

            <div className="glass-card-static !rounded-[18px] !p-6">
              <label className="block text-[14px] font-semibold text-[#111129] mb-3" style={{ fontFamily: 'Manrope' }}>{dict.reportLanguageLabel}</label>
              <div className="flex gap-3">
                {[{ code: 'en' as Language, label: 'English' }, { code: 'te' as Language, label: 'తెలుగు' }, { code: 'hi' as Language, label: 'हिंदी' }].map((l) => (
                  <button key={l.code} onClick={() => { setLang(l.code); setLanguage(l.code) }} className={`flex-1 py-3 rounded-[12px] text-[14px] font-semibold transition-all ${language === l.code ? 'bg-[#6D28D9] text-white shadow-[0_4px_12px_rgba(109,40,217,0.25)]' : 'bg-white border border-[#E8E7F0] text-[#5F617A] hover:border-[#C4B5FD]'}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={runAnalysis} disabled={!canProceedStep1} className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
              <Brain className="w-4 h-4" /> Analyze with Leo AI <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 2: AI Analysis */}
        {step === 2 && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            {analyzing ? (
              <div className="glass-card-static !rounded-[18px] !p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5F3FF] flex items-center justify-center mx-auto mb-6">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                    <Brain className="w-8 h-8 text-[#6D28D9]" />
                  </motion.div>
                </div>
                <h3 className="text-[18px] font-bold text-[#111129] mb-2" style={{ fontFamily: 'Manrope' }}>{dict.reportScanTitle}</h3>
                <p className="text-[14px] text-[#5F617A]">{dict.reportScanDesc}</p>
              </div>
            ) : analysisError ? (
              <div className="glass-card-static !rounded-[18px] !p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-[#F59E0B] mx-auto mb-4" />
                <p className="text-[#5F617A] mb-4">{analysisError}</p>
                <button onClick={runAnalysis} className="btn-primary"><RefreshCw className="w-4 h-4" /> {dict.retry}</button>
              </div>
            ) : analysis ? (
              <div className="glass-card-static !rounded-[18px] !p-6 lg:!p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-[#6D28D9]" />
                  <h3 className="text-[18px] font-bold text-[#111129]" style={{ fontFamily: 'Manrope' }}>AI Analysis Results</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#F5F3FF] rounded-[14px] p-4 border border-[#E8E7F0]">
                    <p className="text-[11px] text-[#8B8DA3] uppercase tracking-wider font-semibold mb-1">Issue Category</p>
                    <p className="text-[15px] font-bold text-[#111129]">{analysis.categoryLabel}</p>
                  </div>
                  <div className="bg-[#F5F3FF] rounded-[14px] p-4 border border-[#E8E7F0]">
                    <p className="text-[11px] text-[#8B8DA3] uppercase tracking-wider font-semibold mb-1">Priority</p>
                    <span className={`badge ${analysis.priority === 'critical' ? 'priority-critical' : analysis.priority === 'high' ? 'priority-high' : analysis.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                      {priorityLabels[analysis.priority]?.[language] || analysis.priority}
                    </span>
                  </div>
                  <div className="sm:col-span-2 bg-[#F5F3FF] rounded-[14px] p-4 border border-[#E8E7F0]">
                    <p className="text-[11px] text-[#8B8DA3] uppercase tracking-wider font-semibold mb-1">Department</p>
                    <p className="text-[15px] font-bold text-[#111129] flex items-center gap-2"><Route className="w-4 h-4 text-[#6D28D9]" /> {analysis.departmentLabel}</p>
                  </div>
                </div>

                {analysis.safetyWarning && (
                  <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-[14px] p-4 mb-6">
                    <div className="flex items-start gap-2"><AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" /><p className="text-[14px] text-[#DC2626]">{analysis.safetyWarning}</p></div>
                  </div>
                )}

                <div className="bg-[#FAFAFF] border border-[#E8E7F0] rounded-[14px] p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2"><Info className="w-4 h-4 text-[#6D28D9]" /><p className="text-[12px] font-semibold text-[#5F617A]">{dict.reportExplanation}</p></div>
                  <p className="text-[14px] text-[#5F617A] leading-relaxed">{analysis.explanation}</p>
                </div>

                <div className="bg-[#FAFAFF] border border-[#E8E7F0] rounded-[14px] p-4 mb-6">
                  <p className="text-[11px] text-[#8B8DA3] uppercase tracking-wider mb-1">Location</p>
                  <p className="text-[14px] text-[#5F617A] flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {location}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary"><ArrowLeft className="w-4 h-4" /> {dict.reportBack}</button>
                  <button onClick={runGeneration} disabled={generating} className="btn-primary flex-1 justify-center disabled:opacity-50">
                    {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> {dict.reportGenerating}</> : <>{dict.reportGoToGenerate} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* Step 3: Complaint */}
        {step === 3 && complaint && (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="glass-card-static !rounded-[18px] !p-6 lg:!p-8">
              <div className="flex items-center gap-2 mb-6">
                <FileCheck className="w-5 h-5 text-[#6D28D9]" />
                <h3 className="text-[18px] font-bold text-[#111129]" style={{ fontFamily: 'Manrope' }}>{dict.reportGenTitle}</h3>
              </div>

              <div className="bg-[#F5F3FF] rounded-[14px] p-5 mb-4 border border-[#E8E7F0]">
                <p className="text-[11px] text-[#8B8DA3] uppercase tracking-wider mb-1.5 font-semibold">Subject</p>
                <p className="text-[16px] font-bold text-[#111129]">{complaint.title}</p>
              </div>

              <div className="bg-white rounded-[14px] p-5 mb-4 border border-[#E8E7F0] whitespace-pre-wrap">
                <p className="text-[11px] text-[#8B8DA3] uppercase tracking-wider mb-2 font-semibold">Complaint</p>
                <p className="text-[14px] text-[#5F617A] leading-relaxed font-mono">{complaint.body}</p>
              </div>

              <div className="bg-[#F5F3FF] rounded-[14px] p-4 mb-6 border border-[#E8E7F0]">
                <p className="text-[11px] text-[#8B8DA3] uppercase tracking-wider mb-1 font-semibold">Requested Action</p>
                <p className="text-[14px] text-[#5F617A]">{complaint.requestedAction}</p>
              </div>

              <p className="text-[12px] text-[#8B8DA3] mb-6 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> AI-generated draft — review before use.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                <button onClick={copyComplaint} className="btn-secondary justify-center !text-[13px]"><Copy className="w-3.5 h-3.5" /> {dict.reportCopy}</button>
                <button onClick={downloadComplaint} className="btn-secondary justify-center !text-[13px]"><Download className="w-3.5 h-3.5" /> {dict.reportDownload}</button>
                <button onClick={() => setStep(1)} className="btn-secondary justify-center !text-[13px]"><RefreshCw className="w-3.5 h-3.5" /> {dict.reportEditBtn}</button>
              </div>

              <div className="space-y-3">
                <button onClick={handleSubmit} className="btn-primary w-full justify-center"><Sparkles className="w-4 h-4" /> {dict.reportSubmit}</button>
                <a href="https://services.india.gov.in" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full justify-center"><ExternalLink className="w-4 h-4" /> {dict.reportOfficial}</a>
                <p className="text-[12px] text-[#8B8DA3] text-center">{dict.reportOfficialNote}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
