import { useState, useEffect } from "react"
import { LandingPage } from "@/components/landing/landing-page"
import { TacticalApp } from "@/components/tactical/tactical-app"
import { SystemTransition } from "@/components/system-transition"

export type AppMode = "portal" | "tactical" | "transitioning"
export type TacticalTab = "pulse" | "ai-lens" | "pollution-tracker" | "wallet"

export default function CivicSenseApp() {
  const [mode, setMode] = useState<AppMode>("portal")
  const [initialTab, setInitialTab] = useState<TacticalTab>("pulse")

  const handleEnterTactical = (tab: TacticalTab = "ai-lens") => {
    setInitialTab(tab)
    setMode("transitioning")
  }

  const handleExitTactical = () => {
    document.documentElement.classList.remove("dark")
    setMode("portal")
  }

  useEffect(() => {
    if (mode === "transitioning") {
      const timer = setTimeout(() => {
        document.documentElement.classList.add("dark")
        setMode("tactical")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [mode])

  if (mode === "transitioning") {
    return <SystemTransition />
  }

  if (mode === "tactical") {
    return <TacticalApp initialTab={initialTab} onExit={handleExitTactical} />
  }

  return <LandingPage onEnterTactical={handleEnterTactical} />
}
