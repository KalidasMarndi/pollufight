"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Bot, User, Sparkles, Map, Camera, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
}

const quickActions = [
  { label: "How does Jan-Kavach work?", icon: Sparkles },
  { label: "What is the Pollution Tracker?", icon: Map },
  { label: "How to report pollution?", icon: Camera },
  { label: "What is EcoWallet?", icon: Wallet },
]

const botResponses: Record<string, string> = {
  "how does jan-kavach work?":
    "Jan-Kavach is a citizen-driven AI platform for pollution accountability. Here's how it works:\n\n1. **Report**: Use AI Lens to photograph pollution violations\n2. **Verify**: Our AI instantly analyzes and verifies the report\n3. **Track**: Monitor enforcement on the Pollution Tracker\n4. **Earn**: Get EcoCredits for verified reports\n\nWould you like to know more about any specific feature?",
  "what is the pollution tracker?":
    "The **Pollution Tracker** is our real-time geospatial visualization of pollution violations across your area.\n\n• **Color-coded severity**: Critical (red), High (orange), Medium (yellow), Low (green)\n• **Filter by type**: Industrial, Construction, or All Threats\n• **Crowdsourced verification**: See reports verified by fellow citizens\n• **Track resolution**: Monitor as violations move from 'New' to 'Resolved'\n\nIt helps you understand pollution hotspots in your community.",
  "how to report pollution?":
    "Reporting pollution is simple with **AI Lens**:\n\n1. Tap 'Scan with AI Lens' from the dashboard\n2. Point your camera at the violation\n3. Our AI automatically detects:\n   - Factory emissions\n   - Construction dust\n   - Vehicle smoke\n   - Illegal dumping\n4. Add optional notes and submit\n5. Receive instant verification and EcoCredits\n\nYour report is geo-tagged and time-stamped automatically!",
  "what is ecowallet?":
    "**EcoWallet** is your reward hub for environmental action:\n\n• **Earn EcoCredits**: Get 5-25 credits per verified report\n• **Scout Tiers**: Progress from Rookie to Elite Scout\n• **Verification History**: Track all your contributions\n• **Redeem Rewards**: Convert credits to real benefits\n\nTop scouts unlock special badges and priority verification status!",
  default:
    "I'm your Jan-Kavach assistant! I can help you understand:\n\n• How to report pollution violations\n• Using the AI Lens scanner\n• Navigating the Pollution Tracker\n• Earning and using EcoCredits\n• Ward-level monitoring\n\nWhat would you like to know?",
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Welcome to Jan-Kavach! I'm your AI assistant. How can I help you fight pollution today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userMessage: string): string => {
    const normalizedMessage = userMessage.toLowerCase().trim()

    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== "default" && normalizedMessage.includes(key.replace("?", ""))) {
        return response
      }
    }

    return botResponses.default
  }

  const handleSend = (message?: string) => {
    const messageText = message || input.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot thinking delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getBotResponse(messageText),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <>
      {/* Floating chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald text-primary-foreground shadow-lg hover:bg-emerald/90 transition-colors flex items-center justify-center group"
          >
            <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-emerald animate-ping opacity-30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Jan-Kavach Assistant</h3>
                  <p className="text-xs text-emerald flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-2", message.type === "user" ? "justify-end" : "justify-start")}
                >
                  {message.type === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-emerald" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[260px] rounded-2xl px-4 py-2.5 text-sm",
                      message.type === "user"
                        ? "bg-emerald text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md",
                    )}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-emerald" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        onClick={() => handleSend(action.label)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border/50"
                      >
                        <Icon className="w-3 h-3" />
                        {action.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about Jan-Kavach..."
                  className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald/50"
                />
                <Button
                  size="icon"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="rounded-full bg-emerald hover:bg-emerald/90 text-primary-foreground disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
