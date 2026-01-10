"use client"

import { useEffect, useState } from "react"

const stats = [
  { value: 12847, label: "Issues Reported", suffix: "" },
  { value: 9234, label: "Issues Resolved", suffix: "" },
  { value: 25691, label: "Active Citizens", suffix: "" },
  { value: 72, label: "Resolution Rate", suffix: "%" },
]

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function ImpactStats() {
  return (
    <section id="impact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Impact</h2>
          <p className="text-lg text-muted-foreground">Making a real difference in communities across India</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-6 text-center shadow-sm border border-border">
              <div className="text-3xl md:text-4xl font-bold text-emerald mb-2">
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
