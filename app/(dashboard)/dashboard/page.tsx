"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Sparkles, CheckCircle2, FolderKanban, Zap, ArrowRight } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { AgentCard } from "@/components/dashboard/agent-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AGENT_CONFIGS } from "@/lib/agents/agent-config"
import { formatRelativeTime } from "@/lib/utils"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

interface Task {
  id: string
  agentType: string
  goal: string
  status: string
  progress: number
  createdAt: string
  project?: { name: string }
}

// Rough token-usage estimate for display purposes only (no real token counts
// are tracked yet). Every task (regardless of status) incurs a flat overhead
// for orchestration/tracking, and completed tasks additionally consume the
// full multi-step pipeline's worth of tokens on top of that overhead.
const AVG_TOKENS_PER_COMPLETED_TASK = 850
const AVG_TOKENS_PER_TASK_OVERHEAD = 120

function buildUsageData(tasks: Task[]) {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })

  return days.map((day) => {
    const label = day.toLocaleDateString("en-US", { weekday: "short" })
    const count = tasks.filter((t) => {
      const created = new Date(t.createdAt)
      return created.toDateString() === day.toDateString()
    }).length
    return { day: label, executions: count }
  })
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projectCount, setProjectCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/projects"),
        ])
        if (tasksRes.ok) setTasks(await tasksRes.json())
        if (projectsRes.ok) {
          const projects = await projectsRes.json()
          setProjectCount(projects.length)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const activeAgents = new Set(tasks.filter((t) => t.status === "running").map((t) => t.agentType)).size
  const completedTasks = tasks.filter((t) => t.status === "completed").length
  const tokensEstimate =
    completedTasks * AVG_TOKENS_PER_COMPLETED_TASK + tasks.length * AVG_TOKENS_PER_TASK_OVERHEAD

  const usageData = buildUsageData(tasks)
  const recent = tasks.slice(0, 6)
  const quickStartAgents = Object.values(AGENT_CONFIGS).slice(0, 3)

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back — here&apos;s what your AI workforce has been up to.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Active Agents"
          value={activeAgents}
          icon={Sparkles}
          colorClass="bg-indigo-100 text-indigo-600"
        />
        <StatsCard
          label="Tasks Completed"
          value={completedTasks}
          icon={CheckCircle2}
          colorClass="bg-emerald-100 text-emerald-600"
        />
        <StatsCard
          label="Projects"
          value={projectCount}
          icon={FolderKanban}
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatsCard
          label="Tokens Used (est.)"
          value={tokensEstimate.toLocaleString()}
          icon={Zap}
          colorClass="bg-amber-100 text-amber-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Executions (Last 7 Days)</CardTitle>
          <CardDescription>Number of agent tasks started per day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorExec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="executions" stroke="#6366f1" fill="url(#colorExec)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Quick Start</h2>
          <Link href="/agents">
            <Button variant="ghost" size="sm">
              View all agents
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStartAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
          <CardDescription>The latest agent executions across your projects</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No tasks yet. Deploy your first agent to get started.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {recent.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{task.goal}</p>
                    <p className="text-xs text-muted-foreground">
                      {AGENT_CONFIGS[task.agentType]?.name ?? task.agentType} · {formatRelativeTime(task.createdAt)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      task.status === "completed"
                        ? "success"
                        : task.status === "failed"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {task.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
