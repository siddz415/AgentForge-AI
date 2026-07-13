import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { slugify } from "@/lib/utils"

async function getOrCreateWorkspace(userId: string, userName?: string | null) {
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId },
    include: { workspace: true },
  })

  if (membership) return membership.workspace

  return prisma.workspace.create({
    data: {
      name: `${userName ?? "My"}'s Workspace`,
      slug: `${slugify(userName ?? "workspace")}-${userId.slice(0, 6)}`,
      ownerId: userId,
      members: { create: { userId, role: "owner" } },
    },
  })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const workspace = await getOrCreateWorkspace(userId, session.user.name)

  const projects = await prisma.project.findMany({
    where: { workspaceId: workspace.id },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = (session.user as { id: string }).id
  const { name, description } = await req.json()

  if (!name) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 })
  }

  const workspace = await getOrCreateWorkspace(userId, session.user.name)

  const project = await prisma.project.create({
    data: { name, description, workspaceId: workspace.id },
  })

  return NextResponse.json(project, { status: 201 })
}
