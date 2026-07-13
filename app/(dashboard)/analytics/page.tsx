"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AGENT_CONFIGS } from "@/lib/agents/agent-config"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface Task {
  id: string
  agentType: string
  status: string
  createdAt: string
}

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#22c55e", "#f97316", "#ef4444", "#eab308"]

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tasks")
      if (res.ok) setTasks(await res.json())
      setLoading(false)
    }
    load()
  }, [])

  const agentUsage = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach((t) => {
      counts[t.agentType] = (counts[t.agentType] || 0) + 1
    })
    return Object.entries(counts).map(([agentType, count]) => ({
      name: AGENT_CONFIGS[agentType]?.name ?? agentType,
      count,
    }))
  }, [tasks])

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = { completed: 0, running: 0, failed: 0, pending: 0 }
    tasks.forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1
    })
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([status, value]) => ({ name: status, value }))
  }, [tasks])

  const successRate = tasks.length
    ? Math.round((tasks.filter((t) => t.status === "completed").length / tasks.length) * 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track how your AI workforce is performing over time.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Executions</p>
            <p className="text-3xl font-bold mt-2">{tasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-3xl font-bold mt-2">{successRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Agents in Use</p>
            <p className="text-3xl font-bold mt-2">{agentUsage.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Executions by Agent</CardTitle>
            <CardDescription>Which agents are used most often</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentUsage}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} fontSize={12} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Breakdown</CardTitle>
            <CardDescription>Distribution of task outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : statusBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">No data yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                      {statusBreakdown.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
