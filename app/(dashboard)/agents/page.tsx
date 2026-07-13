import { AgentCard } from "@/components/dashboard/agent-card"
import { AGENT_CONFIGS } from "@/lib/agents/agent-config"

export default function AgentsPage() {
  const agents = Object.values(AGENT_CONFIGS)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Catalog</h1>
        <p className="text-muted-foreground mt-1">
          Choose an agent to deploy for your next task. Each agent works autonomously across multiple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}
