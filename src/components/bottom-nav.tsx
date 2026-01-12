"use client"

import { Activity, Camera, Map, Wallet } from "lucide-react"
import type { TacticalTab } from "@/App"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  activeTab: TacticalTab
  onTabChange: (tab: TacticalTab) => void
}

const navItems = [
  { id: "pulse" as const, label: "PULSE", icon: Activity },
  { id: "ai-lens" as const, label: "AI LENS", icon: Camera },
  { id: "pollution-tracker" as const, label: "POLLUTION TRACKER", icon: Map },
  { id: "wallet" as const, label: "WALLET", icon: Wallet },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                isActive ? "text-neon-green" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-pulse-glow")} />
              <span className="font-mono text-[10px] tracking-wider">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
