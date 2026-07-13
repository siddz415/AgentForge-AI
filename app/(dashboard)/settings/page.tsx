"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const { data: session } = useSession()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and workspace preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={session?.user?.name ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={session?.user?.email ?? ""} disabled />
          </div>
          <Button variant="gradient">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>Manage your team and workspace settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace">Workspace name</Label>
            <Input id="workspace" defaultValue={`${session?.user?.name ?? "My"}'s Workspace`} />
          </div>
          <Button variant="outline">Update Workspace</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Task completion emails</p>
              <p className="text-xs text-muted-foreground">Get notified when an agent finishes a task</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Weekly summary</p>
              <p className="text-xs text-muted-foreground">A digest of your AI workforce activity</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Connect your own tool provider keys (optional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "OpenAI / Nebius API Key", value: "Not configured" },
            { label: "Tavily API Key", value: "Not configured" },
            { label: "You.com API Key", value: "Not configured" },
            { label: "Nimble API Key", value: "Not configured" },
          ].map((key) => (
            <div key={key.label} className="flex items-center justify-between">
              <p className="text-sm font-medium">{key.label}</p>
              <Badge variant="secondary">{key.value}</Badge>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            AgentForge AI uses intelligent mock data for any tool without a configured API key, so you can explore
            the full platform without setup.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
