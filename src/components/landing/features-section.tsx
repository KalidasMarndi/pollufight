"use client"

import { useEffect, useState } from "react"
import { Camera, Users, Map, BarChart3, FileText, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Camera,
    title: "AI-Based Detection",
    description: "Instant identification of vehicle emissions, industrial smoke, and construction dust from images.",
  },
  {
    icon: Users,
    title: "Scout-Driven Reporting",
    description: "Real-time reporting with mandatory GPS and timestamp verification for authentic data.",
  },
  {
    icon: Map,
    title: 'The "Guilty Map"',
    description: "A live public heatmap highlighting hotspots and identifying key pollution sources.",
  },
  {
    icon: BarChart3,
    title: "Ward-Wise Monitoring",
    description: "Dashboards for authorities to track resolution rates by neighborhood.",
  },
  {
    icon: FileText,
    title: "Automated Escalation",
    description: "AI-generated formal technical complaints dispatched directly to environmental boards.",
  },
  {
    icon: Wallet,
    title: "EcoWallet Participation",
    description: "Earn Credits for verified reports to track engagement and incentivize action.",
  },
]

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    // Staggered animation on mount
    features.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index])
      }, 150 * index)
    })
  }, [])

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Jan-Kavach?</h2>
          <p className="text-lg text-muted-foreground">AI-powered environmental enforcement for Indian cities</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "bg-card rounded-2xl p-8 shadow-sm border border-border transition-all duration-500",
                "hover:shadow-lg hover:shadow-emerald/10 hover:border-emerald/30",
                visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              )}
            >
              <div className="w-14 h-14 rounded-xl bg-emerald/10 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-emerald" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
