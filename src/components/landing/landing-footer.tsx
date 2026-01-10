import { Activity } from "lucide-react"

export function LandingFooter() {
  const footerLinks = {
    Platform: ["AI Lens", "Guilty Map", "EcoWallet", "Pulse Dashboard"],
    Support: ["Help Center", "FAQ", "Contact Us", "About Us", "Feedback"],
    Legal: ["Privacy Policy", "Terms of Service"],
  }

  return (
    <footer className="bg-slate-900 text-slate-100 py-16 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-white">PolluFight</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered environmental enforcement empowering citizens to create cleaner, better cities.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4 text-white">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-400 hover:text-emerald transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">© 2026 PolluFight. Built for India.</p>
        </div>
      </div>
    </footer>
  )
}
