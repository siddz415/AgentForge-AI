import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createAgent } from "@/lib/agents/agent-factory"
import { AGENT_CONFIGS } from "@/lib/agents/agent-config"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { agentType, goal, projectId } = await req.json()

    if (!agentType || !goal || !projectId) {
      return NextResponse.json(
        { error: "agentType, goal, and projectId are required" },
        { status: 400 }
      )
    }

    if (!AGENT_CONFIGS[agentType]) {
      return NextResponse.json({ error: "Unknown agent type" }, { status: 400 })
    }

    const project = await prisma.project.findUnique({ where: { id: projectId } })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        agentType,
        goal,
        status: "running",
        progress: 0,
      },
    })

    // Fire-and-forget async execution. The client polls /api/agents/status/[taskId].
    // runAgentTask has its own internal try/catch that marks the task "failed",
    // but this outer catch is a safety net in case something throws outside of it
    // (e.g. an unexpected rejection), so the task never gets stuck in "running".
    runAgentTask(task.id, agentType, goal).catch(async (err) => {
      console.error("Unhandled agent execution error:", err)
      await prisma.task
        .update({
          where: { id: task.id },
          data: {
            status: "failed",
            error: err instanceof Error ? err.message : "Unexpected execution failure — check server logs",
            completedAt: new Date(),
          },
        })
        .catch(() => undefined)
    })

    return NextResponse.json({ taskId: task.id, status: "running" }, { status: 202 })
  } catch (error) {
    console.error("Failed to start agent execution:", error)
    return NextResponse.json({ error: "Failed to start agent execution" }, { status: 500 })
  }
}

async function runAgentTask(taskId: string, agentType: string, goal: string) {
  try {
    const agent = createAgent(agentType, async (progress) => {
      await prisma.task
        .update({
          where: { id: taskId },
          data: { progress, steps: JSON.stringify(agent.steps) },
        })
        .catch((err) => console.error("Failed to persist progress:", err))
    })

    const result = await agent.execute(goal)

    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "completed",
        progress: 100,
        result: JSON.stringify(result),
        steps: JSON.stringify(agent.steps),
        completedAt: new Date(),
      },
    })
  } catch (error) {
    console.error(`Agent task ${taskId} failed:`, error)
    await prisma.task
      .update({
        where: { id: taskId },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
          completedAt: new Date(),
        },
      })
      .catch(() => undefined)
  }
}
