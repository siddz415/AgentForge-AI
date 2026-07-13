import { BaseAgent, AgentResult } from "./base-agent"
import { tavilySearch } from "@/lib/tools/tavily"
import { nimbleEnrichLeads, EnrichedLead } from "@/lib/tools/nimble"
import { generateText, hasLLM } from "@/lib/llm"

/**
 * Sales Agent
 * 1. Researches target companies using Tavily
 * 2. Finds qualified leads with Nimble
 * 3. Enriches contact data
 * 4. Writes personalized outreach emails using OpenAI
 * 5. Exports results as structured data (simulated CRM export)
 */
export class SalesAgent extends BaseAgent {
  protected totalSteps() {
    return 5
  }

  async execute(goal: string): Promise<AgentResult> {
    const research = await this.executeStep(
      "Researching target companies",
      () => tavilySearch(`companies matching: ${goal}`, { maxResults: 6 }),
      20
    )

    const companyNames = research.results.slice(0, 5).map((r, i) => {
      const guess = r.title.split(/[-|—:]/)[0].trim()
      return guess.length > 3 && guess.length < 60 ? guess : `Prospect ${i + 1} Inc.`
    })

    const leads = await this.executeStep(
      "Finding qualified leads",
      async () => companyNames,
      35
    )

    const enriched = await this.executeStep(
      "Enriching contact data via Nimble",
      () => nimbleEnrichLeads(leads),
      55
    )

    const emails = await this.executeStep(
      "Writing personalized outreach emails",
      () => this.writeOutreachEmails(goal, enriched),
      80
    )

    const crmExport = await this.executeStep(
      "Exporting leads to CRM",
      async () => this.buildCrmExport(enriched, emails),
      100
    )

    return {
      summary: `Identified ${enriched.length} qualified leads for "${goal}", enriched their contact details, drafted personalized outreach emails, and exported everything in a CRM-ready format.`,
      data: {
        goal,
        researchAnswer: research.answer,
        leads: enriched,
        emails,
        crmExport,
      },
      steps: this.steps,
    }
  }

  private async writeOutreachEmails(goal: string, leads: EnrichedLead[]) {
    const emails = [] as { to: string; subject: string; body: string }[]

    for (const lead of leads) {
      const prompt = `Write a short, highly personalized cold outreach email (max 120 words) to ${lead.name}, ${lead.title} at ${lead.company} (${lead.industry}, ${lead.companySize} employees). The goal of the outreach is: "${goal}". Keep it friendly, specific, and end with a clear call to action to book a 15-minute call. Return only the email body, no subject line.`

      const generated = hasLLM ? await generateText(prompt) : ""

      emails.push({
        to: lead.email,
        subject: `Quick question about ${lead.company}'s growth plans`,
        body:
          generated ||
          `Hi ${lead.name.split(" ")[0]},\n\nI noticed ${lead.company} has been growing fast in the ${lead.industry} space. Given your role as ${lead.title}, I thought you might be interested in how we help teams like yours ${goal.toLowerCase()}.\n\nWould you be open to a quick 15-minute call this week to see if it's a fit?\n\nBest,\nThe AgentForge Team`,
      })
    }

    return emails
  }

  private buildCrmExport(
    leads: EnrichedLead[],
    emails: { to: string; subject: string; body: string }[]
  ) {
    return leads.map((lead, i) => ({
      contactName: lead.name,
      title: lead.title,
      company: lead.company,
      email: lead.email,
      linkedin: lead.linkedin,
      location: lead.location,
      industry: lead.industry,
      companySize: lead.companySize,
      stage: "New Lead",
      outreachSubject: emails[i]?.subject,
      outreachDrafted: true,
    }))
  }
}
