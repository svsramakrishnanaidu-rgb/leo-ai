import type { Complaint, ComplaintStatus, MapReport } from '../types'

const COMPLAINTS_KEY = 'leo-complaints'
const SUPPORTS_KEY = 'leo-supports'

export function getAllComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(COMPLAINTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveComplaint(complaint: Complaint): void {
  const all = getAllComplaints()
  const existing = all.findIndex(c => c.id === complaint.id)
  if (existing >= 0) {
    all[existing] = complaint
  } else {
    all.unshift(complaint)
  }
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(all))
}

export function getComplaintByTrackingId(id: string): Complaint | null {
  const all = getAllComplaints()
  return all.find(c => c.trackingId === id) || null
}

export function updateComplaintStatus(id: string, status: ComplaintStatus, note?: string): void {
  const all = getAllComplaints()
  const idx = all.findIndex(c => c.trackingId === id)
  if (idx >= 0) {
    all[idx].status = status
    all[idx].updatedAt = new Date().toISOString()
    all[idx].timeline.push({
      status,
      label: status,
      timestamp: new Date().toISOString(),
      note,
    })
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(all))
  }
}

export function deleteComplaint(id: string): void {
  const all = getAllComplaints().filter(c => c.trackingId !== id)
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(all))
}

export function getDemoComplaints(): Complaint[] {
  return [
    {
      id: 'demo-1',
      trackingId: 'LEO-2026-1001',
      title: 'Large pothole on main road near Guntur Municipal Office',
      description: 'A large pothole approximately 2 feet in diameter has developed on the main road near the Guntur Municipal Office. It has been there for over 3 months and has caused several motorcycle accidents. Multiple citizens have reported near-misses.',
      category: 'pothole',
      categoryLabel: 'Pothole',
      department: 'Municipal Engineering Department',
      departmentLabel: 'Municipal Engineering Department',
      priority: 'high',
      status: 'work_started',
      location: 'Near Guntur Municipal Office, Guntur, Andhra Pradesh',
      latitude: 16.3067,
      longitude: 80.4365,
      landmark: 'Near Municipal Office bus stop',
      language: 'en',
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      requestedAction: 'Fill the pothole and resurface the road section',
      supports: 47,
      timeline: [
        { status: 'submitted', label: 'Complaint submitted', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'department_identified', label: 'Municipal Engineering Department identified', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'under_review', label: 'Under review by Road Maintenance Division', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'work_started', label: 'Road repair team dispatched', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Expected completion: 3 working days' },
      ],
    },
    {
      id: 'demo-2',
      trackingId: 'LEO-2026-1002',
      title: 'Garbage not collected for 5 days in Arundalpet area',
      description: 'Garbage has not been collected for the past 5 days in Arundalpet 3rd lane. The bins are overflowing and creating a health hazard. Several families including elderly residents are affected. The garbage is attracting stray animals.',
      category: 'garbage',
      categoryLabel: 'Garbage',
      department: 'Municipal Sanitation Department',
      departmentLabel: 'Municipal Sanitation Department',
      priority: 'high',
      status: 'under_review',
      location: 'Arundalpet 3rd Lane, Guntur, Andhra Pradesh',
      latitude: 16.3017,
      longitude: 80.4415,
      language: 'en',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      requestedAction: 'Immediate garbage collection and regular scheduling',
      supports: 32,
      timeline: [
        { status: 'submitted', label: 'Complaint submitted', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'department_identified', label: 'Municipal Sanitation Department identified', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'under_review', label: 'Ward Sanitary Inspector assigned', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Inspector to visit within 24 hours' },
      ],
    },
    {
      id: 'demo-3',
      trackingId: 'LEO-2026-1003',
      title: 'Broken streetlight on Brodipet main road',
      description: 'The streetlight near Brodipet Signal on the main road has been non-functional for over 2 weeks. The area is completely dark at night making it unsafe for pedestrians and vehicles. Two theft incidents have been reported in this stretch.',
      category: 'streetlight',
      categoryLabel: 'Streetlight',
      department: 'Municipal Electrical Department',
      departmentLabel: 'Municipal Electrical Department',
      priority: 'high',
      status: 'resolved',
      location: 'Brodipet Signal, Brodipet, Guntur, Andhra Pradesh',
      latitude: 16.2995,
      longitude: 80.4387,
      language: 'en',
      submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      requestedAction: 'Replace the faulty streetlight and ensure regular maintenance',
      supports: 58,
      timeline: [
        { status: 'submitted', label: 'Complaint submitted', timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'department_identified', label: 'Municipal Electrical Department identified', timestamp: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'under_review', label: 'Electrical maintenance team notified', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'work_started', label: 'New streetlight installed', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'resolved', label: 'Issue resolved - streetlight working', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
    {
      id: 'demo-4',
      trackingId: 'LEO-2026-1004',
      title: 'Water leakage from pipeline near School Road',
      description: 'A water pipeline has been leaking for over a week near the government school on School Road. Water is pooling on the road creating a hazard for school children. The wastage of treated water is significant.',
      category: 'water_leakage',
      categoryLabel: 'Water Leakage',
      department: 'Water Supply Department',
      departmentLabel: 'Water Supply Department',
      priority: 'critical',
      status: 'department_identified',
      location: 'Near Government School, School Road, Guntur',
      latitude: 16.3050,
      longitude: 80.4300,
      language: 'en',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      requestedAction: 'Urgent pipeline repair to prevent water wastage and road hazard',
      supports: 89,
      timeline: [
        { status: 'submitted', label: 'Complaint submitted', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'department_identified', label: 'Water Supply Department identified', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Priority: CRITICAL - School children safety concern' },
      ],
    },
    {
      id: 'demo-5',
      trackingId: 'LEO-2026-1005',
      title: 'Open manhole near Suryapet main road',
      description: 'The manhole cover near Suryapet main road junction has been missing for several days. It is a major safety hazard especially during evening hours. The hole is about 3 feet deep and could cause serious injuries.',
      category: 'open_manhole',
      categoryLabel: 'Open Manhole',
      department: 'Municipal Engineering Department',
      departmentLabel: 'Municipal Engineering Department',
      priority: 'critical',
      status: 'submitted',
      location: 'Suryapet Main Road Junction, Guntur',
      latitude: 16.2980,
      longitude: 80.4450,
      language: 'en',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      requestedAction: 'Immediate replacement of manhole cover and safety barricading',
      supports: 34,
      timeline: [
        { status: 'submitted', label: 'Complaint submitted', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      ],
    },
  ]
}

export function getDemoMapReports(): MapReport[] {
  return [
    ...getDemoComplaints().map(c => ({
      id: c.id,
      title: c.title,
      category: c.category,
      categoryLabel: c.categoryLabel,
      priority: c.priority,
      status: c.status,
      latitude: c.latitude || 16.3067,
      longitude: c.longitude || 80.4365,
      reportedAt: c.submittedAt,
      supports: c.supports,
      location: c.location,
    })),
    // Add extra sample reports around Guntur
    {
      id: 'map-1',
      title: 'Drainage overflow in(chr)istur Colony',
      category: 'drainage',
      categoryLabel: 'Drainage',
      priority: 'high',
      status: 'under_review',
      latitude: 16.3100,
      longitude: 80.4300,
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      supports: 21,
      location: 'Christur Colony, Guntur',
    },
    {
      id: 'map-2',
      title: 'Fallen tree blocking road at Lakshmipuram',
      category: 'fallen_tree',
      categoryLabel: 'Fallen Tree',
      priority: 'medium',
      status: 'work_started',
      latitude: 16.2950,
      longitude: 80.4420,
      reportedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      supports: 15,
      location: 'Lakshmipuram, Guntur',
    },
    {
      id: 'map-3',
      title: 'Damaged public bench at Municipal Park',
      category: 'public_property',
      categoryLabel: 'Public Property',
      priority: 'low',
      status: 'resolved',
      latitude: 16.3030,
      longitude: 80.4350,
      reportedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      supports: 8,
      location: 'Municipal Park, Guntur',
    },
    {
      id: 'map-4',
      title: 'Garbage dump near Krishna River bank',
      category: 'garbage',
      categoryLabel: 'Garbage',
      priority: 'high',
      status: 'submitted',
      latitude: 16.3150,
      longitude: 80.4480,
      reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      supports: 42,
      location: 'Krishna River Bank, Guntur',
    },
    {
      id: 'map-5',
      title: 'Multiple potholes on NH-16 service road',
      category: 'pothole',
      categoryLabel: 'Pothole',
      priority: 'critical',
      status: 'under_review',
      latitude: 16.2900,
      longitude: 80.4500,
      reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      supports: 103,
      location: 'NH-16 Service Road, Guntur',
    },
  ]
}

export function getSupportCount(reportId: string): number {
  try {
    const raw = localStorage.getItem(SUPPORTS_KEY)
    const supports: Record<string, number> = raw ? JSON.parse(raw) : {}
    return supports[reportId] || 0
  } catch {
    return 0
  }
}

export function addSupport(reportId: string, baseCount: number): number {
  try {
    const raw = localStorage.getItem(SUPPORTS_KEY)
    const supports: Record<string, number> = raw ? JSON.parse(raw) : {}
    supports[reportId] = (supports[reportId] || baseCount) + 1
    localStorage.setItem(SUPPORTS_KEY, JSON.stringify(supports))
    return supports[reportId]
  } catch {
    return baseCount + 1
  }
}
