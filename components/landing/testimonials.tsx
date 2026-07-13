import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    title: "Head of Growth, Lumen SaaS",
    quote:
      "AgentForge's Sales Agent found and enriched 40 qualified leads in the time it used to take our team a full day. The outreach emails were genuinely good.",
    initials: "PS",
  },
  {
    name: "Marcus Webb",
    title: "Founder, Northbeam Analytics",
    quote:
      "We used the Startup Advisor agent to sanity-check our go-to-market plan before a fundraise. It surfaced competitive risks we hadn't considered.",
    initials: "MW",
  },
  {
    name: "Elena Torres",
    title: "VP Marketing, Fintra",
    quote:
      "Our content calendar used to take a full afternoon to plan. Now the Marketing Agent drafts it, along with social posts, in minutes.",
    initials: "ET",
  },
]

export function Testimonials() {
  return (
    <section className="bg-secondary/40 py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by fast-moving teams</h2>
          <p className="mt-4 text-muted-foreground text-lg">
            See how teams are using AgentForge AI to move faster with fewer people.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{t.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
