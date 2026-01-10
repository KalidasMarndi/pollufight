"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUp, Clock, Car, Factory, Banknote, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

const verificationHistory = [
  {
    id: 1,
    type: "Vehicle Emission",
    icon: Car,
    credits: 150,
    time: "2H AGO",
    verified: true,
  },
  {
    id: 2,
    type: "Factory Discharge",
    icon: Factory,
    credits: 200,
    time: "1D AGO",
    verified: true,
  },
  {
    id: 3,
    type: "Construction Dust",
    icon: Factory,
    credits: 100,
    time: "3D AGO",
    verified: true,
  },
]

function AnimatedCheckmark({ delay }: { delay: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-neon-green">
      <motion.path
        d="M5 12l5 5L19 7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
      />
    </svg>
  )
}

export function EcoWallet() {
  const totalCredits = 750
  const [displayCredits, setDisplayCredits] = useState(0)
  const [flashingCard, setFlashingCard] = useState<number | null>(null)

  useEffect(() => {
    const duration = 1500
    const steps = 30
    const increment = totalCredits / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= totalCredits) {
        setDisplayCredits(totalCredits)
        clearInterval(timer)
      } else {
        setDisplayCredits(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setFlashingCard(1)
      setTimeout(() => setFlashingCard(null), 600)
    }, 1000)
  }, [])

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="font-mono text-lg tracking-widest text-foreground">ECOWALLET</h2>
      </motion.div>

      {/* Credits Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 border border-neon-green/30 rounded-xl p-6 text-center"
      >
        <p className="font-mono text-xs text-muted-foreground tracking-wider mb-2">AVAILABLE CREDITS</p>
        <div className="flex items-center justify-center gap-2">
          <p className="font-mono text-5xl font-bold animate-gold-shimmer tabular-nums">{displayCredits}</p>
          <span className="font-mono text-2xl text-neon-gold">Credits</span>
          <ArrowUp className="w-5 h-5 text-neon-green" />
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <motion.div
            className="animate-metallic-sheen"
            animate={{ rotateY: [0, 5, 0, -5, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <Award className="w-5 h-5 text-neon-yellow" style={{ filter: "drop-shadow(0 0 4px var(--neon-yellow))" }} />
          </motion.div>
          <p className="font-mono text-xs text-neon-yellow tracking-wider">ELITE SCOUT TIER</p>
        </div>
      </motion.div>

      {/* Verification History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-mono text-xs tracking-wider text-muted-foreground">VERIFICATION HISTORY</h3>
        </div>

        {verificationHistory.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-xl border bg-card/30 transition-all ${
                flashingCard === item.id ? "border-neon-green shadow-[0_0_15px_3px_var(--neon-green)]" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="font-mono text-sm text-foreground">{item.type}</p>
                  <div className="flex items-center gap-1">
                    <AnimatedCheckmark delay={0.5 + index * 0.2} />
                    <p className="font-mono text-[10px] text-neon-green tracking-wider">VERIFIED {item.time}</p>
                  </div>
                </div>
              </div>
              <p className="font-mono text-lg text-neon-green">+{item.credits}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Redeem Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Button className="w-full font-mono text-xs tracking-wider bg-neon-green text-background hover:bg-neon-green/90 h-12">
          <Banknote className="w-4 h-4 mr-2" />
          REDEEM TO BANK ACCOUNT
        </Button>
      </motion.div>
    </div>
  )
}
