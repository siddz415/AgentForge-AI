"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AGENT_CONFIGS } from "@/lib/agents/agent-config"
import { formatRelativeTime } from "@/lib/utils"

interface Task {
  id: string
  agentType: string
  goal: string
  status: string
  progress: number
  createdAt: string
}

interface ProjectDetail {
  id: string
  name: string
  description: string | null
  tasks: Task[]
}

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/projects/${params.id}`)
      if (res.ok) setProject(await res.json())
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24">
        <p className="text-muted-foreground">Project not found.</p>
        <Link href="/projects">
          <Button variant="link">Back to projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to projects
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description || "No description"}</p>
        </div>
        <Link href="/agents">
          <Button variant="gradient">
            <Sparkles className="h-4 w-4" />
            Deploy Agent
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>All agent executions run within this project</CardDescription>
        </CardHeader>
        <CardContent>
          {project.tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No tasks yet in this project. Deploy an agent to get started.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {project.tasks.map((task) => (
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
