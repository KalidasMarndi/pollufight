"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Signal } from "lucide-react"

interface TacticalHeaderProps {
  onExit: () => void
}

export function TacticalHeader({ onExit }: TacticalHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Exit button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-2"
          onClick={onExit}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Exit to Portal</span>
        </Button>

        {/* Center - System status */}
        <div className="flex items-center gap-2">
          <Signal className="w-4 h-4 text-neon-green animate-pulse" />
          <span className="font-mono text-xs text-neon-green tracking-wider">POLLUFIGHT ACTIVE</span>
        </div>

        {/* Placeholder for balance */}
        <div className="w-20" />
      </div>
    </header>
  )
}
