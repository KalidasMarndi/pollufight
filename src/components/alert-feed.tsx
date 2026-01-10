"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"

const alerts = [
  {
    id: 1,
    message: "Illegal factory discharge detected in Udyog Vihar...",
    time: "2m ago",
    severity: "high",
  },
  {
    id: 2,
    message: "Vehicle emission violation near Cyber City toll...",
    time: "15m ago",
    severity: "medium",
  },
  {
    id: 3,
    message: "Construction dust exceeds limits at Sector 45...",
    time: "1h ago",
    severity: "low",
  },
]

export function AlertFeed() {
  const [visibleAlerts, setVisibleAlerts] = useState<typeof alerts>([])

  useEffect(() => {
    alerts.forEach((alert, index) => {
      setTimeout(() => {
        setVisibleAlerts((prev) => [...prev, alert])
      }, index * 400)
    })
  }, [])

  return (
    <div className="space-y-3">
      <h3 className="font-mono text-xs tracking-wider text-muted-foreground">RECENT ALERTS</h3>

      <AnimatePresence>
        {visibleAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className={`flex items-start gap-3 p-3 rounded-lg border bg-card/30 backdrop-blur-sm ${
              alert.severity === "high" ? "border-neon-red/50 shadow-[0_0_15px_rgba(255,68,68,0.15)]" : "border-border"
            }`}
          >
            <div
              className={`p-1.5 rounded-full ${
                alert.severity === "high"
                  ? "bg-neon-red/20 text-neon-red animate-pulse-glow"
                  : alert.severity === "medium"
                    ? "bg-neon-yellow/20 text-neon-yellow"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs text-foreground leading-relaxed truncate">
                &ldquo;{alert.message}&rdquo;
              </p>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
