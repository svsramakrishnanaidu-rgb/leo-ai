import { motion } from 'framer-motion'
import { Keyboard, Eye, Globe, Mic, MonitorSmartphone, Volume2, Shield } from 'lucide-react'
import { t } from '../lib/i18n'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.08 } } }

export default function AccessibilityPage() {
  const dict = t()
  const features = [
    { icon: Keyboard, title: 'Keyboard Navigation', desc: 'All interactive elements are accessible via keyboard. Use Tab to navigate, Enter to activate, and Escape to close modals.' },
    { icon: Eye, title: 'Visible Focus States', desc: 'All focusable elements have clear, visible focus indicators with high-contrast purple outlines.' },
    { icon: Globe, title: 'Multilingual Support', desc: 'Switch between English, Telugu, and Hindi from any page. Language preference is saved in your browser.' },
    { icon: Mic, title: 'Voice Input', desc: 'Use voice input (Web Speech API) in supported browsers to describe issues hands-free. Falls back to typing on unsupported browsers.' },
    { icon: Volume2, title: 'Screen Reader Friendly', desc: 'ARIA labels, roles, and landmarks are used throughout. Dynamic content updates are announced via aria-live regions.' },
    { icon: MonitorSmartphone, title: 'Responsive Design', desc: 'Fully responsive across all screen sizes — mobile, tablet, laptop, and desktop. Minimum touch targets are 44×44px.' },
  ]

  return (
    <div className="min-h-screen pb-16">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="section-label mb-2">Accessibility</p>
          <h1 className="text-[32px] lg:text-[40px] font-extrabold section-heading mb-4">{dict.footerAccessibility}</h1>
          <p className="text-[16px] text-[#5F617A] max-w-2xl mx-auto leading-relaxed">
            Leo AI is committed to being accessible to all citizens. We follow WCAG 2.1 AA guidelines as closely as possible.
          </p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6 hover:!shadow-[0_20px_60px_rgba(109,40,217,0.12)] hover:!-translate-y-1 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(109,40,217,0.20)]">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-[16px] font-bold text-[#111129] mb-2" style={{ fontFamily: 'Manrope' }}>{f.title}</h3>
              <p className="text-[14px] text-[#5F617A] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] border border-[#E8E7F0] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#6D28D9]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#111129]" style={{ fontFamily: 'Manrope' }}>Reduced Motion</h2>
          </div>
          <p className="text-[14px] text-[#5F617A] leading-relaxed">
            Leo AI respects your system's reduced-motion setting. When <code className="px-1.5 py-0.5 rounded-md bg-[#F5F3FF] text-[#6D28D9] text-[13px] font-mono border border-[#E8E7F0]">prefers-reduced-motion: reduce</code> is enabled,
            all animations, parallax effects, and transitions are minimized or disabled for a comfortable experience.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F3FF] border border-[#E8E7F0] flex items-center justify-center">
              <Mic className="w-5 h-5 text-[#6D28D9]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#111129]" style={{ fontFamily: 'Manrope' }}>Contact</h2>
          </div>
          <p className="text-[14px] text-[#5F617A] leading-relaxed">
            If you encounter any accessibility barriers while using Leo AI, please let us know.
            We are committed to making our platform usable for everyone.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
