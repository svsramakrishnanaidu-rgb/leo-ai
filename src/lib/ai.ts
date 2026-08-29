import type { AiAnalysis, IssueCategory, Priority } from '../types'

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_MODEL = 'openai/gpt-oss-120b'

const CATEGORY_DEPARTMENTS: Record<IssueCategory, string> = {
  pothole: 'Municipal Engineering Department',
  garbage: 'Municipal Sanitation Department',
  streetlight: 'Municipal Electrical Department',
  water_leakage: 'Water Supply Department',
  drainage: 'Public Health Engineering Department',
  fallen_tree: 'Parks and Disaster Response',
  open_manhole: 'Municipal Engineering Department',
  public_property: 'General Administration',
  other: 'General Administration',
}

const CATEGORY_KEYWORDS: Record<IssueCategory, string[]> = {
  pothole: ['pothole', 'road', 'damaged road', 'road damage', '坑', 'गड्ढा', 'గోతి', 'crack', 'bump', 'road break'],
  garbage: ['garbage', 'waste', 'trash', 'rubbish', 'litter', 'dustbin', 'bin', 'waste collection', 'कचरा', 'చెత్త', 'filth', 'dump'],
  streetlight: ['light', 'streetlight', 'lamp', 'dark', 'no light', 'broken light', 'street lamp', 'lighting', 'लाइट', 'దీపం', '路灯'],
  water_leakage: ['leakage', 'leak', 'pipe', 'water', 'water leak', 'burst pipe', 'पानी', 'నీరు', 'water supply', 'pipe burst'],
  drainage: ['drainage', 'sewage', 'blocked', 'clog', 'drain', 'overflow', 'waterlogging', 'flood', 'नाली', 'డ్రైనేజీ', 'cesspool'],
  fallen_tree: ['tree', 'branch', 'fallen', 'fallen tree', 'storm', 'uprooted', 'ped', 'पेड़', 'చెట్టు'],
  open_manhole: ['manhole', 'open drain', 'open manhole', 'hole', 'cover missing', 'मैनहोల', 'మాన్‌హోల్'],
  public_property: ['public property', 'wall', 'bench', 'fence', 'sign', 'bridge', 'public', 'सार्वजनिक', 'ప్రభుత్వ'],
  other: [],
}

function localClassify(text: string): AiAnalysis {
  const lower = text.toLowerCase()
  let bestCategory: IssueCategory = 'other'
  let bestScore = 0

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [IssueCategory, string[]][]) {
    let score = 0
    for (const kw of keywords) {
      if (lower.includes(kw)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      bestCategory = cat
    }
  }

  const hasEmergency = /fire|gas leak|collapse|electrocution|live wire|accident|injury|emergency|救命/.test(lower)
  const hasHigh = /large|big|major|severe|dangerous|heavy|blocking|overflow|significant|accident|2 bike|damage/.test(lower)

  let priority: Priority = 'medium'
  if (hasEmergency) priority = 'critical'
  else if (hasHigh) priority = 'high'
  else if (bestScore === 0) priority = 'low'

  const categoryLabels: Record<IssueCategory, string> = {
    pothole: 'Pothole',
    garbage: 'Garbage',
    streetlight: 'Streetlight',
    water_leakage: 'Water Leakage',
    drainage: 'Drainage',
    fallen_tree: 'Fallen Tree',
    open_manhole: 'Open Manhole',
    public_property: 'Public Property',
    other: 'Other',
  }

  const dept = CATEGORY_DEPARTMENTS[bestCategory]

  const safetyWarnings: string[] = []
  if (hasEmergency) safetyWarnings.push('⚠️ EMERGENCY: This may require immediate official emergency assistance. Call 100/101/108 if there is immediate danger to life.')
  if (bestCategory === 'open_manhole') safetyWarnings.push('⚠️ Warning: Open manholes pose serious safety risks. Keep children away from the area.')
  if (bestCategory === 'streetlight') safetyWarnings.push('⚠️ Note: Dark streets may increase safety risks. Report during daytime for faster response.')

  return {
    category: bestCategory,
    categoryLabel: categoryLabels[bestCategory],
    department: dept,
    departmentLabel: dept,
    priority,
    explanation: `Based on the keywords in your description, this issue has been classified as "${categoryLabels[bestCategory]}" and routed to the ${dept}. ${
      bestScore > 0 ? 'The classification is based on key terms detected in your description.' : 'For more accurate classification, please provide more specific details.'
    }`,
    safetyWarning: safetyWarnings.length > 0 ? safetyWarnings.join(' ') : undefined,
    requestedAction: `Request the ${dept} to address this ${categoryLabels[bestCategory].toLowerCase()} issue at the reported location.`,
  }
}

async function groqClassify(text: string, language: string): Promise<AiAnalysis | null> {
  if (!GROQ_API_KEY) return null

  try {
    const langName = language === 'te' ? 'Telugu' : language === 'hi' ? 'Hindi' : 'English'

    const systemPrompt = `You are Leo AI, an expert Indian civic-guidance system. Analyze civic issues and provide structured JSON output.

CATEGORIES: pothole, garbage, streetlight, water_leakage, drainage, fallen_tree, open_manhole, public_property, other

DEPARTMENTS (never invent new ones):
- pothole → Municipal Engineering Department
- garbage → Municipal Sanitation Department
- streetlight → Municipal Electrical Department
- water_leakage → Water Supply Department
- drainage → Public Health Engineering Department
- fallen_tree → Parks and Disaster Response
- open_manhole → Municipal Engineering Department
- public_property → General Administration
- other → General Administration

PRIORITIES: critical (life-threatening), high (urgent safety), medium (impaired service), low (minor/maintenance)

RULES:
- Only use facts from the input
- Never invent departments, contacts, or official actions
- If emergency detected (fire, gas, live wire, collapse), set priority to critical and add safety warning
- Respond in ${langName}

Return ONLY valid JSON:
{
  "category": "one of the categories above",
  "categoryLabel": "Human-readable category name",
  "department": "department key from the mapping",
  "departmentLabel": "Full department name",
  "priority": "critical|high|medium|low",
  "explanation": "Why this department was selected (2-3 sentences)",
  "safetyWarning": "Warning text if applicable, or null",
  "requestedAction": "Specific action requested from the department"
}`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\nIssue: "${text}"\n\nRespond with JSON only:` },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) return null

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content
    if (!raw) return null

    const parsed = JSON.parse(raw)

    // Validate the category
    if (!CATEGORY_DEPARTMENTS[parsed.category as IssueCategory]) {
      parsed.category = 'other'
      parsed.department = CATEGORY_DEPARTMENTS.other
      parsed.departmentLabel = 'General Administration'
    }

    return {
      category: parsed.category || 'other',
      categoryLabel: parsed.categoryLabel || parsed.category,
      department: parsed.department || CATEGORY_DEPARTMENTS.other,
      departmentLabel: parsed.departmentLabel || parsed.department,
      priority: parsed.priority || 'medium',
      explanation: parsed.explanation || 'Issue has been classified based on the description provided.',
      safetyWarning: parsed.safetyWarning || undefined,
      requestedAction: parsed.requestedAction || `Request the relevant department to address this issue.`,
    }
  } catch {
    return null
  }
}

export async function analyzeIssue(text: string, language: string = 'en'): Promise<AiAnalysis> {
  // Try Groq API first
  const groqResult = await groqClassify(text, language)
  if (groqResult) return groqResult

  // Fallback to local classification
  return localClassify(text)
}

export async function generateComplaint(data: {
  text: string
  category: string
  department: string
  location: string
  priority: string
  language: string
}): Promise<{ title: string; body: string; requestedAction: string }> {
  if (!GROQ_API_KEY) {
    return {
      title: `${data.category.charAt(0).toUpperCase() + data.category.slice(1).replace('_', ' ')} - ${data.location}`,
      body: `To,\nThe Officer concerned,\n${data.department}\n\nSubject: Complaint regarding ${data.category.replace('_', ' ')}\n\nRespected Sir/Madam,\n\nI wish to bring to your attention the following civic issue:\n\n${data.text}\n\nLocation: ${data.location}\nPriority: ${data.priority.toUpperCase()}\n\nThe above issue requires immediate attention as it affects public safety and convenience. I request you to kindly look into this matter and take necessary action at the earliest.\n\nThank you.\n\nYours faithfully,\n[Your Name]\n[Contact Number]\n\nDate: ${new Date().toLocaleDateString('en-IN')}`,
      requestedAction: `Request the ${data.department} to resolve this ${data.category.replace('_', ' ')} issue.`,
    }
  }

  try {
    const langName = data.language === 'te' ? 'Telugu' : data.language === 'hi' ? 'Hindi' : 'English'

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: `Generate a formal civic complaint in ${langName}.

Issue: "${data.text}"
Category: ${data.category}
Department: ${data.department}
Location: ${data.location}
Priority: ${data.priority}

Write a complete, professional complaint suitable for government submission. Include subject, detailed body, specific demands, and reasonable deadline. Use formal language.

Return JSON: { "title": "short subject", "body": "full complaint text", "requestedAction": "specific action requested" }`,
          },
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) throw new Error('API error')

    const result = await response.json()
    const raw = result.choices?.[0]?.message?.content
    if (!raw) throw new Error('No response')

    const parsed = JSON.parse(raw)
    return {
      title: parsed.title || 'Civic Complaint',
      body: parsed.body || 'Complaint body not available.',
      requestedAction: parsed.requestedAction || `Address the ${data.category} issue.`,
    }
  } catch {
    return {
      title: `${data.category.charAt(0).toUpperCase() + data.category.slice(1).replace('_', ' ')} - ${data.location}`,
      body: `To,\nThe Officer concerned,\n${data.department}\n\nSubject: Complaint regarding ${data.category.replace('_', ' ')}\n\nRespected Sir/Madam,\n\nI wish to bring to your attention the following civic issue:\n\n${data.text}\n\nLocation: ${data.location}\nPriority: ${data.priority.toUpperCase()}\n\nThe above issue requires immediate attention as it affects public safety and convenience. I request you to kindly look into this matter and take necessary action at the earliest.\n\nThank you.\n\nYours faithfully,\n[Your Name]\n[Contact Number]\n\nDate: ${new Date().toLocaleDateString('en-IN')}`,
      requestedAction: `Request the ${data.department} to resolve this ${data.category.replace('_', ' ')} issue.`,
    }
  }
}
