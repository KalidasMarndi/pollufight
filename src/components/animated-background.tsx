"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  opacity: number
  reverse: boolean
}

export function AnimatedBackground() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Generate particles on mount
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 20,
      size: 2 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.3,
      reverse: Math.random() > 0.5,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient atmosphere layer */}
      <div
        className="absolute inset-0 animate-gradient-shift opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, var(--emerald) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, var(--cyan-accent) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, var(--blue-accent) 0%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Data flow lines */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={`flow-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-emerald/20 to-transparent animate-data-flow"
            style={{
              top: `${20 + i * 15}%`,
              left: 0,
              right: 0,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={particle.reverse ? "animate-particle-drift-reverse" : "animate-particle-drift"}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            backgroundColor:
              particle.id % 3 === 0
                ? "var(--emerald)"
                : particle.id % 3 === 1
                  ? "var(--cyan-accent)"
                  : "var(--blue-accent)",
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(var(--foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/80" />
    </div>
  )
}
