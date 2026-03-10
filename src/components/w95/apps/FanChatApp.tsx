'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface ChatMessage {
  id: string
  username: string
  content: string
  createdAt: string
}

const POLL_INTERVAL = 5000

export function FanChatApp() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [username, setUsername] = useState('Anonymous')
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sinceRef = useRef<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const fetchMessages = useCallback(async () => {
    try {
      const params = new URLSearchParams({ roomId: 'general', limit: '100' })
      if (sinceRef.current) params.set('since', sinceRef.current)

      const res = await fetch(`/api/chat/messages?${params}`)
      if (!res.ok) throw new Error('Failed to fetch messages')

      const data = await res.json()
      const newMessages: ChatMessage[] = data.messages ?? []

      if (newMessages.length > 0) {
        sinceRef.current = data.serverTime
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id))
          const unique = newMessages.filter((m) => !existingIds.has(m.id))
          return unique.length > 0 ? [...prev, ...unique] : prev
        })
        setTimeout(scrollToBottom, 50)
      }

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error')
    } finally {
      setIsLoading(false)
    }
  }, [scrollToBottom])

  useEffect(() => {
    void fetchMessages()
    pollRef.current = setInterval(() => void fetchMessages(), POLL_INTERVAL)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [fetchMessages])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setInput('')
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: 'general', username, content: trimmed }),
      })
      if (!res.ok) throw new Error('Failed to send')

      const msg: ChatMessage = await res.json()
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
      sinceRef.current = new Date().toISOString()
      setTimeout(scrollToBottom, 50)
    } catch {
      setError('Failed to send message')
    }
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-app">
      <div className="chat-toolbar">
        <div className="chat-room-name">Fan Chat — General</div>
        <div className="chat-username-area">
          {isEditingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const trimmed = nameInput.trim().slice(0, 32)
                if (trimmed) setUsername(trimmed)
                setIsEditingName(false)
              }}
            >
              <input
                className="chat-name-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={32}
                autoFocus
                onBlur={() => setIsEditingName(false)}
              />
            </form>
          ) : (
            <button
              className="chat-name-btn"
              onClick={() => {
                setNameInput(username)
                setIsEditingName(true)
              }}
            >
              {username}
            </button>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {isLoading && messages.length === 0 && (
          <div className="chat-status">Loading messages...</div>
        )}
        {error && <div className="chat-status chat-error">{error}</div>}
        {!isLoading && messages.length === 0 && !error && (
          <div className="chat-status">No messages yet. Say something!</div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message">
            <span className="chat-msg-time">{formatTime(msg.createdAt)}</span>
            <span className="chat-msg-user">{msg.username}</span>
            <span className="chat-msg-text">{msg.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void handleSend()
            }
          }}
          placeholder="Type a message..."
          maxLength={500}
        />
        <button className="chat-send-btn" onClick={() => void handleSend()}>
          Send
        </button>
      </div>
    </div>
  )
}
