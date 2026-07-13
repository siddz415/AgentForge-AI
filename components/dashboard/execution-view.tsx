"use client"

import { CheckCircle2, Circle, Loader2, XCircle, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export interface AgentStepView {
  name: string
  status: "pending" | "running" | "completed" | "failed"
  result?: unknown
}

export interface TaskView {
  id: string
  agentType: string
  goal: string
  status: string
  progress: number
  result: { summary: string; data: Record<string, unknown> } | null
  steps: AgentStepView[]
  error: string | null
}

function StepIcon({ status }: { status: AgentStepView["status"] }) {
  if (status === "completed") return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
  if (status === "running") return <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
  if (status === "failed") return <XCircle className="h-5 w-5 text-red-500" />
  return <Circle className="h-5 w-5 text-muted-foreground" />
}

function humanizeKey(key: string) {
  const spaced = key.replace(/([A-Z])/g, " $1")
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function DataValue({ value }: { value: unknown }) {
  if (value === null || value === undefined) return null

  if (typeof value === "string") {
    return <p className="text-sm whitespace-pre-wrap leading-relaxed">{value}</p>
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return <p className="text-sm">{String(value)}</p>
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <p className="text-sm text-muted-foreground">None</p>

    if (typeof value[0] === "string") {
      return (
        <ul className="space-y-1.5">
          {value.map((item, i) => (
            <li key={i} className="text-sm flex gap-2">
              <span className="text-indigo-500 mt-0.5">•</span>
              <span className="whitespace-pre-wrap">{String(item)}</span>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {value.map((item, i) => (
          <div key={i} className="rounded-lg border border-border p-3 bg-secondary/30">
            <DataValue value={item} />
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === "object") {
    return (
      <div className="space-y-2">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{humanizeKey(k)}</p>
            <DataValue value={v} />
          </div>
        ))}
      </div>
    )
  }

  return null
}

export function ExecutionView({ task }: { task: TaskView }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Execution Progress</CardTitle>
          <Badge
            variant={
              task.status === "completed" ? "success" : task.status === "failed" ? "destructive" : "secondary"
            }
          >
            {task.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} />
          </div>

          <div className="space-y-3">
            {task.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <StepIcon status={step.status} />
                <span
                  className={cn(
                    "text-sm",
                    step.status === "completed" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {task.status === "failed" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Execution failed</AlertTitle>
          <AlertDescription>{task.error ?? "An unknown error occurred."}</AlertDescription>
        </Alert>
      )}

      {task.result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{task.result.summary}</p>
          </CardContent>
        </Card>
      )}

      {task.result &&
        Object.entries(task.result.data).map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-base">{humanizeKey(key)}</CardTitle>
            </CardHeader>
            <CardContent>
              <DataValue value={value} />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
