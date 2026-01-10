"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedIconProps {
  icon: LucideIcon
  size?: "sm" | "md" | "lg" | "xl"
  color?: "emerald" | "cyan" | "blue" | "gold"
  className?: string
  animate?: boolean
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
}

const iconSizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
}

const colorMap = {
  emerald: {
    bg: "bg-emerald/10",
    border: "border-emerald/30",
    icon: "text-emerald",
    glow: "group-hover:shadow-[0_0_20px_var(--emerald)]",
  },
  cyan: {
    bg: "bg-cyan-accent/10",
    border: "border-cyan-accent/30",
    icon: "text-cyan-accent",
    glow: "group-hover:shadow-[0_0_20px_var(--cyan-accent)]",
  },
  blue: {
    bg: "bg-blue-accent/10",
    border: "border-blue-accent/30",
    icon: "text-blue-accent",
    glow: "group-hover:shadow-[0_0_20px_var(--blue-accent)]",
  },
  gold: {
    bg: "bg-neon-gold/10",
    border: "border-neon-gold/30",
    icon: "text-neon-gold",
    glow: "group-hover:shadow-[0_0_20px_var(--neon-gold)]",
  },
}

export function AnimatedIcon({
  icon: Icon,
  size = "md",
  color = "emerald",
  className,
  animate = true,
}: AnimatedIconProps) {
  const colors = colorMap[color]

  return (
    <div className="group relative">
      {/* Orbiting dot */}
      {animate && (
        <div className="absolute inset-0 animate-orbit" style={{ animationDuration: "8s" }}>
          <div className={cn("w-1.5 h-1.5 rounded-full", colors.icon.replace("text-", "bg-"), "opacity-60")} />
        </div>
      )}

      {/* Main icon container */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl border-2 transition-all duration-500",
          sizeMap[size],
          colors.bg,
          colors.border,
          colors.glow,
          animate && "animate-float",
          "group-hover:scale-110",
          className,
        )}
      >
        <Icon
          className={cn(iconSizeMap[size], colors.icon, "transition-all duration-300", "group-hover:animate-icon-glow")}
        />
      </div>
    </div>
  )
}
