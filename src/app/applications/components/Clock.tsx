'use client'

import { useEffect, useState } from "react"

export default function Clock() {
  const [now, setNow] = useState<string | null>(null)
  const [mode, setMode] = useState<'default' | 'dark' | 'light'>('default')

  // ======================
  // CLOCK LOGIC
  // ======================
  useEffect(() => {
    const formatNow = () => {
      const date = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      )

      const h = String(date.getHours()).padStart(2, "0")
      const m = String(date.getMinutes()).padStart(2, "0")
      const s = String(date.getSeconds()).padStart(2, "0")

      return `${h} : ${m} : ${s}`
    }

    setNow(formatNow())
    const interval = setInterval(() => {
      setNow(formatNow())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // ======================
  // SCROLL DETECTION
  // ======================
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight
      const distanceFromBottom = docHeight - (scrollY + windowHeight)

      // Dekat footer (500px dari bawah)
      if (distanceFromBottom <= 500) {
        setMode('light')
        return
      }

      // Scroll ke bawah 100px
      if (scrollY >= 100) {
        setMode('dark')
        return
      }

      // Default (awal page)
      setMode('default')
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ======================
  // STYLE VARIANT
  // ======================
  const variants = {
    default: {
      bg: 'bg-white/10',
      border: 'border-white/20',
      text: 'text-white/90',
      glow: 'from-blue-400/10 via-purple-400/10 to-pink-400/10',
    },
    dark: {
      bg: 'bg-black/60',
      border: 'border-black/80',
      text: 'text-white',
      glow: 'from-black/30 via-black/30 to-black/30',
    },
    light: {
      bg: 'bg-white/20',
      border: 'border-white/40',
      text: 'text-white',
      glow: 'from-white/30 via-white/30 to-white/30',
    },
  }

  const current = variants[mode]

  return (
    <div
      className="fixed bottom-10 right-10 z-50 pointer-events-auto"
      aria-live="polite"
      aria-label={`Waktu Indonesia: ${now ?? "--:--:--"}`}
      suppressHydrationWarning
    >
      <div
        className={`
          group relative flex items-center gap-3
          rounded-full px-5 py-2.5
          text-xl font-semibold tracking-wide

          ${current.bg}
          ${current.border}
          border backdrop-blur-md

          shadow-[0_8px_32px_rgba(0,0,0,0.35)]
          transition-all duration-500 ease-out

          hover:scale-[1.03]
        `}
      >
        {/* Glow Layer */}
        <div
          className={`
            absolute inset-0 rounded-full
            bg-gradient-to-r ${current.glow}
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            pointer-events-none
          `}
        />

        {/* Time */}
        <span
          className={`
            relative ${current.text}
            transition-colors duration-500
          `}
          suppressHydrationWarning
        >
          {now ?? "--:--:--"}
        </span>
      </div>
    </div>
  )
}
