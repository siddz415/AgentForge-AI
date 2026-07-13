import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const workspace = await prisma.workspace.create({
      data: {
        name: `${name}'s Workspace`,
        slug: `${user.id.slice(0, 8)}-workspace`,
        ownerId: user.id,
        members: {
          create: { userId: user.id, role: "owner" },
        },
      },
    })

    await prisma.project.create({
      data: {
        name: "My First Project",
        description: "A default project to get you started with AgentForge AI.",
        workspaceId: workspace.id,
      },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (error) {
    console.error("Registration failed:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
