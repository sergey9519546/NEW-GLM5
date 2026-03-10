'use client'

import { useState, useEffect, useCallback } from 'react'
import { W98_ICONS } from '@/lib/icons'

const WEATHER_POLL_MS = 30 * 60 * 1000 // 30 minutes

interface WeatherData {
  temp: string
  desc: string
  icon: string
}

const WEATHER_ICONS: Record<string, string> = {
  Clear: '☀️', Sunny: '☀️',
  'Partly cloudy': '⛅', 'Partly Cloudy': '⛅',
  Cloudy: '☁️', Overcast: '☁️',
  Mist: '🌫️', Fog: '🌫️',
  Rain: '🌧️', 'Light rain': '🌧️', 'Heavy rain': '🌧️', 'Light drizzle': '🌧️',
  Thunderstorm: '⛈️', 'Thundery outbreaks possible': '⛈️',
  Snow: '❄️', 'Light snow': '❄️', 'Heavy snow': '❄️', Blizzard: '❄️',
}

function weatherIcon(desc: string): string {
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (desc.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '🌤️'
}

export function SystemTray() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherTooltip, setWeatherTooltip] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch('https://wttr.in/?format=j1', {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) return
      const data = await res.json()
      const current = data?.current_condition?.[0]
      if (!current) return
      const desc = current.weatherDesc?.[0]?.value ?? 'Unknown'
      setWeather({
        temp: `${current.temp_F}°F`,
        desc,
        icon: weatherIcon(desc),
      })
    } catch {
      // Silently fail — weather is a nicety
    }
  }, [])

  useEffect(() => {
    void fetchWeather()
    const interval = setInterval(() => void fetchWeather(), WEATHER_POLL_MS)
    return () => clearInterval(interval)
  }, [fetchWeather])

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

  return (
    <div className="system-tray">
      <div className="system-tray-icons">
        {weather && (
          <div
            className="tray-weather"
            onMouseEnter={() => setWeatherTooltip(true)}
            onMouseLeave={() => setWeatherTooltip(false)}
          >
            <span className="tray-weather-icon">{weather.icon}</span>
            <span className="tray-weather-temp">{weather.temp}</span>
            {weatherTooltip && (
              <div className="tray-weather-tooltip">{weather.desc}</div>
            )}
          </div>
        )}
        <img src={W98_ICONS.volume} alt="Volume" className="tray-icon" />
      </div>
      <div
        className="system-clock"
        aria-live="off"
        aria-label={`Current time: ${formatTime(currentTime)}`}
      >
        {formatTime(currentTime)}
      </div>
    </div>
  )
}
