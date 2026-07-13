"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  TrendingUp,
  Megaphone,
  Search,
  Users,
  Headphones,
  Rocket,
  ArrowLeft,
  Loader2,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ExecutionView, type TaskView } from "@/components/dashboard/execution-view"
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

interface Project {
  id: string
  name: string
}

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>()
  const { toast } = useToast()

  const agent = AGENT_CONFIGS[params.id as string]

  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState<string>("")
  const [goal, setGoal] = useState(agent?.exampleGoal ?? "")
  const [submitting, setSubmitting] = useState(false)
  const [task, setTask] = useState<TaskView | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    async function loadProjects() {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
        if (data.length > 0) setProjectId(data[0].id)
      }
    }
    loadProjects()
  }, [])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  if (!agent) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <p className="text-muted-foreground">Agent not found.</p>
        <Link href="/agents">
          <Button variant="link">Back to agents</Button>
        </Link>
      </div>
    )
  }

  const Icon = ICONS[agent.icon] ?? TrendingUp

  async function handleExecute() {
    if (!goal.trim()) {
      toast({ title: "Goal is required", description: "Please describe what you'd like the agent to do." })
      return
    }
    if (!projectId) {
      toast({ title: "Project is required", description: "Please select or create a project first." })
      return
    }

    setSubmitting(true)
    setTask(null)

    try {
      const res = await fetch("/api/agents/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentType: agent.id, goal, projectId }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to start agent execution")
      }

      const { taskId } = await res.json()
      pollStatus(taskId)
    } catch (err) {
      toast({
        title: "Execution failed to start",
        description: err instanceof Error ? err.message : "Please try again.",
      })
      setSubmitting(false)
    }
  }

  function pollStatus(taskId: string) {
    const poll = async () => {
      const res = await fetch(`/api/agents/status/${taskId}`)
      if (!res.ok) return
      const data: TaskView = await res.json()
      setTask(data)

      if (data.status === "completed" || data.status === "failed") {
        if (pollRef.current) clearInterval(pollRef.current)
        setSubmitting(false)
      }
    }

    poll()
    pollRef.current = setInterval(poll, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/agents" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to agents
      </Link>

      <div className="flex items-start gap-4">
        <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${COLOR_MAP[agent.color]}`}>
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{agent.name}</h1>
          <p className="text-muted-foreground mt-1">{agent.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {agent.capabilities.map((c) => (
              <Badge key={c} variant="secondary">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Task</CardTitle>
          <CardDescription>Describe your goal and select a project to run this agent against.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal">Goal</Label>
            <Textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              placeholder={agent.exampleGoal}
            />
          </div>

          <div className="space-y-2">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger>
                <SelectValue placeholder={projects.length ? "Select a project" : "No projects yet"} />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {projects.length === 0 && (
              <p className="text-xs text-muted-foreground">
                You don&apos;t have any projects yet.{" "}
                <Link href="/projects" className="underline">
                  Create one
                </Link>{" "}
                to run this agent.
              </p>
            )}
          </div>

          <Button variant="gradient" className="w-full" onClick={handleExecute} disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Running agent..." : "Execute Agent"}
          </Button>
        </CardContent>
      </Card>

      {task && <ExecutionView task={task} />}
    </div>
  )
}
