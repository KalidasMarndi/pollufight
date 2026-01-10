"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number
  icon: LucideIcon
  variant?: "default" | "warning" | "success"
}

export function StatCard({ label, value, icon: Icon, variant = "default" }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0)

  const ringPercentage = Math.min(100, (value / 20) * 100)
  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference - (circumference * ringPercentage) / 100

  useEffect(() => {
    const duration = 1000
    const steps = 20
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

  const getRingColor = () => {
    if (variant === "warning") return "var(--neon-red)"
    if (variant === "success") return "var(--neon-green)"
    return "var(--neon-green)"
  }

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border bg-card/50 backdrop-blur-sm",
        variant === "warning" && "border-neon-red/30",
        variant === "success" && "border-neon-green/30",
        variant === "default" && "border-border",
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon
          className={cn(
            "w-4 h-4",
            variant === "warning" && "text-neon-red",
            variant === "success" && "text-neon-green",
            variant === "default" && "text-muted-foreground",
          )}
        />
        <svg width="44" height="44" className="transform -rotate-90">
          <circle cx="22" cy="22" r="18" fill="none" stroke="var(--slate-medium)" strokeWidth="3" />
          <motion.circle
            cx="22"
            cy="22"
            r="18"
            fill="none"
            stroke={getRingColor()}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 4px ${getRingColor()})` }}
          />
        </svg>
      </div>
      <p className="font-mono text-3xl font-bold text-foreground tabular-nums">
        {displayValue.toString().padStart(2, "0")}
      </p>
      <p className="font-mono text-[10px] tracking-wider text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
