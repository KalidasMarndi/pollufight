"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface CriticalGaugeProps {
  value: number
}

function OdometerDigit({ digit, color }: { digit: string; color: string }) {
  return (
    <motion.span
      key={digit}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="inline-block"
      style={{ color }}
    >
      {digit}
    </motion.span>
  )
}

export function CriticalGauge({ value }: CriticalGaugeProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const percentage = Math.min(100, Math.max(0, value))
  const strokeDasharray = 283
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

  useEffect(() => {
    const duration = 1500
    const steps = 30
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const getColor = () => {
    if (percentage >= 70) return "var(--neon-red)"
    if (percentage >= 40) return "var(--neon-yellow)"
    return "var(--neon-green)"
  }

  const getStatus = () => {
    if (percentage >= 70) return "CRITICAL"
    if (percentage >= 40) return "WARNING"
    return "NORMAL"
  }

  return (
    <div className="relative flex flex-col items-center">
      <svg width="180" height="180" className="transform -rotate-90">
        {/* Background arc */}
        <circle
          cx="90"
          cy="90"
          r="70"
          fill="none"
          stroke="var(--slate-medium)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDasharray * 0.25}
        />
        {/* Value arc */}
        <motion.circle
          cx="90"
          cy="90"
          r="70"
          fill="none"
          stroke={getColor()}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: strokeDasharray }}
          animate={{ strokeDashoffset: strokeDashoffset + strokeDasharray * 0.25 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="gauge-arc"
          style={{
            filter: `drop-shadow(0 0 12px ${getColor()})`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-mono text-5xl font-bold tabular-nums" style={{ color: getColor() }}>
          {String(displayValue)
            .split("")
            .map((digit, i) => (
              <OdometerDigit key={`${i}-${digit}`} digit={digit} color={getColor()} />
            ))}
        </div>
        <motion.span
          className="font-mono text-xs tracking-widest mt-1"
          style={{ color: getColor(), textShadow: `0 0 10px ${getColor()}` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {getStatus()}
        </motion.span>
      </div>
    </div>
  )
}
