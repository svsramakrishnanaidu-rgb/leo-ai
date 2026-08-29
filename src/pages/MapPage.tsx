import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Filter, ThumbsUp, Navigation } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { t } from '../lib/i18n'
import { getDemoMapReports, addSupport } from '../lib/storage'

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

function LocateButton() {
  const map = useMap()
  const handleClick = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 13),
      () => {}
    )
  }
  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 right-4 z-[1000] bg-white px-3 py-2 text-xs text-[#5F617A] flex items-center gap-1.5 hover:bg-[#F5F3FF] border border-[#E8E7F0] rounded-[12px] font-medium shadow-sm transition-all"
    >
      <Navigation className="w-3.5 h-3.5" /> Use My Location
    </button>
  )
}

export default function MapPage() {
  const dict = t()
  const [catFilter, setCatFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [supportCounts, setSupportCounts] = useState<Record<string, number>>({})
  const [showFilters, setShowFilters] = useState(false)

  const reports = useMemo(() => {
    return getDemoMapReports().map(r => ({
      ...r,
      supports: supportCounts[r.id] || r.supports,
    }))
  }, [supportCounts])

  const filtered = useMemo(() => {
    return reports.filter(r => {
      if (catFilter !== 'all' && r.category !== catFilter) return false
      if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      return true
    })
  }, [reports, catFilter, priorityFilter, statusFilter])

  const handleSupport = (id: string, baseCount: number) => {
    const newCount = addSupport(id, baseCount)
    setSupportCounts(prev => ({ ...prev, [id]: newCount }))
  }

  const priorityColor: Record<string, string> = {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#EAB308',
    low: '#22C55E',
  }

  const priorityBg: Record<string, string> = {
    critical: 'bg-red-50 text-red-600 border border-red-100',
    high: 'bg-orange-50 text-orange-600 border border-orange-100',
    medium: 'bg-amber-50 text-amber-600 border border-amber-100',
    low: 'bg-green-50 text-green-600 border border-green-100',
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="section-label mb-2">Live Map</p>
          <h1 className="text-[32px] lg:text-[40px] font-extrabold section-heading mb-2">{dict.mapTitle}</h1>
          <p className="text-[15px] text-[#5F617A]">{dict.mapSubtitle}</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card-static !rounded-[18px] !p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-ghost !px-3 !py-1.5 !text-[13px] flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" /> {dict.mapFilters}
            </button>
            <span className="text-[12px] text-[#8B8DA3]">{filtered.length} reports shown</span>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E8E7F0]">
              <div>
                <label className="text-[11px] text-[#8B8DA3] uppercase tracking-wider font-semibold mb-1.5 block">{dict.mapCategory}</label>
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="form-input !py-2.5 !text-[13px]">
                  <option value="all">{dict.mapAll}</option>
                  <option value="pothole">Pothole</option>
                  <option value="garbage">Garbage</option>
                  <option value="streetlight">Streetlight</option>
                  <option value="water_leakage">Water Leakage</option>
                  <option value="drainage">Drainage</option>
                  <option value="fallen_tree">Fallen Tree</option>
                  <option value="open_manhole">Open Manhole</option>
                  <option value="public_property">Public Property</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#8B8DA3] uppercase tracking-wider font-semibold mb-1.5 block">{dict.mapPriority}</label>
                <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="form-input !py-2.5 !text-[13px]">
                  <option value="all">{dict.mapAll}</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] text-[#8B8DA3] uppercase tracking-wider font-semibold mb-1.5 block">{dict.mapStatus}</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input !py-2.5 !text-[13px]">
                  <option value="all">{dict.mapAll}</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="work_started">Work Started</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          )}
        </motion.div>

        {/* Map */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card-static !rounded-[18px] overflow-hidden" style={{ height: '500px' }}>
          <MapContainer
            center={[16.3067, 80.4365]}
            zoom={13}
            style={{ height: '100%', width: '100%', borderRadius: '18px' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={L.divIcon({
                  className: '',
                  html: `<div style="width:24px;height:24px;border-radius:50%;background:${priorityColor[report.priority]};border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                })}
              >
                <Popup>
                  <div style={{ minWidth: '200px', fontFamily: 'Inter, sans-serif' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#111129' }}>{report.title}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#5F617A' }}>
                      <span>{report.categoryLabel}</span>
                      <span style={{ color: priorityColor[report.priority], fontWeight: 600 }}>{report.priority.toUpperCase()}</span>
                      <span>{new Date(report.reportedAt).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '12px' }}>
                      <button
                        onClick={() => handleSupport(report.id, report.supports)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '4px',
                          padding: '6px 12px', borderRadius: '10px',
                          background: '#F5F3FF', border: '1px solid #E8E7F0',
                          color: '#6D28D9', cursor: 'pointer', fontSize: '12px', fontWeight: 600
                        }}
                      >
                        👍 {report.supports} {dict.mapSupport}
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            <LocateButton />
          </MapContainer>
        </motion.div>

        {/* Report cards below map */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {filtered.map((report) => (
            <motion.div key={report.id} variants={fadeUp} className="glass-card-static !rounded-[18px] !p-5 hover:!shadow-[0_20px_60px_rgba(109,40,217,0.12)] hover:!-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-[14px] font-semibold text-[#111129] leading-tight flex-1 pr-2">{report.title}</h3>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${priorityBg[report.priority]}`}>
                  {report.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-[12px] text-[#5F617A] mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {report.location}
              </p>
              <p className="text-[12px] text-[#8B8DA3] mb-3">{new Date(report.reportedAt).toLocaleDateString('en-IN')}</p>
              <button
                onClick={() => handleSupport(report.id, report.supports)}
                className="btn-ghost !px-3 !py-1.5 !text-[12px] flex items-center gap-1.5 !text-[#6D28D9] hover:!bg-[#F5F3FF]"
              >
                <ThumbsUp className="w-3 h-3" /> {report.supports} {dict.mapSupportCount}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
