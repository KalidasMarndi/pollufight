"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Factory, HardHat, Users, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { db } from "@/lib/firebase"
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore"

// Fix for Leaflet default icon issues in React
import icon from "leaflet/dist/images/marker-icon.png"
import iconShadow from "leaflet/dist/images/marker-shadow.png"

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

function ResizeMap() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

type FilterType = "all" | "Industrial" | "Construction"

interface PollutionReport {
  id: string
  lat: number
  lng: number
  type: string
  label: string
  status: "detected" | "in progress" | "resolved"
  severity: "critical" | "high" | "medium" | "low"
  site?: string
}

// Hardcoded demo points
const demoViolations: PollutionReport[] = [
  { id: "demo-1", lat: 28.47, lng: 77.02, type: "Industrial", label: "Factory Emission", status: "detected", severity: "critical" },
  { id: "demo-2", lat: 28.48, lng: 77.08, type: "Construction", label: "Dust Violation", status: "in progress", severity: "high" },
  { id: "demo-3", lat: 28.45, lng: 77.05, type: "Industrial", label: "Illegal Discharge", status: "resolved", severity: "low" },
  { id: "demo-4", lat: 28.46, lng: 77.03, type: "Construction", label: "Debris Dumping", status: "detected", severity: "medium" },
  { id: "demo-5", lat: 28.49, lng: 77.06, type: "Industrial", label: "Chemical Runoff", status: "in progress", severity: "critical" },
]

export function GuiltyMap() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [showBanner, setShowBanner] = useState(false)
  const [violations, setViolations] = useState<PollutionReport[]>(demoViolations)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pollution_reports"))
        const fetchedReports: PollutionReport[] = []
        querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
          const data = doc.data()
          if (data.latitude && data.longitude) {
            fetchedReports.push({
              id: doc.id,
              lat: data.latitude,
              lng: data.longitude,
              type: data.type || "Industrial",
              label: data.site || "Reported Site",
              status: (data.status as any) || "detected",
              severity: "high", // Default severity as it's not in the schema provided
            })
          }
        })
        setViolations([...demoViolations, ...fetchedReports])
      } catch (error) {
        console.error("Error fetching pollution reports: ", error)
      }
    }

    fetchReports()

    const timer = setTimeout(() => setShowBanner(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredViolations = violations.filter((v) => filter === "all" || v.type === filter)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return { bg: "bg-severity-critical", text: "text-severity-critical" }
      case "high": return { bg: "bg-severity-high", text: "text-severity-high" }
      case "medium": return { bg: "bg-severity-medium", text: "text-severity-medium" }
      case "low": return { bg: "bg-severity-low", text: "text-severity-low" }
      default: return { bg: "bg-muted", text: "text-muted-foreground" }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "detected": return "bg-neon-red"
      case "in progress": return "bg-neon-yellow" // closest to orange
      case "resolved": return "bg-neon-green"
      default: return "bg-muted"
    }
  }

  const createCustomIcon = (violation: PollutionReport) => {
    const statusColorClass = getStatusColor(violation.status)
    // We can't use Tailwind classes directly in L.divIcon html string easily without pre-processing styles or using inline styles if we want exact tailwind values.
    // However, we can use a class and let standard application CSS handle it, or standard inline styles.
    // Let's use inline styles with mapped colors for simplicity in the HTML string, or relying on global classes if available.
    // Since we need to render Lucide icons, it's tricky inside L.divIcon html string.
    // A common workaround is renderToString or simply using simpler HTML markers.
    // For this implementation, let's use a simple colored div.

    let color = "#ff4444" // detected/red
    if (violation.status === 'in progress') color = "#fbbf24" // orange/yellow
    if (violation.status === 'resolved') color = "#4ade80" // green

    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-lg tracking-wider">POLLUTION TRACKER</h2>
          <span className="font-mono text-xs text-neon-red animate-pulse-text">
            {filteredViolations.length} ACTIVE VIOLATIONS
          </span>
        </div>

        <div className="flex gap-2">
          {[
            { id: "all" as const, label: "ALL THREATS", icon: AlertTriangle },
            { id: "Industrial" as const, label: "INDUSTRIAL", icon: Factory },
            { id: "Construction" as const, label: "CONSTRUCTION", icon: HardHat },
          ].map((f) => {
            const Icon = f.icon
            return (
              <motion.button
                key={f.id}
                onClick={() => setFilter(f.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider border transition-all",
                  filter === f.id
                    ? "bg-neon-red/20 border-neon-red/50 text-neon-red shadow-[0_0_10px_rgba(255,68,68,0.3)]"
                    : "bg-card/30 border-border text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="w-3 h-3" />
                {f.label}
              </motion.button>
            )
          })}
        </div>

        <div className="flex items-center gap-4 text-[9px] font-mono text-muted-foreground">
          <span className="text-foreground">SEVERITY:</span>
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-severity-critical text-severity-critical" />
            <span>Critical</span>
          </div>
          {/* ... keeping legend simple or expanding as needed */}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative m-4 mt-0 rounded-xl overflow-hidden border border-border min-h-[500px]">
        <MapContainer
          center={[28.4595, 77.0266]} // Centered around Gurgaon
          zoom={12}
          style={{ height: "500px", width: "100%" }} // Force pixel height for debugging
        >
          <ResizeMap />
          {/* Dark Matter Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {filteredViolations.map((violation) => (
            <Marker
              key={violation.id}
              position={[violation.lat, violation.lng]}
              icon={createCustomIcon(violation)}
            >
              <Popup className="custom-popup">
                <div className="p-2">
                  <h3 className="font-bold text-sm">{violation.label}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{violation.type}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full text-white capitalize",
                      violation.status === 'detected' ? 'bg-red-500' :
                        violation.status === 'in progress' ? 'bg-orange-500' : 'bg-green-500'
                    )}>
                      {violation.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {violation.severity} severity
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={showBanner ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="absolute bottom-4 left-4 right-4 z-[500]"
        >
          <div className="bg-background/90 backdrop-blur-sm rounded-lg border border-border p-3 flex items-center gap-3">
            <div className="p-2 rounded-full bg-neon-green/20">
              <Users className="w-4 h-4 text-neon-green" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-neon-green tracking-wider">CROWDSOURCE DATA ACTIVE</p>
              <p className="font-mono text-[9px] text-muted-foreground">Verified by 14 users in Cyber City</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

