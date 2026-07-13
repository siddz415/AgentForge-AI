import Link from "next/link"
import {
  TrendingUp,
  Megaphone,
  Search,
  Users,
  Headphones,
  Rocket,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AgentConfig } from "@/lib/agents/agent-config"

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

export function AgentCard({ agent }: { agent: AgentConfig }) {
  const Icon = ICONS[agent.icon] ?? TrendingUp

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-3 ${COLOR_MAP[agent.color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle>{agent.name}</CardTitle>
        <CardDescription>{agent.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-6 flex-1">
          {agent.capabilities.map((cap) => (
            <Badge key={cap} variant="secondary">
              {cap}
            </Badge>
          ))}
        </div>
        <Link href={`/agents/${agent.id}`}>
          <Button variant="gradient" className="w-full">
            Deploy Agent
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
