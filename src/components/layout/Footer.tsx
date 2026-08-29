import { Link } from 'react-router-dom'
import { Sparkles, ExternalLink } from 'lucide-react'
import { t } from '../../lib/i18n'

export default function Footer() {
  const dict = t()
  return (
    <footer className="footer-dark">
      <div className="page-container" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
                <Sparkles className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[20px] font-bold text-white tracking-tight" style={{ fontFamily: 'Manrope' }}>
                Leo<span className="text-[#A855F7]">AI</span>
              </span>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed max-w-xs">
              AI-powered platform for smarter civic reporting and better communities.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-bold text-white/25 uppercase tracking-[0.15em] mb-4" style={{ fontFamily: 'Manrope' }}>Platform</h4>
            <ul className="space-y-3">
              <li><Link to="/report" className="text-[13px]">Report an Issue</Link></li>
              <li><Link to="/track" className="text-[13px]">Track Complaint</Link></li>
              <li><Link to="/dashboard" className="text-[13px]">Analytics</Link></li>
              <li><Link to="/about" className="text-[13px]">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[11px] font-bold text-white/25 uppercase tracking-[0.15em] mb-4" style={{ fontFamily: 'Manrope' }}>Resources</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-[13px]">How it Works</Link></li>
              <li><Link to="/accessibility" className="text-[13px]">FAQ</Link></li>
              <li><Link to="/privacy" className="text-[13px]">Privacy Policy</Link></li>
              <li><Link to="/accessibility" className="text-[13px]">Accessibility</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[11px] font-bold text-white/25 uppercase tracking-[0.15em] mb-4" style={{ fontFamily: 'Manrope' }}>Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-[13px]">Help Center</a></li>
              <li><a href="#" className="text-[13px]">Contact Us</a></li>
              <li><a href="#" className="text-[13px]">Feedback</a></li>
            </ul>
          </div>

          {/* Get the App */}
          <div>
            <h4 className="text-[11px] font-bold text-white/25 uppercase tracking-[0.15em] mb-4" style={{ fontFamily: 'Manrope' }}>Get the App</h4>
            <p className="text-[13px] text-white/40 mb-4">Report issues on the go.</p>
            <Link to="/report" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/10 text-[13px] font-medium text-white hover:bg-white/15 transition-all">
              Open Web App <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-white/25">© 2026 Leo AI. All rights reserved.</p>
          <p className="text-[12px] text-white/25">Made with 💜 for better cities</p>
        </div>
      </div>
    </footer>
  )
}
