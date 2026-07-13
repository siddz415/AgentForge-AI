import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")
  const status = searchParams.get("status")
  const agentType = searchParams.get("agentType")

  const userId = (session.user as { id: string }).id

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: { workspaceId: true },
  })
  const workspaceIds = memberships.map((m) => m.workspaceId)

  const tasks = await prisma.task.findMany({
    where: {
      ...(projectId ? { projectId } : { project: { workspaceId: { in: workspaceIds } } }),
      ...(status ? { status } : {}),
      ...(agentType ? { agentType } : {}),
    },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(tasks)
}
