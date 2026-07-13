import { BaseAgent, AgentResult } from "./base-agent"
import { tavilySearch } from "@/lib/tools/tavily"
import { generateText, hasLLM } from "@/lib/llm"

/**
 * Startup Advisor Agent
 * 1. Analyzes the startup idea/problem
 * 2. Researches market opportunity (Tavily)
 * 3. Competitive analysis
 * 4. Generates business model canvas
 * 5. Creates actionable roadmap
 */
export class StartupAdvisorAgent extends BaseAgent {
  protected totalSteps() {
    return 5
  }

  async execute(goal: string): Promise<AgentResult> {
    const ideaAnalysis = await this.executeStep(
      "Analyzing the startup idea",
      () => this.analyzeIdea(goal),
      20
    )

    const marketResearch = await this.executeStep(
      "Researching market opportunity",
      () => tavilySearch(`market size and opportunity for: ${goal}`, { maxResults: 5 }),
      40
    )

    const competitiveAnalysis = await this.executeStep(
      "Conducting competitive analysis",
      () => this.analyzeCompetitors(goal, marketResearch.results),
      60
    )

    const businessModel = await this.executeStep(
      "Generating business model canvas",
      () => this.generateBusinessModelCanvas(goal),
      85
    )

    const roadmap = await this.executeStep(
      "Creating actionable roadmap",
      () => this.generateRoadmap(goal),
      100
    )

    return {
      summary: `Analyzed the idea "${goal}", researched the market opportunity, mapped the competitive landscape, and produced a business model canvas plus a 90-day roadmap.`,
      data: {
        goal,
        ideaAnalysis,
        marketInsights: marketResearch.answer,
        competitiveAnalysis,
        businessModel,
        roadmap,
      },
      steps: this.steps,
    }
  }

  private async analyzeIdea(goal: string) {
    const prompt = `Analyze this startup idea/problem statement: "${goal}". Summarize the core problem, target customer, and value proposition in under 100 words.`
    const generated = hasLLM ? await generateText(prompt) : ""

    return (
      generated ||
      `The idea "${goal}" addresses a real, growing pain point for its target customers. The core value proposition centers on saving time and reducing cost through automation and better tooling, with a clear path to product-market fit if positioning and early customer feedback are prioritized.`
    )
  }

  private async analyzeCompetitors(goal: string, sources: { title: string; content: string }[]) {
    const context = sources.map((s) => `- ${s.title}: ${s.content}`).join("\n")
    const prompt = `Based on this market research:\n${context}\n\nWrite a brief competitive analysis (3-4 bullet points) for a startup pursuing: "${goal}". Cover direct competitors, indirect alternatives, and a suggested differentiation angle.`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return generated.split("\n").filter(Boolean)
    }

    return [
      "- Direct competitors are well-funded but often slow to innovate on UX and pricing.",
      "- Indirect alternatives (manual processes, spreadsheets) still dominate a large share of the market.",
      "- A clear differentiation opportunity exists around speed of setup, transparent pricing, and AI-driven automation.",
    ]
  }

  private async generateBusinessModelCanvas(goal: string) {
    const prompt = `Create a concise business model canvas for: "${goal}". Include: Value Proposition, Customer Segments, Revenue Streams, Key Channels, and Cost Structure. Keep each section to 1-2 sentences.`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return { content: generated }
    }

    return {
      content: `Value Proposition: Solve "${goal}" faster and cheaper than existing alternatives.\nCustomer Segments: Growth-stage companies and teams facing this problem directly.\nRevenue Streams: Subscription (SaaS) with usage-based upsells.\nKey Channels: Product-led growth, content marketing, and targeted outbound.\nCost Structure: Primarily engineering, cloud infrastructure, and customer acquisition.`,
    }
  }

  private async generateRoadmap(goal: string) {
    const prompt = `Create a 90-day actionable roadmap (3 phases: 30/60/90 days) for launching a startup around: "${goal}". Return concise bullet points grouped by phase.`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return generated.split("\n").filter(Boolean)
    }

    return [
      "Days 1-30: Validate the problem with 15+ customer interviews and ship an MVP.",
      "Days 31-60: Onboard first 10 paying customers and iterate based on feedback.",
      "Days 61-90: Formalize pricing, build repeatable acquisition channel, and prepare fundraising materials.",
    ]
  }
}
