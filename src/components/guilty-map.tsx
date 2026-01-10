"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Factory, HardHat, Users, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterType = "all" | "industrial" | "construction"

const violations = [
  { id: 1, lat: 28.47, lng: 77.02, type: "industrial", label: "Factory Emission", status: "new", severity: "critical" },
  {
    id: 2,
    lat: 28.48,
    lng: 77.08,
    type: "construction",
    label: "Dust Violation",
    status: "progress",
    severity: "high",
  },
  {
    id: 3,
    lat: 28.45,
    lng: 77.05,
    type: "industrial",
    label: "Illegal Discharge",
    status: "resolved",
    severity: "low",
  },
  { id: 4, lat: 28.46, lng: 77.03, type: "construction", label: "Debris Dumping", status: "new", severity: "medium" },
  {
    id: 5,
    lat: 28.49,
    lng: 77.06,
    type: "industrial",
    label: "Chemical Runoff",
    status: "progress",
    severity: "critical",
  },
]

export function GuiltyMap() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [showBanner, setShowBanner] = useState(false)

  const filteredViolations = violations.filter((v) => filter === "all" || v.type === filter)

  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-severity-critical/30",
          border: "border-severity-critical/60",
          text: "text-severity-critical",
          glow: "shadow-[0_0_12px_rgba(220,38,38,0.5)]",
        }
      case "high":
        return {
          bg: "bg-severity-high/30",
          border: "border-severity-high/60",
          text: "text-severity-high",
          glow: "shadow-[0_0_10px_rgba(234,88,12,0.4)]",
        }
      case "medium":
        return {
          bg: "bg-severity-medium/30",
          border: "border-severity-medium/60",
          text: "text-severity-medium",
          glow: "shadow-[0_0_8px_rgba(202,138,4,0.4)]",
        }
      case "low":
        return {
          bg: "bg-severity-low/30",
          border: "border-severity-low/60",
          text: "text-severity-low",
          glow: "",
        }
      default:
        return {
          bg: "bg-muted/30",
          border: "border-border",
          text: "text-muted-foreground",
          glow: "",
        }
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "NEW"
      case "progress":
        return "IN PROGRESS"
      case "resolved":
        return "RESOLVED"
      default:
        return status.toUpperCase()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg tracking-wider">GUILTY MAP</h2>
          <span className="font-mono text-xs text-neon-red animate-pulse-text">
            {filteredViolations.length} ACTIVE VIOLATIONS
          </span>
        </div>

        <div className="flex gap-2">
          {[
            { id: "all" as const, label: "ALL THREATS", icon: AlertTriangle },
            { id: "industrial" as const, label: "INDUSTRIAL", icon: Factory },
            { id: "construction" as const, label: "CONSTRUCTION", icon: HardHat },
          ].map((f) => {
            const Icon = f.icon
            return (
              <motion.button
                key={f.id}
                onClick={() => setFilter(f.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider border transition-all",
                  filter === f.id
                    ? "bg-neon-red/20 border-neon-red/50 text-neon-red shadow-[0_0_10px_rgba(255,68,68,0.3)]"
                    : "bg-card/30 border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="w-3 h-3" />
                {f.label}
              </motion.button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground">
          <span className="text-foreground">SEVERITY:</span>
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-severity-critical text-severity-critical" />
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-severity-high text-severity-high" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-severity-medium text-severity-medium" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-severity-low text-severity-low" />
            <span>Low</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative m-4 mt-0 rounded-xl overflow-hidden border border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/dark-satellite-map-gurgaon-delhi-india-street-view.jpg')",
            filter: "brightness(0.6) saturate(0.7) contrast(1.1)",
          }}
        />

        {/* Map overlay with markers */}
        <div className="absolute inset-0">
          {filteredViolations.map((violation, index) => {
            const colors = getSeverityColor(violation.severity)
            return (
              <motion.div
                key={violation.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
                className="absolute"
                style={{
                  left: `${15 + index * 18}%`,
                  top: `${25 + (index % 3) * 20}%`,
                }}
              >
                <div className="relative group cursor-pointer">
                  {/* Pulse ring for critical/high severity */}
                  {(violation.severity === "critical" || violation.severity === "high") && (
                    <div className={cn("absolute inset-0 rounded-full animate-ping-ripple", colors.bg)} />
                  )}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2",
                      colors.bg,
                      colors.border,
                      colors.text,
                      colors.glow,
                      violation.severity === "critical" && "animate-pulse-glow",
                    )}
                  >
                    {violation.type === "industrial" ? (
                      <Factory className="w-5 h-5" />
                    ) : (
                      <HardHat className="w-5 h-5" />
                    )}
                  </div>
                  {/* Info tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="bg-background/95 backdrop-blur-sm px-2 py-1.5 rounded border border-border">
                      <p className={cn("font-mono text-[9px] font-bold", colors.text)}>{violation.label}</p>
                      <p className="font-mono text-[8px] text-muted-foreground">{getStatusLabel(violation.status)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={showBanner ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border p-3 flex items-center gap-3">
            <div className="p-2 rounded-full bg-neon-green/20">
              <Users className="w-4 h-4 text-neon-green" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-neon-green tracking-wider">CROWDSOURCE DATA ACTIVE</p>
              <p className="font-mono text-[9px] text-muted-foreground">Verified by 14 users in Cyber City</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
