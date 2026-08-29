/**
 * Leo AI Chatbot Service — powered by Groq API
 * Connects to the same API key used for issue analysis
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''
const GROQ_MODEL = 'openai/gpt-oss-120b'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `You are Leo AI — an intelligent, friendly, and helpful civic assistant chatbot for Indian citizens.

Your purpose:
- Help citizens understand civic issues in their city
- Guide them on how to report problems like potholes, garbage, broken streetlights, water leakage, drainage issues, fallen trees, and open manholes
- Explain which government department handles each type of issue
- Help users draft civic complaints
- Provide information about common civic problems and their solutions
- Guide users on the complaint process and tracking
- Help users understand priority levels and safety concerns

Key departments you know about:
- Municipal Engineering Department → roads, potholes, manholes, footpaths
- Municipal Sanitation Department → garbage, waste, cleanliness
- Municipal Electrical Department → streetlights, power lines
- Water Supply Department → water leakage, water supply issues
- Public Health Engineering Department → drainage, sewage
- Parks and Disaster Response → fallen trees, storm damage
- General Administration → public property damage

Rules:
- Be helpful, friendly, and citizen-focused
- Use simple language anyone can understand
- Never claim to officially submit complaints — Leo AI is an independent prototype
- Always suggest the user visit the Report Issue page for full analysis
- If someone asks about a specific issue, help them understand the category and department
- Respond in the language the user writes in (English, Hindi, or Telugu)
- Keep responses concise and actionable
- Never invent government contacts or phone numbers
- Clearly state that Leo AI is an independent prototype, not a government service
- If you don't know something specific, be honest about it`

export async function chatWithLeo(
  messages: ChatMessage[],
  language: string = 'en'
): Promise<string> {
  // Local fallback responses if API unavailable
  if (!GROQ_API_KEY) {
    return getLocalResponse(messages[messages.length - 1]?.content || '')
  }

  try {
    const langNote = language === 'te' ? 'Respond in Telugu.' : language === 'hi' ? 'Respond in Hindi.' : ''

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + (langNote ? `\n\n${langNote}` : '') },
          ...messages.slice(-20), // Keep last 20 messages for context
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      return getLocalResponse(messages[messages.length - 1]?.content || '')
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    return content || getLocalResponse(messages[messages.length - 1]?.content || '')
  } catch {
    return getLocalResponse(messages[messages.length - 1]?.content || '')
  }
}

function getLocalResponse(input: string): string {
  const lower = input.toLowerCase()

  if (/pothole|road|damaged road|गड्ढा|గోతి/.test(lower)) {
    return "I can help with pothole reports! 🕳️\n\nPotholes fall under the **Municipal Engineering Department**. To report one:\n\n1. Go to **Report Issue** page\n2. Describe the pothole (size, exact location)\n3. Add a photo if possible\n4. Leo AI will classify it and generate a formal complaint\n\nWould you like me to take you to the Report page?"
  }

  if (/garbage|waste|trash|कचरा|చెత్త/.test(lower)) {
    return "Garbage and waste issues are handled by the **Municipal Sanitation Department**. 🗑️\n\nCommon issues they handle:\n- Uncollected garbage\n- Overflowing bins\n- Open dumping\n- Street cleanliness\n\nHead to **Report Issue** to create a complaint, and Leo AI will route it to the right department!"
  }

  if (/light|streetlight|lamp|लाइट|దీపం/.test(lower)) {
    return "Broken streetlights are handled by the **Municipal Electrical Department**. 💡\n\nThis is important for public safety! Dark streets can lead to accidents and security issues.\n\nVisit **Report Issue** to report a broken streetlight. Include the exact pole number or location if you know it."
  }

  if (/water|leak|pipe|पानी|నీరు/.test(lower)) {
    return "Water-related issues are handled by the **Water Supply Department**. 💧\n\nThey handle:\n- Pipeline leaks\n- Water supply disruption\n- Burst pipes\n- Water contamination\n\nUse **Report Issue** to create a detailed complaint with location details."
  }

  if (/drain|sewage|overflow|नाली|డ్రైనేజీ/.test(lower)) {
    return "Drainage and sewage issues go to the **Public Health Engineering Department**. 🚰\n\nThese are important for public health! If you notice:\n- Blocked drains\n- Sewage overflow\n- Waterlogging\n\nPlease report through **Report Issue** with photos if possible."
  }

  if (/track|status|follow|track/.test(lower)) {
    return "You can track your complaint on the **Track Complaint** page! 📍\n\nJust enter your tracking ID (format: LEO-2026-XXXX) to see:\n- Current status\n- Timeline of updates\n- Department assigned\n- Next steps\n\nTry the demo ID: **LEO-2026-1001**"
  }

  if (/hello|hi|hey|नमस्ते|హలో/.test(lower)) {
    return "Hello! 👋 I'm Leo AI, your civic assistant.\n\nI can help you with:\n- 🔍 Understanding civic issues\n- 🏛️ Finding the right department\n- 📝 Drafting complaints\n- 📍 Tracking complaints\n- ⚠️ Safety guidance\n\nWhat civic issue can I help you with today?"
  }

  if (/department|which|where|who|कौन|ఏ శాఖ/.test(lower)) {
    return "Here are the main civic departments in India:\n\n🛣️ **Municipal Engineering** — Roads, potholes, manholes, footpaths\n🗑️ **Sanitation** — Garbage, waste, street cleanliness\n💡 **Electrical** — Streetlights, power lines\n💧 **Water Supply** — Leaks, supply issues\n🚰 **Public Health Eng.** — Drains, sewage\n🌳 **Parks & Disaster** — Fallen trees, storm damage\n🏛️ **General Admin** — Public property damage\n\nWhich type of issue do you need help with?"
  }

  if (/thank|thanks|धन्यवाद|ధన్యవాదాలు/.test(lower)) {
    return "You're welcome! 😊 I'm here to help anytime. If you have more civic issues to report or questions, just ask. Together we can make our cities better! 🏙️"
  }

  return "I'm here to help with civic issues! I can assist with:\n\n- 🕳️ Potholes & road damage\n- 🗑️ Garbage & sanitation\n- 💡 Streetlight problems\n- 💧 Water leakage\n- 🚰 Drainage issues\n- 🌳 Fallen trees\n- 📍 Complaint tracking\n- 📝 Drafting complaints\n\nJust describe your issue and I'll guide you to the right solution! You can also go to **Report Issue** for full AI-powered analysis."
}
