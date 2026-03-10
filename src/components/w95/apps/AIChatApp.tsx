'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIChatApp() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isThinking) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsThinking(true)
    setError(null)

    try {
      const res = await fetch('/api/zai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.slice(-20).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Error ${res.status}`)
      }

      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || 'No response' }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response')
    } finally {
      setIsThinking(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div className="ai-chat-app">
      <div className="ai-chat-toolbar">
        <span className="ai-chat-title">ZAI Assistant</span>
        <button className="ai-chat-clear-btn" onClick={handleClear}>
          New Chat
        </button>
      </div>

      <div className="ai-chat-messages">
        {messages.length === 0 && (
          <div className="ai-chat-welcome">
            <div className="ai-chat-welcome-title">ZAI Assistant</div>
            <div className="ai-chat-welcome-sub">Ask me anything.</div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`ai-chat-msg ai-chat-msg-${msg.role}`}>
            <div className="ai-chat-msg-label">{msg.role === 'user' ? 'You' : 'ZAI'}</div>
            <div className="ai-chat-msg-content">{msg.content}</div>
          </div>
        ))}
        {isThinking && (
          <div className="ai-chat-msg ai-chat-msg-assistant">
            <div className="ai-chat-msg-label">ZAI</div>
            <div className="ai-chat-msg-content ai-chat-thinking">Thinking...</div>
          </div>
        )}
        {error && <div className="ai-chat-error">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-chat-input-area">
        <input
          className="ai-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void handleSend()
            }
          }}
          placeholder="Ask something..."
          disabled={isThinking}
        />
        <button
          className="ai-chat-send-btn"
          onClick={() => void handleSend()}
          disabled={isThinking || !input.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}
