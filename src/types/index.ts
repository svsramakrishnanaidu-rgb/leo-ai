export type Language = 'en' | 'te' | 'hi'

export type IssueCategory =
  | 'pothole'
  | 'garbage'
  | 'streetlight'
  | 'water_leakage'
  | 'drainage'
  | 'fallen_tree'
  | 'open_manhole'
  | 'public_property'
  | 'other'

export type Priority = 'critical' | 'high' | 'medium' | 'low'

export type ComplaintStatus =
  | 'submitted'
  | 'department_identified'
  | 'under_review'
  | 'work_started'
  | 'resolved'

export interface Complaint {
  id: string
  trackingId: string
  title: string
  description: string
  category: IssueCategory
  categoryLabel: string
  department: string
  departmentLabel: string
  priority: Priority
  status: ComplaintStatus
  location: string
  latitude?: number
  longitude?: number
  landmark?: string
  language: Language
  imageUrl?: string
  submittedAt: string
  updatedAt: string
  requestedAction: string
  citizenName?: string
  supports: number
  timeline: TimelineEvent[]
}

export interface TimelineEvent {
  status: ComplaintStatus
  label: string
  timestamp: string
  note?: string
}

export interface AiAnalysis {
  category: IssueCategory
  categoryLabel: string
  department: string
  departmentLabel: string
  priority: Priority
  explanation: string
  safetyWarning?: string
  requestedAction: string
}

export interface MapReport {
  id: string
  title: string
  category: IssueCategory
  categoryLabel: string
  priority: Priority
  status: ComplaintStatus
  latitude: number
  longitude: number
  reportedAt: string
  supports: number
  location: string
}

export interface DashboardStats {
  total: number
  pending: number
  inProgress: number
  resolved: number
  resolutionRate: number
  byCategory: { name: string; count: number }[]
  byPriority: { name: string; count: number }[]
  recent: Complaint[]
}
