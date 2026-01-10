import { Camera, Bell, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Camera,
    title: "Snap & Report",
    description:
      "Take a photo of the civic issue you've spotted. Our app automatically detects your location and categorizes the problem type.",
    color: "bg-blue-accent",
  },
  {
    icon: Bell,
    title: "We Verify & Assign",
    description:
      "Your report is verified and automatically routed to the correct municipal department for immediate action.",
    color: "bg-amber-500",
  },
  {
    icon: CheckCircle,
    title: "Track to Resolution",
    description:
      "Get real-time status updates via SMS and app notifications. Track progress from submission to complete resolution.",
    color: "bg-emerald",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and effective. Report civic issues in three easy steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}

              <div className="text-center space-y-4">
                {/* Step number and icon */}
                <div className="relative inline-flex">
                  <div className={`w-24 h-24 rounded-full ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
