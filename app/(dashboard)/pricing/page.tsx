import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PLANS } from "@/components/landing/pricing"

export default function DashboardPricingPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Plans & Billing</h1>
        <p className="text-muted-foreground mt-1">You&apos;re currently on the Free plan. Upgrade anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={cn("flex flex-col", plan.highlighted && "border-2 border-indigo-500 relative")}>
            {plan.name === "Free" && (
              <Badge className="absolute -top-3 left-4" variant="secondary">
                Current Plan
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlighted ? "gradient" : "outline"} className="w-full mt-6">
                {plan.name === "Free" ? "Current Plan" : plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
