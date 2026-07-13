import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.25), transparent 40%), radial-gradient(circle at 50% 80%, rgba(59,130,246,0.2), transparent 40%)",
        }}
      />
      <div className="container py-24 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Now with autonomous multi-step execution
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance max-w-4xl animate-fade-in">
          Your <span className="gradient-text">AI Workforce</span> in Minutes
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-balance animate-fade-in">
          Deploy autonomous AI agents for sales, marketing, research, recruiting, support,
          and startup strategy — no engineering required. AgentForge AI does the work while you focus on growth.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
          <Link href="/register">
            <Button size="lg" variant="gradient" className="text-base px-8">
              Start Building Free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button size="lg" variant="outline" className="text-base px-8">
              See How It Works
            </Button>
          </a>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required · Free plan available · Cancel anytime
        </p>

        <div className="mt-16 w-full max-w-5xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-4 text-xs text-muted-foreground">agentforge.ai/dashboard</span>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-b from-background to-secondary/40">
            {["Sales Agent", "Research Agent", "Marketing Agent"].map((name) => (
              <div key={name} className="rounded-xl border border-border bg-card p-4 text-left shadow-sm">
                <div className="h-2 w-16 rounded-full gradient-bg mb-3" />
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-muted-foreground mt-1">Running · Step 3 of 5</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
