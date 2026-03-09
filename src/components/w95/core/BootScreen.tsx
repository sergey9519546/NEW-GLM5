'use client'

import { useEffect, useState } from 'react'
import { useSystemStore } from '@/store'

export function BootScreen() {
  const { bootPhase, setBootPhase } = useSystemStore()
  const [biosText, setBiosText] = useState<string[]>([])
  const [showProgress, setShowProgress] = useState(false)
  const [progress, setProgress] = useState(0)

  const biosLines = [
    'Award Software, Inc.',
    'PCI/PnP BIOS Extension v1.0A',
    'Copyright (C) 1997 Award Software, Inc.',
    '',
    'ALTI.TUNE BIOS v1.00',
    'CPU: Pentium II 450MHz',
    'Memory Test: 640K OK',
    'Extended Memory: 261120K OK',
    '',
    'Detecting IDE drives...',
    'Primary Master: ALTI.TUNE HD',
    'Primary Slave: None',
    'Secondary Master: CD-ROM 52X',
    '',
    'Boot from Hard Disk...',
  ]

  useEffect(() => {
    if (bootPhase !== 'bios') return

    let lineIndex = 0
    const interval = setInterval(() => {
      if (lineIndex < biosLines.length) {
        setBiosText(prev => [...prev, biosLines[lineIndex]])
        lineIndex++
      } else {
        clearInterval(interval)
        setShowProgress(true)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [bootPhase])

  useEffect(() => {
    if (!showProgress) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setBootPhase('splash')
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [showProgress, setBootPhase])

  useEffect(() => {
    if (bootPhase !== 'splash') return

    const timeout = setTimeout(() => {
      setBootPhase('desktop')
    }, 3000)

    return () => clearTimeout(timeout)
  }, [bootPhase, setBootPhase])

  if (bootPhase === 'desktop') return null

  if (bootPhase === 'bios') {
    return (
      <div className="boot-screen">
        <div className="bios-container">
          {biosText.map((line, index) => (
            <div key={index} className="bios-line">
              {line}
            </div>
          ))}
          {showProgress && (
            <div className="bios-progress">
              <div 
                className="bios-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="boot-screen splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          <img 
            src="/icons/w98/windows.png" 
            alt="Windows 98"
            className="splash-icon"
          />
        </div>
        <div className="splash-title">
          Microsoft<sup>®</sup> Windows 98
        </div>
        <div className="splash-subtitle">
          alti.tune edition
        </div>
        <div className="splash-loading">
          <div className="splash-loading-bar">
            <div className="splash-loading-dots">
              {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                <div 
                  key={i} 
                  className="splash-loading-dot"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
