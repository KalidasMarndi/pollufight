"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, MessageSquare, Lightbulb, TrendingUp, AlertCircle, BarChart3, Fingerprint, RefreshCw, MapPin, Factory } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // Removed unused import
import { analyzeComments, type DashboardReport, DEMO_COMMENTS } from "@/services/policy-service"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"

import { CriticalGauge } from "./critical-gauge"
import { StatCard } from "./stat-card"
import { AlertFeed } from "./alert-feed"

const COLORS = ['#22c55e', '#64748b', '#ef4444']; // green, slate, red

export function PulseDashboard() {
  const [report, setReport] = useState<DashboardReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    try {
      // Use demo comments for now as per plan
      const result = await analyzeComments(DEMO_COMMENTS)
      setReport(result)
    } catch (err) {
      setError(`Failed to connect to Policy Engine: ${err instanceof Error ? err.message : String(err)}`)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto pb-24">
      {/* --- Original Pulse Content --- */}
      <h2 className="text-xl font-bold tracking-tight mb-4">Pollution Monitor</h2>
      {/* Critical Gauge */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
        <CriticalGauge value={78} />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <StatCard label="RADIUS REPORTS" value={12} icon={MapPin} variant="default" />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <StatCard label="ACTIVE SITES" value={4} icon={Factory} variant="warning" />
        </motion.div>
      </div>

      {/* Alert Feed */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <AlertFeed />
      </motion.div>

      {/* --- New Policy Feedback Integration --- */}
      <div className="pt-8 border-t border-border/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Civic Pulse</h1>
            <p className="text-muted-foreground">Real-time AI analysis of community feedback</p>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[140px]"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Run Analysis
              </>
            )}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-2 mb-6"
            >
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          {!report && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 px-4 border-2 border-dashed border-muted rounded-xl bg-muted/20"
            >
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
              <h3 className="text-base font-medium">No Analysis Data</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
                Run the AI analysis to see community sentiment.
              </p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-48 animate-pulse bg-muted/50 border-none" />
              ))}
            </motion.div>
          )}

          {report && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Vibe Check Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="col-span-1 md:col-span-2 border-primary/20 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      The Vibe Check
                    </CardTitle>
                    <CardDescription>Overall community sentiment distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { name: 'Support', value: report.vibe_check.support, fill: COLORS[0] },
                          { name: 'Neutral', value: report.vibe_check.neutral, fill: COLORS[1] },
                          { name: 'Oppose', value: report.vibe_check.oppose, fill: COLORS[2] },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                          cursor={{ fill: 'transparent' }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                          {
                            [0, 1, 2].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index]} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-1 border-primary/20 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Fingerprint className="h-5 w-5 text-purple-500" />
                      Deep Insight
                    </CardTitle>
                    <CardDescription>AI-detected underlying emotion</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
                      <p className="text-lg font-medium text-purple-400 mb-2">{report.deep_sentiment.insight}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{report.deep_sentiment.reasoning}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Theme Map */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Theme Map
                  </CardTitle>
                  <CardDescription>Major thematic pillars identified in feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {report.theme_map.map((theme, idx) => (
                      <div key={idx} className="group">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{theme.theme}</span>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-mono">
                            {theme.mentions} mentions
                          </span>
                        </div>
                        <Progress value={Math.min(theme.mentions * 10, 100)} className="h-1.5 mb-2" />
                        <p className="text-sm text-muted-foreground pl-2 border-l-2 border-border group-hover:border-primary transition-colors">
                          {theme.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Innovation Spotter */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 px-1">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Innovation Spotter
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.innovation_spotter.map((innovation, idx) => (
                    <Card key={idx} className="border-yellow-500/20 bg-yellow-500/5 backdrop-blur-sm hover:bg-yellow-500/10 transition-colors cursor-default">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium text-yellow-500/90">{innovation.idea}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {innovation.context}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
