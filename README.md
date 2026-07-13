# AgentForge AI

**Your AI Workforce in Minutes.**

AgentForge AI is a full-stack SaaS platform for deploying autonomous AI agents that handle real
business workflows end-to-end — sales prospecting, marketing content, market research, recruiting,
customer support, and startup strategy.

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui-style components
- **Auth**: NextAuth.js v4 (email/password credentials, optional Google OAuth)
- **Database**: Prisma ORM + SQLite
- **AI/LLM**: OpenAI SDK (also works with a Nebius GPU inference endpoint)
- **Web research**: Tavily, You.com
- **Lead enrichment**: Nimble
- **Charts**: Recharts

All external API integrations gracefully fall back to realistic mock data when no API key is
configured, so the full platform is explorable out of the box with zero setup.

## Getting Started

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in any keys you have. Everything works with mock data
if left blank.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite connection string (defaults to `file:./dev.db`) |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | NextAuth session config |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional Google OAuth sign-in |
| `OPENAI_API_KEY` | OpenAI content generation |
| `NEBIUS_API_KEY` / `NEBIUS_BASE_URL` | Use a Nebius GPU endpoint instead of OpenAI |
| `TAVILY_API_KEY` | Web search for research/sales/marketing agents |
| `YOUCOM_API_KEY` | Additional AI-powered web search |
| `NIMBLE_API_KEY` | Lead/contact enrichment |

## Agents

| Agent | Capabilities |
| --- | --- |
| Sales Agent | Lead discovery, contact enrichment, personalized outreach, CRM export |
| Marketing Agent | Content calendars, social posts, blog outlines, campaign recommendations |
| Research Agent | Multi-source research, synthesis, executive summaries |
| Recruiting Agent | Candidate sourcing, evaluation, interview prep |
| Customer Support Agent | Issue resolution, FAQ generation, response templates |
| Startup Advisor Agent | Market analysis, competitive intel, business model canvas, roadmap |

## Project Structure

```
app/            Next.js App Router pages & API routes
components/     UI, landing, and dashboard components
lib/agents/     Agent implementations and base agent framework
lib/tools/      Tavily, You.com, and Nimble API clients
prisma/         Database schema
```

## License

See [LICENSE](./LICENSE).

## Known Security Note

This project intentionally pins **Next.js 14.2.35** (the latest 14.x release) per the project's
version requirement. Some CVEs affecting the Next.js 14.x line (e.g. SSRF via WebSocket upgrades,
middleware bypass, DoS via Server Components) are only patched in 15.5.16+/16.2.5+. Upgrading past
the 14.x major version is recommended once feasible.

