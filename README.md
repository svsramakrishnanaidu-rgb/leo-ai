# LEO.AI

AI-powered civic issue reporting platform for Indian citizens.

## Features

- 🤖 **Leo AI Chatbot** — AI-powered civic assistant on every page
- 📝 **Smart Complaint Builder** — 3-step wizard with AI analysis
- 🗺️ **Issue Map** — View civic issues on Leaflet/OpenStreetMap
- 📊 **Analytics Dashboard** — Public complaint statistics with Recharts
- 🎤 **Voice Input** — Describe issues by speaking (Web Speech API)
- 📍 **GPS Location** — Auto-detect your location for complaints
- 🌐 **Multilingual** — English, Telugu, Hindi support
- ♿ **Accessible** — WCAG 2.1 AA compliant

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Leaflet + React Leaflet
- Recharts
- Groq API (AI backend)
- Lucide React icons

## Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Groq API key to .env

# Start dev server
npm run dev
```

## Environment Variables

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at https://console.groq.com/

## Build

```bash
npm run build
npm run preview
```

## License

MIT
