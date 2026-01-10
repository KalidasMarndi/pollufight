"use client"

import type { TacticalTab } from "@/App"
import { LandingHeader } from "./landing-header"
import { HeroSection } from "./hero-section"
import { ImpactStats } from "./impact-stats"
import { HowItWorks } from "./how-it-works"
import { FeaturesSection } from "./features-section"
import { TestimonialsSection } from "./testimonials-section"
import { TeamSection } from "./team-section"
import { TechStackSection } from "./tech-stack-section"
import { LandingFooter } from "./landing-footer"
import { Chatbot } from "@/components/chatbot"
import { AnimatedBackground } from "@/components/animated-background"

interface LandingPageProps {
  onEnterTactical: (tab?: TacticalTab) => void
}

export function LandingPage({ onEnterTactical }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <LandingHeader onEnterTactical={onEnterTactical} />
        <main>
          <HeroSection onEnterTactical={onEnterTactical} />
          <ImpactStats />
          <HowItWorks />
          <FeaturesSection />
          <TestimonialsSection />
          <TeamSection />
          <TechStackSection />
        </main>
        <LandingFooter />
        <Chatbot />
      </div>
    </div>
  )
}
