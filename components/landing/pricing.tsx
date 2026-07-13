import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out your first AI agent.",
    features: ["1 active project", "50 agent executions / month", "All 6 agent types", "Community support"],
    cta: "Get Started",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ month",
    description: "For growing teams that need more firepower.",
    features: [
      "Unlimited projects",
      "2,000 agent executions / month",
      "All 6 agent types",
      "Priority execution queue",
      "Advanced analytics",
      "Email support",
    ],
    cta: "Start Free Trial",
    href: "/register",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations that need scale, security, and control.",
    features: [
      "Unlimited everything",
      "Custom agent development",
      "SSO & advanced security",
      "Dedicated account manager",
      "SLA & priority support",
      "On-premise deployment options",
    ],
    cta: "Contact Sales",
    href: "/register",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
        <p className="mt-4 text-muted-foreground text-lg">Start free. Upgrade as your AI workforce grows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col",
              plan.highlighted && "border-2 border-indigo-500 shadow-xl scale-[1.02] relative"
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-bg text-white text-xs font-semibold px-3 py-1">
                Most Popular
              </span>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
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
              <Link href={plan.href} className="mt-6">
                <Button variant={plan.highlighted ? "gradient" : "outline"} className="w-full">
                  {plan.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
