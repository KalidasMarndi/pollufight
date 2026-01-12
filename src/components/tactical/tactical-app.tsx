"use client"

import { useState } from "react"
import type { TacticalTab } from "@/App"
import { PulseDashboard } from "@/components/pulse-dashboard"
import { AILens } from "@/components/ai-lens"
import { GuiltyMap } from "@/components/guilty-map"
import { EcoWallet } from "@/components/eco-wallet"
import { BottomNav } from "@/components/bottom-nav"
import { TacticalHeader } from "./tactical-header"
import { AnimatedBackground } from "@/components/animated-background"

interface TacticalAppProps {
  initialTab: TacticalTab
  onExit: () => void
}

export function TacticalApp({ initialTab, onExit }: TacticalAppProps) {
  const [activeTab, setActiveTab] = useState<TacticalTab>(initialTab)

  return (
    <div className="min-h-screen bg-background flex flex-col animate-system-activate relative">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TacticalHeader onExit={onExit} />

        <main className="flex-1 overflow-auto pb-20">
          {activeTab === "pulse" && <PulseDashboard />}
          {activeTab === "ai-lens" && <AILens />}
          {activeTab === "pollution-tracker" && <GuiltyMap />}
          {activeTab === "wallet" && <EcoWallet />}
        </main>

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  )
}
