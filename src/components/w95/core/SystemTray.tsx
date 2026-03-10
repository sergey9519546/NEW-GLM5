'use client'

import { useState, useEffect } from 'react'
import { W98_ICONS } from '@/lib/icons'

export function SystemTray() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="system-tray">
      <div className="system-tray-icons">
        <img src={W98_ICONS.volume} alt="Volume" className="tray-icon" />
      </div>
      <div className="system-clock" aria-live="off" aria-label={`Current time: ${formatTime(currentTime)}`}>
        {formatTime(currentTime)}
      </div>
    </div>
  )
}
