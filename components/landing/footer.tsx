import Link from "next/link"
import { Bot } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg text-white">
            <Bot className="h-5 w-5" />
          </span>
          AgentForge AI
        </div>

        <p className="text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} AgentForge AI. Your AI Workforce in Minutes.
        </p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-foreground">
            Pricing
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Log in
          </Link>
        </div>
      </div>
    </footer>
  )
}
