import { MessageSquare, Cog, Rocket } from "lucide-react"

const STEPS = [
  {
    icon: MessageSquare,
    title: "1. Describe your goal",
    description: "Tell an agent what you need in plain English — find leads, write a campaign, research a market.",
  },
  {
    icon: Cog,
    title: "2. Agent executes autonomously",
    description: "The agent researches, reasons, and takes action across multiple steps — no micromanagement needed.",
  },
  {
    icon: Rocket,
    title: "3. Get results, instantly",
    description: "Review structured, ready-to-use outputs — emails, reports, calendars — and export or ship them.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-secondary/40 py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Go from idea to finished work in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <div key={step.title} className="text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-2xl gradient-bg flex items-center justify-center text-white mb-6 shadow-lg">
                <step.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
