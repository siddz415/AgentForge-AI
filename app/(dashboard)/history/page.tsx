"use client"

import { useEffect, useMemo, useState } from "react"
import { History as HistoryIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AGENT_CONFIGS } from "@/lib/agents/agent-config"
import { formatDate } from "@/lib/utils"

interface Task {
  id: string
  agentType: string
  goal: string
  status: string
  progress: number
  createdAt: string
  completedAt: string | null
  project?: { name: string }
}

export default function HistoryPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [agentFilter, setAgentFilter] = useState<string>("all")

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tasks")
      if (res.ok) setTasks(await res.json())
      setLoading(false)
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (agentFilter !== "all" && t.agentType !== agentFilter) return false
      return true
    })
  }, [tasks, statusFilter, agentFilter])

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Execution History</h1>
        <p className="text-muted-foreground mt-1">A full log of every agent task across your workspace.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="Agent type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            {Object.values(AGENT_CONFIGS).map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks ({filtered.length})</CardTitle>
          <CardDescription>Filtered execution history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <HistoryIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No tasks match these filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Goal</TableHead>
                  <TableHead>Agent</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="max-w-xs truncate font-medium">{task.goal}</TableCell>
                    <TableCell>{AGENT_CONFIGS[task.agentType]?.name ?? task.agentType}</TableCell>
                    <TableCell>{task.project?.name ?? "—"}</TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{task.progress}%</TableCell>
                    <TableCell>{formatDate(task.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
