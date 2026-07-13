import { type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
  colorClass?: string
}

export function StatsCard({ label, value, icon: Icon, trend, trendUp, colorClass }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            {trend && (
              <p className={cn("mt-1 text-xs font-medium", trendUp ? "text-emerald-600" : "text-muted-foreground")}>
                {trend}
              </p>
            )}
          </div>
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", colorClass ?? "bg-accent text-accent-foreground")}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
