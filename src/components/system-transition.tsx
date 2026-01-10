"use client"

import { useEffect, useState } from "react"

export function SystemTransition() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Scan line effect */}
      <div className="scan-line" />

      {/* Central content */}
      <div className="text-center space-y-6">
        {/* System logo */}
        <div className={`transition-all duration-500 ${phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <div className="w-20 h-20 mx-auto rounded-full border-2 border-emerald-500 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Status text */}
        <div className={`transition-all duration-500 delay-200 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}>
          <p className="text-emerald-500 font-mono text-sm tracking-widest uppercase">System Active</p>
        </div>

        {/* Loading bar */}
        <div
          className={`w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto transition-all duration-300 ${phase >= 2 ? "opacity-100" : "opacity-0"}`}
        >
          <div className={`h-full bg-emerald-500 transition-all duration-700 ${phase >= 3 ? "w-full" : "w-0"}`} />
        </div>

        {/* Tactical mode text */}
        <div className={`transition-all duration-500 ${phase >= 3 ? "opacity-100" : "opacity-0"}`}>
          <p className="text-gray-400 font-mono text-xs">Entering Tactical Mode...</p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-500/50" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-500/50" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-500/50" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-500/50" />
    </div>
  )
}
