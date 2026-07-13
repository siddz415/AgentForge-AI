import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers/session-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "AgentForge AI — Your AI Workforce in Minutes",
  description:
    "Deploy autonomous AI agents for sales, marketing, research, recruiting, support, and startup strategy — all in one platform.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
