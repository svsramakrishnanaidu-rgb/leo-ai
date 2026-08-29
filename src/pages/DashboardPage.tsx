import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { FileText, Clock, Loader2, CheckCircle2, TrendingUp, Eye } from 'lucide-react'
import { t } from '../lib/i18n'
import { getAllComplaints, getDemoComplaints } from '../lib/storage'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { visible: { transition: { staggerChildren: 0.06 } } }

const PURPLE_GRADIENT = ['#7C3AED', '#9333EA', '#C026D3', '#A855F7', '#6D28D9']
const TIME_FILTERS = ['today', '7days', '30days', 'all'] as const

export default function DashboardPage() {
  const dict = t()
  const [timeFilter, setTimeFilter] = useState<typeof TIME_FILTERS[number]>('all')

  const allComplaints = useMemo(() => {
    const user = getAllComplaints()
    const demo = getDemoComplaints()
    const merged = [...user]
    demo.forEach(d => { if (!merged.find(m => m.trackingId === d.trackingId)) merged.push(d) })
    return merged
  }, [])

  const complaints = useMemo(() => {
    if (timeFilter === 'all') return allComplaints
    const now = Date.now()
    const cutoff = timeFilter === 'today' ? 86400000 : timeFilter === '7days' ? 7 * 86400000 : 30 * 86400000
    return allComplaints.filter(c => now - new Date(c.submittedAt).getTime() < cutoff)
  }, [allComplaints, timeFilter])

  const stats = useMemo(() => {
    const total = complaints.length
    const pending = complaints.filter(c => c.status === 'submitted').length
    const inProgress = complaints.filter(c => ['department_identified', 'under_review', 'work_started'].includes(c.status)).length
    const resolved = complaints.filter(c => c.status === 'resolved').length
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0
    const byCategory = Object.entries(
      complaints.reduce((acc, c) => { acc[c.categoryLabel] = (acc[c.categoryLabel] || 0) + 1; return acc }, {} as Record<string, number>)
    ).map(([name, count]) => ({ name, count }))
    const byPriority = ['critical', 'high', 'medium', 'low'].map(p => ({
      name: p.charAt(0).toUpperCase() + p.slice(1), count: complaints.filter(c => c.priority === p).length,
    }))
    return { total, pending, inProgress, resolved, resolutionRate, byCategory, byPriority }
  }, [complaints])

  const statCards = [
    { label: dict.dashTotal, value: stats.total, icon: FileText, gradient: 'from-[#7C3AED] to-[#9333EA]' },
    { label: dict.dashPending, value: stats.pending, icon: Clock, gradient: 'from-[#A855F7] to-[#C026D3]' },
    { label: dict.dashInProgress, value: stats.inProgress, icon: Loader2, gradient: 'from-[#9333EA] to-[#6D28D9]' },
    { label: dict.dashResolved, value: stats.resolved, icon: CheckCircle2, gradient: 'from-[#6D28D9] to-[#7C3AED]' },
  ]

  return (
    <div className="min-h-screen pb-16">
      <div className="page-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="section-label mb-2">Analytics</p>
          <h1 className="text-[32px] lg:text-[40px] font-extrabold section-heading mb-2">{dict.dashTitle}</h1>
          <p className="text-[15px] text-[#5F617A]">{dict.dashSubtitle}</p>
        </motion.div>

        {/* Time filter */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {([['today', dict.dashTimeToday], ['7days', dict.dashTimeWeek], ['30days', dict.dashTimeMonth], ['all', dict.dashTimeAll]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTimeFilter(key)} className={`px-5 py-2.5 rounded-xl text-[13px] font-medium shrink-0 transition-all duration-200 ${timeFilter === key ? 'bg-[#6D28D9] text-white shadow-[0_4px_12px_rgba(109,40,217,0.25)]' : 'bg-white border border-[#E8E7F0] text-[#5F617A] hover:border-[#C4B5FD]'}`}>
              {label}
            </button>
          ))}
        </motion.div>

        {/* Stat cards */}
        <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div key={i} variants={fadeUp} className="glass-card-static !rounded-[18px] !p-5 hover:!shadow-[0_20px_60px_rgba(109,40,217,0.12)] transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(109,40,217,0.20)]`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-[28px] font-extrabold text-[#111129] tracking-tight" style={{ fontFamily: 'Manrope' }}>{card.value}</p>
              <p className="text-[12px] text-[#8B8DA3] font-medium mt-0.5">{card.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Resolution rate */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card-static !rounded-[18px] !p-5 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-4 h-4 text-[#6D28D9]" />
            <span className="text-[13px] font-semibold text-[#5F617A]">{dict.dashResolutionRate}</span>
            <span className="text-[18px] font-bold text-[#6D28D9]">{stats.resolutionRate}%</span>
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" initial={{ width: '0%' }} animate={{ width: `${stats.resolutionRate}%` }} transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6">
            <h3 className="text-[15px] font-semibold text-[#111129] mb-5" style={{ fontFamily: 'Manrope' }}>{dict.dashByCategory}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EFF5" />
                <XAxis dataKey="name" tick={{ fill: '#8B8DA3', fontSize: 11 }} />
                <YAxis tick={{ fill: '#8B8DA3', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E8E7F0', borderRadius: '14px', color: '#111129', boxShadow: '0 10px 40px rgba(55,35,100,0.06)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {stats.byCategory.map((_, i) => <Cell key={i} fill={PURPLE_GRADIENT[i % PURPLE_GRADIENT.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6">
            <h3 className="text-[15px] font-semibold text-[#111129] mb-5" style={{ fontFamily: 'Manrope' }}>{dict.dashByPriority}</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={stats.byPriority.filter(p => p.count > 0)} cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={4} dataKey="count" label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {stats.byPriority.map((_, i) => <Cell key={i} fill={PURPLE_GRADIENT[i % PURPLE_GRADIENT.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E8E7F0', borderRadius: '14px', color: '#111129', boxShadow: '0 10px 40px rgba(55,35,100,0.06)' }} />
                <Legend wrapperStyle={{ color: '#5F617A', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent table */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card-static !rounded-[18px] !p-6">
          <h3 className="text-[15px] font-semibold text-[#111129] mb-5" style={{ fontFamily: 'Manrope' }}>{dict.dashRecent}</h3>
          {complaints.length === 0 ? (
            <p className="text-[14px] text-[#8B8DA3] text-center py-12">{dict.noData}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th className="hidden sm:table-cell">Title</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th className="hidden sm:table-cell">Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.slice(0, 10).map((c) => (
                    <tr key={c.id}>
                      <td className="font-mono text-[12px] text-[#8B8DA3]">{c.trackingId}</td>
                      <td className="text-[13px] text-[#111129] max-w-[220px] truncate hidden sm:table-cell">{c.title}</td>
                      <td className="text-[13px] text-[#5F617A]">{c.categoryLabel}</td>
                      <td>
                        <span className={`badge !text-[10px] !py-0.5 !px-2 ${c.priority === 'critical' ? 'priority-critical' : c.priority === 'high' ? 'priority-high' : c.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                          {c.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-[13px] text-[#5F617A] capitalize">{c.status.replace('_', ' ')}</td>
                      <td className="text-[12px] text-[#8B8DA3] hidden sm:table-cell">{new Date(c.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td>
                        <Link to="/track" className="text-[12px] text-[#6D28D9] hover:text-[#8B5CF6] flex items-center gap-1 transition-colors font-semibold">
                          <Eye className="w-3 h-3" /> {dict.dashViewDetails}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
