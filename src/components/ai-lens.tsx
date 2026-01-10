"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, RotateCcw, Upload, FileText, ScanLine, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

type LensState = "capture" | "uploading" | "verified" | "success"

export function AILens() {
  const [state, setState] = useState<LensState>("capture")
  const [progress, setProgress] = useState(0)

  const handleCapture = () => {
    setState("uploading")
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setState("verified"), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const handleUpload = () => {
    // Trigger file input click
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = () => {
      handleCapture()
    }
    input.click()
  }

  const handleContinue = () => {
    setState("success")
  }

  const handleReset = () => {
    setState("capture")
    setProgress(0)
  }

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {state === "capture" && <CaptureView onCapture={handleCapture} onUpload={handleUpload} />}
        {state === "uploading" && <UploadingView progress={progress} onRetake={handleReset} />}
        {state === "verified" && <VerifiedView onContinue={handleContinue} onRetake={handleReset} />}
        {state === "success" && <SuccessView onReset={handleReset} />}
      </AnimatePresence>
    </div>
  )
}

function CaptureView({ onCapture, onUpload }: { onCapture: () => void; onUpload: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      {/* Viewfinder */}
      <div className="flex-1 relative bg-slate-dark m-4 rounded-xl overflow-hidden border border-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/factory-smoke-pollution-industrial.jpg')" }}
        />

        {/* Viewfinder overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-neon-green/50 rounded-lg relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green" />
          </div>
        </div>

        {/* Scanning laser animation */}
        <motion.div
          className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-neon-green to-transparent"
          style={{ boxShadow: "0 0 10px var(--neon-green), 0 0 20px var(--neon-green)" }}
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {/* Computer Vision / AI detection label */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <Activity className="w-3 h-3 text-neon-green animate-pulse" />
            <span className="font-mono text-[10px] text-neon-green">COMPUTER VISION ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 mb-4">
        <p className="font-mono text-xs text-muted-foreground text-center">
          AI-powered image analysis for pollution detection using computer vision
        </p>
      </div>

      {/* Action buttons */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex gap-3 justify-center">
          {/* Upload Image button with pulse animation */}
          <Button
            onClick={onUpload}
            variant="outline"
            className="flex-1 font-mono text-xs tracking-wider border-border text-muted-foreground hover:text-foreground bg-transparent hover:bg-card/50 group"
          >
            <Upload className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            UPLOAD IMAGE
          </Button>

          {/* Scan & Analyze button with activity animation */}
          <Button
            onClick={onCapture}
            className="flex-1 font-mono text-xs tracking-wider bg-neon-green text-background hover:bg-neon-green/90 group"
          >
            <ScanLine className="w-4 h-4 mr-2 group-hover:animate-pulse" />
            SCAN & ANALYZE
          </Button>
        </div>

        {/* Capture button */}
        <div className="flex justify-center">
          <Button
            onClick={onCapture}
            size="lg"
            className="w-16 h-16 rounded-full bg-neon-green/20 border-2 border-neon-green text-neon-green hover:bg-neon-green/30"
          >
            <Camera className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function UploadingView({ progress, onRetake }: { progress: number; onRetake: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      {/* Image preview */}
      <div className="flex-1 relative bg-slate-dark m-4 rounded-xl overflow-hidden border border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/industrial-emission-smoke-pollution.jpg')" }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center p-6">
          <Upload className="w-8 h-8 text-neon-green mb-4 animate-pulse" />
          <p className="font-mono text-sm tracking-wider text-foreground mb-4">UPLOADING TO REGISTRY</p>

          <div className="w-full max-w-xs h-2 bg-slate-medium rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neon-green rounded-full"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 10px var(--neon-green)",
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="font-mono text-2xl text-neon-green mt-4 tabular-nums">{progress}%</p>
        </div>
      </div>

      {/* Retake button */}
      <div className="p-4 flex justify-center">
        <Button
          onClick={onRetake}
          variant="outline"
          className="font-mono tracking-wider border-border text-muted-foreground hover:text-foreground bg-transparent"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          RETAKE
        </Button>
      </div>
    </motion.div>
  )
}

function AnimatedSuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="w-20 h-20 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center mb-6"
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <motion.path
          d="M5 12l5 5L19 7"
          stroke="var(--neon-green)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        />
      </svg>
    </motion.div>
  )
}

function VerifiedView({ onContinue, onRetake }: { onContinue: () => void; onRetake: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-6"
    >
      <AnimatedSuccessCheck />

      <h2 className="font-mono text-lg tracking-wider text-foreground mb-2">VIOLATION LOGGED</h2>
      <p className="font-mono text-xs text-muted-foreground text-center mb-8">
        AI analysis verified. Your report has been dispatched to the Central Pollution Board.
      </p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card/50 border border-neon-green/30 rounded-xl p-4 mb-8 w-full max-w-xs"
      >
        <p className="font-mono text-xs text-muted-foreground mb-1">BOUNTY EARNED</p>
        <p className="font-mono text-3xl animate-gold-shimmer">+100 Credits</p>
      </motion.div>

      <div className="flex gap-3 w-full max-w-xs">
        <Button onClick={onRetake} variant="outline" className="flex-1 font-mono text-xs tracking-wider bg-transparent">
          RETAKE
        </Button>
        <Button
          onClick={onContinue}
          className="flex-1 font-mono text-xs tracking-wider bg-neon-green text-background hover:bg-neon-green/90"
        >
          VIEW REPORT
        </Button>
      </div>
    </motion.div>
  )
}

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col p-6"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-neon-green/20 border-2 border-neon-green flex items-center justify-center mb-6"
        >
          <FileText className="w-8 h-8 text-neon-green" />
        </motion.div>

        <h2 className="font-mono text-sm tracking-wider text-foreground mb-4">AUTO-GENERATED COMPLAINT</h2>

        <div className="bg-card/30 border border-border rounded-xl p-4 w-full">
          <p className="font-mono text-xs text-muted-foreground leading-relaxed">
            &ldquo;Formal report #PF-9921: Industrial particulate emission detected at [Current GPS]. Plume density
            exceeds legal threshold of 20% opacity...&rdquo;
          </p>
        </div>

        <p className="font-mono text-[10px] text-muted-foreground mt-6 text-center">
          JOINED BY 1,240 SCOUTS IN YOUR CITY
        </p>
      </div>

      <div className="space-y-3">
        <Button className="w-full font-mono text-xs tracking-wider bg-neon-green text-background hover:bg-neon-green/90">
          TRACK ON GUILTY MAP
        </Button>
        <Button onClick={onReset} variant="outline" className="w-full font-mono text-xs tracking-wider bg-transparent">
          BACK TO DASHBOARD
        </Button>
      </div>
    </motion.div>
  )
}
