import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const task = await prisma.task.findUnique({ where: { id: params.taskId } })

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  return NextResponse.json({
    id: task.id,
    agentType: task.agentType,
    goal: task.goal,
    status: task.status,
    progress: task.progress,
    result: task.result ? JSON.parse(task.result) : null,
    steps: task.steps ? JSON.parse(task.steps) : [],
    error: task.error,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
  })
}
