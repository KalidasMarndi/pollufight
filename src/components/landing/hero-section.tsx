"use client"

import { Button } from "@/components/ui/button"
import { Camera, Map } from "lucide-react"
import type { TacticalTab } from "@/App"

interface HeroSectionProps {
  onEnterTactical: (tab?: TacticalTab) => void
}

export function HeroSection({ onEnterTactical }: HeroSectionProps) {
  return (
    <section className="relative py-24 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-slate-dark" />

        {/* Animated globe wireframe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
          <div className="absolute inset-0 rounded-full border border-cyan-accent/30 animate-globe-rotate" />
          <div
            className="absolute inset-8 rounded-full border border-emerald/20 animate-globe-rotate"
            style={{ animationDirection: "reverse", animationDuration: "45s" }}
          />
          <div
            className="absolute inset-16 rounded-full border border-cyan-accent/15 animate-globe-rotate"
            style={{ animationDuration: "75s" }}
          />
          {/* Latitude lines */}
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
          {/* Longitude lines */}
          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-accent/30 to-transparent" />
          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-accent/30 to-transparent" />
        </div>

        {/* Floating particles */}
        <div className="absolute top-20 left-[20%] w-2 h-2 rounded-full bg-emerald/40 animate-float-particles" />
        <div
          className="absolute top-40 right-[25%] w-1.5 h-1.5 rounded-full bg-cyan-accent/50 animate-float-particles"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-[30%] w-1 h-1 rounded-full bg-emerald/30 animate-float-particles"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-60 right-[15%] w-2 h-2 rounded-full bg-cyan-accent/40 animate-float-particles"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute bottom-48 right-[35%] w-1.5 h-1.5 rounded-full bg-emerald/50 animate-float-particles"
          style={{ animationDelay: "4s" }}
        />

        {/* Pulse rings emanating from center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 rounded-full border border-emerald/20 animate-pulse-ring" />
          <div
            className="absolute inset-0 w-64 h-64 rounded-full border border-cyan-accent/15 animate-pulse-ring"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute inset-0 w-64 h-64 rounded-full border border-emerald/10 animate-pulse-ring"
            style={{ animationDelay: "2s" }}
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Wide, typography-heavy centered layout */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <p className="text-emerald font-semibold text-lg tracking-wide">AI-Powered Pollution Accountability</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight text-balance">
              Every Violation Visible.
              <br />
              <span className="text-emerald">Every Polluter Accountable.</span>
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-medium text-balance">
              Citizen-driven AI surveillance for cleaner air and water.
            </h2>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Report illegal factory discharges, vehicle emissions, and construction dust with just a photo. Our AI
            verifies violations instantly. Track enforcement until the threat is neutralized.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-emerald hover:bg-emerald/90 text-primary-foreground text-lg px-10 h-14 gap-2"
              onClick={() => onEnterTactical("ai-lens")}
            >
              <Camera className="w-5 h-5" />
              Scan with AI Lens
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 h-14 bg-transparent border-border hover:bg-card gap-2"
              onClick={() => onEnterTactical("guilty-map")}
            >
              <Map className="w-5 h-5" />
              View Guilty Map
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
