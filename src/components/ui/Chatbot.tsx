import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Bot, User } from 'lucide-react'
import { chatWithLeo, type ChatMessage } from '../../lib/chatbot'
import { getLanguage } from '../../lib/i18n'

interface ChatMessageUI {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const INITIAL_MESSAGES: ChatMessageUI[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: "Hello! 👋 I'm **Leo AI**, your civic assistant.\n\nI can help you with:\n• Understanding civic issues\n• Finding the right department\n• Drafting complaints\n• Tracking complaints\n\nWhat civic issue can I help you with?",
    timestamp: new Date(),
  },
]

const QUICK_QUESTIONS = [
  "Report a pothole",
  "Broken streetlight",
  "Track my complaint",
  "Which department?",
  "Garbage not collected",
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessageUI[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: ChatMessageUI = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    const chatHistory: ChatMessage[] = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }))

    try {
      const response = await chatWithLeo(chatHistory, getLanguage())
      const assistantMsg: ChatMessageUI = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      const errorMsg: ChatMessageUI = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment, or head to the **Report Issue** page for full AI-powered analysis! 🔄",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all"
        style={{
          background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)',
          boxShadow: '0 8px 32px rgba(109, 40, 217, 0.35)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open Leo AI chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)' }} />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] flex flex-col overflow-hidden"
            style={{
              borderRadius: '20px',
              border: '1px solid #E8E7F0',
              boxShadow: '0 20px 60px rgba(109, 40, 217, 0.15), 0 8px 24px rgba(0,0,0,0.08)',
              background: 'white',
              height: '520px',
              maxHeight: 'calc(100vh - 140px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8E7F0]" style={{ background: 'linear-gradient(135deg, #6D28D9, #8B5CF6)' }}>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-white" style={{ fontFamily: 'Manrope' }}>Leo AI</h3>
                <p className="text-[11px] text-white/70">Civic Assistant • Online</p>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ background: '#FAFAFF' }}>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 text-[13px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#6D28D9] text-white rounded-[16px] rounded-br-[4px]'
                        : 'bg-white text-[#111129] rounded-[16px] rounded-bl-[4px] border border-[#E8E7F0]'
                    }`}
                    style={{ fontFamily: 'Inter' }}
                  >
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-[#F5F3FF] border border-[#E8E7F0] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-[#6D28D9]" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-white rounded-[16px] rounded-bl-[4px] border border-[#E8E7F0] px-4 py-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5" style={{ background: '#FAFAFF' }}>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-white border border-[#E8E7F0] text-[#6D28D9] hover:bg-[#F5F3FF] hover:border-[#C4B5FD] transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#E8E7F0] bg-white">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Leo AI anything..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-[13px] bg-[#FAFAFF] border border-[#E8E7F0] outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/10 transition-all"
                  style={{ fontFamily: 'Inter' }}
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
                  style={{
                    background: input.trim() ? 'linear-gradient(135deg, #6D28D9, #8B5CF6)' : '#F0EFF5',
                  }}
                >
                  <Send className="w-4 h-4" style={{ color: input.trim() ? 'white' : '#8B8DA3' }} />
                </button>
              </div>
              <p className="text-[10px] text-[#8B8DA3] mt-1.5 text-center">
                Leo AI is an independent prototype • Not affiliated with any government
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#F5F3FF;padding:1px 4px;border-radius:4px;font-size:12px;color:#6D28D9">$1</code>')
}
