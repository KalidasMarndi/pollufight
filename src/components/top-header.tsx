"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"

export function TopHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <motion.div
              className="text-neon-green animate-heartbeat"
              style={{ filter: "drop-shadow(0 0 8px var(--neon-green))" }}
            >
              <Shield className="w-5 h-5" />
            </motion.div>
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full border border-neon-green/50 animate-ping-ripple" />
          </div>
          <span className="font-mono text-xs text-neon-green tracking-wider animate-pulse-text">SYSTEM ACTIVE</span>
        </div>
        <h1 className="font-mono text-lg font-bold tracking-widest text-foreground">POLLUFIGHT</h1>
        <div className="w-16" />
      </div>
    </header>
  )
}
