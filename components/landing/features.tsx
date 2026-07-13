import {
  TrendingUp,
  Megaphone,
  Search,
  Users,
  Headphones,
  Rocket,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AGENT_CONFIGS } from "@/lib/agents/agent-config"

const ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  Megaphone,
  Search,
  Users,
  Headphones,
  Rocket,
}

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  green: "bg-emerald-100 text-emerald-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  yellow: "bg-amber-100 text-amber-600",
}

export function Features() {
  const agents = Object.values(AGENT_CONFIGS)

  return (
    <section id="features" className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Six specialized agents, one platform
        </h2>
        <p className="mt-4 text-muted-foreground text-lg">
          Each agent is purpose-built to handle real business workflows end-to-end — from research to
          execution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const Icon = ICONS[agent.icon] ?? TrendingUp
          return (
            <Card key={agent.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${COLOR_MAP[agent.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle>{agent.name}</CardTitle>
                <CardDescription>{agent.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {agent.capabilities.map((cap) => (
                    <li key={cap} className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
