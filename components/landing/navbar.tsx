"use client"

import Link from "next/link"
import { useState } from "react"
import { Bot, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg text-white">
            <Bot className="h-5 w-5" />
          </span>
          AgentForge AI
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button variant="gradient">Get Started</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="block text-sm font-medium" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="gradient" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
