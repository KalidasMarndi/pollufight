"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin, Code2, Brain, Layout, Server } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedIcon } from "@/components/animated-icon"

const team = [
  {
    name: "Ujjwal",
    role: "Lead Architect",
    icon: Code2,
    color: "emerald" as const,
    github: "https://github.com/ujjwal-dev23",
    linkedin: "https://www.linkedin.com/in/ujjwal-aa438a358/",
  },
  {
    name: "Aaush",
    role: "AI Engineer",
    icon: Brain,
    color: "cyan" as const,
    github: "#",
    linkedin: "#",
  },
  {
    name: "Kalidas",
    role: "Frontend Lead",
    icon: Layout,
    color: "blue" as const,
    github: "#",
    linkedin: "#",
  },
  {
    name: "Ghanand",
    role: "Full-Stack Developer",
    icon: Server,
    color: "gold" as const,
    github: "#",
    linkedin: "#",
  },
]

export function TeamSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  useEffect(() => {
    team.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index])
      }, 200 * index)
    })
  }, [])

  return (
    <section id="team" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">The Architects</h2>
          <p className="text-lg text-muted-foreground">Meet the team building PolluFight</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {team.map((member, index) => {
            const RoleIcon = member.icon
            return (
              <div
                key={member.name}
                className={cn(
                  "group relative rounded-2xl p-6 transition-all duration-500",
                  "bg-card/50 backdrop-blur-sm border border-border/50",
                  "hover:border-emerald/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
                  visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                )}
              >
                {/* Animated glow border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-emerald/20 via-cyan-accent/40 to-emerald/20 blur-sm" />
                </div>

                <div className="relative flex flex-col items-center text-center">
                  {/* Animated role icon */}
                  <div className="mb-6">
                    <AnimatedIcon icon={RoleIcon} size="xl" color={member.color} animate={true} />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-emerald font-medium mb-4">{member.role}</p>

                  {/* Social links */}
                  <div className="flex gap-3">
                    <a
                      href={member.github}
                      className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 hover:scale-110"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={member.linkedin}
                      className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-300 hover:scale-110"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
