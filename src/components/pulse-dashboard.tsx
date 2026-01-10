"use client"

import { motion } from "framer-motion"
import { MapPin, Factory } from "lucide-react"
import { CriticalGauge } from "./critical-gauge"
import { StatCard } from "./stat-card"
import { AlertFeed } from "./alert-feed"

export function PulseDashboard() {
  return (
    <div className="p-4 space-y-6">
      {/* Critical Gauge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
        <CriticalGauge value={78} />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <StatCard label="RADIUS REPORTS" value={12} icon={MapPin} variant="default" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <StatCard label="ACTIVE SITES" value={4} icon={Factory} variant="warning" />
        </motion.div>
      </div>

      {/* Alert Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <AlertFeed />
      </motion.div>
    </div>
  )
}
