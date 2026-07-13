export interface AgentConfig {
  id: string
  name: string
  icon: string
  description: string
  capabilities: string[]
  color: string
  exampleGoal: string
}

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  sales: {
    id: "sales",
    name: "Sales Agent",
    icon: "TrendingUp",
    description:
      "Finds qualified leads, enriches contact data, writes personalized outreach, and exports to CRM",
    capabilities: ["Lead Discovery", "Contact Enrichment", "Email Outreach", "CRM Export"],
    color: "blue",
    exampleGoal: "Find 10 B2B SaaS companies in New York looking to scale their sales team",
  },
  marketing: {
    id: "marketing",
    name: "Marketing Agent",
    icon: "Megaphone",
    description:
      "Creates content calendars, social media campaigns, blog drafts, and performance recommendations",
    capabilities: ["Content Calendar", "Social Media", "Blog Writing", "Campaign Strategy"],
    color: "purple",
    exampleGoal: "Create a 30-day content marketing strategy for a B2B fintech startup",
  },
  research: {
    id: "research",
    name: "Research Agent",
    icon: "Search",
    description:
      "Gathers information from multiple sources and generates comprehensive executive reports",
    capabilities: ["Multi-source Research", "Competitive Analysis", "Market Intelligence", "Executive Reports"],
    color: "green",
    exampleGoal: "Research the AI coding assistant market - competitors, market size, trends",
  },
  recruiting: {
    id: "recruiting",
    name: "Recruiting Agent",
    icon: "Users",
    description:
      "Sources candidates, evaluates resumes, and prepares interview summaries and questions",
    capabilities: ["Candidate Sourcing", "Resume Evaluation", "Interview Prep", "Talent Pipeline"],
    color: "orange",
    exampleGoal: "Find senior React engineers with 5+ years experience for a Series B startup",
  },
  "customer-support": {
    id: "customer-support",
    name: "Customer Support Agent",
    icon: "Headphones",
    description:
      "Handles support requests, researches solutions, and creates resolution templates",
    capabilities: ["Issue Resolution", "Knowledge Base", "Response Templates", "FAQ Generation"],
    color: "red",
    exampleGoal: "Create support documentation and response templates for a SaaS billing FAQ",
  },
  "startup-advisor": {
    id: "startup-advisor",
    name: "Startup Advisor Agent",
    icon: "Rocket",
    description:
      "Analyzes business ideas, researches market opportunities, and creates actionable roadmaps",
    capabilities: ["Market Analysis", "Business Model", "Competitive Intel", "Growth Roadmap"],
    color: "yellow",
    exampleGoal: "Analyze market opportunity and create a go-to-market strategy for an AI HR tool",
  },
}

export type AgentType = keyof typeof AGENT_CONFIGS
