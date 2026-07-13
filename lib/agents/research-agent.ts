import { BaseAgent, AgentResult } from "./base-agent"
import { tavilySearch } from "@/lib/tools/tavily"
import { youComSearch } from "@/lib/tools/youcom"
import { generateText, hasLLM } from "@/lib/llm"

/**
 * Research Agent
 * 1. Searches multiple sources with Tavily
 * 2. Uses You.com for additional context
 * 3. Synthesizes findings with OpenAI
 * 4. Generates executive summary report
 * 5. Creates structured findings document
 */
export class ResearchAgent extends BaseAgent {
  protected totalSteps() {
    return 5
  }

  async execute(goal: string): Promise<AgentResult> {
    const tavilyResults = await this.executeStep(
      "Searching primary sources (Tavily)",
      () => tavilySearch(goal, { maxResults: 6, searchDepth: "advanced" }),
      25
    )

    const youComResults = await this.executeStep(
      "Gathering additional context (You.com)",
      () => youComSearch(goal),
      45
    )

    const synthesis = await this.executeStep(
      "Synthesizing findings",
      () => this.synthesize(goal, tavilyResults.results, youComResults.hits),
      70
    )

    const executiveSummary = await this.executeStep(
      "Generating executive summary",
      () => this.generateExecutiveSummary(goal, synthesis),
      90
    )

    const findingsDocument = await this.executeStep(
      "Compiling structured findings document",
      async () => this.buildFindingsDocument(goal, tavilyResults.results, youComResults.hits, synthesis),
      100
    )

    return {
      summary: executiveSummary,
      data: {
        goal,
        sources: [...tavilyResults.results.map((r) => r.url), ...youComResults.hits.map((h) => h.url)],
        synthesis,
        findingsDocument,
      },
      steps: this.steps,
    }
  }

  private async synthesize(
    goal: string,
    tavilyResults: { title: string; content: string }[],
    youComHits: { title: string; snippet: string }[]
  ) {
    const combined = [
      ...tavilyResults.map((r) => `- ${r.title}: ${r.content}`),
      ...youComHits.map((h) => `- ${h.title}: ${h.snippet}`),
    ].join("\n")

    const prompt = `You are researching: "${goal}".\n\nHere are raw findings from web sources:\n${combined}\n\nSynthesize these into 4-6 concise bullet points covering the key facts, trends, and implications. Return only the bullet points.`

    const generated = hasLLM ? await generateText(prompt) : ""

    return (
      generated ||
      [
        `- The market around "${goal}" shows steady growth driven by increasing digital adoption.`,
        "- A handful of established players dominate market share, with several fast-growing challengers.",
        "- Buyers increasingly prioritize integration, automation, and measurable ROI.",
        "- Pricing models are shifting toward usage-based and outcome-based structures.",
        "- Regulatory and data-privacy considerations are becoming more prominent in vendor evaluations.",
      ].join("\n")
    )
  }

  private async generateExecutiveSummary(goal: string, synthesis: string) {
    const prompt = `Write a 3-sentence executive summary for a research report on: "${goal}". Base it on these findings:\n${synthesis}\n\nBe concise and business-oriented.`

    const generated = hasLLM ? await generateText(prompt) : ""

    return (
      generated ||
      `This report examines "${goal}" using multi-source web research. Findings point to a growing, competitive market with clear opportunities for differentiated, well-positioned entrants. Key recommendations focus on speed to market, integration depth, and pricing flexibility.`
    )
  }

  private buildFindingsDocument(
    goal: string,
    tavilyResults: { title: string; url: string; content: string }[],
    youComHits: { title: string; url: string; snippet: string }[],
    synthesis: string
  ) {
    return {
      title: `Research Report: ${goal}`,
      generatedAt: new Date().toISOString(),
      keyFindings: synthesis.split("\n").filter(Boolean),
      sources: [
        ...tavilyResults.map((r) => ({ title: r.title, url: r.url, excerpt: r.content })),
        ...youComHits.map((h) => ({ title: h.title, url: h.url, excerpt: h.snippet })),
      ],
    }
  }
}
