"use client"

import { useEffect, useState } from "react"
import { Code2, Layers, Zap, Palette, Component, FileCode, Map, Database, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

const techStack = [
  {
    name: "React 19",
    icon: Code2,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  {
    name: "Next.js",
    icon: Layers,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    name: "Framer Motion",
    icon: Zap,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    name: "Tailwind CSS",
    icon: Palette,
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
  },
  {
    name: "shadcn/ui",
    icon: Component,
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-400/10",
  },
  {
    name: "TypeScript",
    icon: FileCode,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  {
    name: "OpenStreetMap",
    icon: Map,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
  },
  {
    name: "Supabase",
    icon: Database,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
]

export function TechStackSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    techStack.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index])
      }, 100 * index)
    })
  }, [])

  return (
    <section id="tech-stack" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cpu className="w-6 h-6 text-emerald" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Technology Stack</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            An AI-driven civic platform built using modern data, mapping, and automation technologies.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {techStack.map((tech, index) => {
            const Icon = tech.icon
            return (
              <div
                key={tech.name}
                className={cn(
                  "group relative rounded-2xl p-6 transition-all duration-500",
                  "bg-card/30 backdrop-blur-sm border border-border/30",
                  "hover:border-emerald/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]",
                  "flex flex-col items-center justify-center text-center",
                  visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                )}
              >
                {/* Icon container with animation */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300",
                    tech.bgColor,
                    "group-hover:scale-110",
                  )}
                >
                  <Icon className={cn("w-6 h-6 transition-all duration-300", tech.color)} />
                </div>

                <h3 className="text-sm font-medium text-foreground">{tech.name}</h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
