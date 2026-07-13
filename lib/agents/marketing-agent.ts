import { BaseAgent, AgentResult } from "./base-agent"
import { tavilySearch } from "@/lib/tools/tavily"
import { generateText, hasLLM } from "@/lib/llm"

/**
 * Marketing Agent
 * 1. Analyzes target audience with Tavily
 * 2. Generates content calendar
 * 3. Creates social media post drafts
 * 4. Writes blog post outline + intro
 * 5. Produces performance recommendations
 */
export class MarketingAgent extends BaseAgent {
  protected totalSteps() {
    return 5
  }

  async execute(goal: string): Promise<AgentResult> {
    const audienceResearch = await this.executeStep(
      "Analyzing target audience",
      () => tavilySearch(`target audience and marketing trends for: ${goal}`, { maxResults: 5 }),
      20
    )

    const contentCalendar = await this.executeStep(
      "Generating 30-day content calendar",
      () => this.generateContentCalendar(goal),
      45
    )

    const socialPosts = await this.executeStep(
      "Drafting social media posts",
      () => this.generateSocialPosts(goal),
      65
    )

    const blogOutline = await this.executeStep(
      "Writing blog post outline and introduction",
      () => this.generateBlogOutline(goal),
      85
    )

    const recommendations = await this.executeStep(
      "Producing performance recommendations",
      () => this.generateRecommendations(goal, audienceResearch.answer),
      100
    )

    return {
      summary: `Built a full marketing plan for "${goal}", including a 30-day content calendar, social posts, a blog outline, and channel performance recommendations.`,
      data: {
        goal,
        audienceInsights: audienceResearch.answer,
        contentCalendar,
        socialPosts,
        blogOutline,
        recommendations,
      },
      steps: this.steps,
    }
  }

  private async generateContentCalendar(goal: string) {
    const prompt = `Create a 7-item content calendar (representative of a 30-day plan) for this marketing goal: "${goal}". For each entry return a short line in the format "Day X | Content Type | Topic". Return only the list.`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return generated.split("\n").filter(Boolean)
    }

    const types = ["Blog Post", "LinkedIn Post", "Twitter Thread", "Email Newsletter", "Case Study", "Infographic", "Webinar Promo"]
    return types.map((type, i) => `Day ${(i + 1) * 4} | ${type} | Insights related to ${goal}`)
  }

  private async generateSocialPosts(goal: string) {
    const prompt = `Write 3 short, engaging social media posts (LinkedIn style, under 280 characters each) promoting: "${goal}". Return each post on its own line.`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return generated.split("\n").filter(Boolean).slice(0, 3)
    }

    return [
      `🚀 Big things are happening with ${goal}. Here's what you need to know — thread below.`,
      `We asked our customers what matters most for ${goal}. The answers might surprise you. Read more →`,
      `${goal} isn't just a trend — it's becoming table stakes. Here's how to stay ahead of the curve.`,
    ]
  }

  private async generateBlogOutline(goal: string) {
    const prompt = `Create a blog post outline (title + 5 section headers) and a 2-sentence introduction for a post about: "${goal}".`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return { content: generated }
    }

    return {
      content: `Title: The Complete Guide to ${goal}\n\nIntroduction: In today's fast-moving market, ${goal} has become a priority for growth-focused teams. This guide breaks down exactly what you need to know to get started and see results quickly.\n\nSections:\n1. Why ${goal} matters now\n2. Key trends shaping the space\n3. Common mistakes to avoid\n4. A practical framework for getting started\n5. Measuring success and iterating`,
    }
  }

  private async generateRecommendations(goal: string, audienceInsights?: string) {
    const prompt = `Based on this audience research: "${audienceInsights}", give 4 concise, actionable performance recommendations for a marketing campaign about: "${goal}".`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return generated.split("\n").filter(Boolean)
    }

    return [
      "Double down on LinkedIn and email — highest engagement channels for this audience segment.",
      "Test shorter-form video content to improve top-of-funnel awareness.",
      "Use case studies and social proof in mid-funnel nurture sequences.",
      "Introduce a lead magnet (checklist or template) to increase conversion rate.",
    ]
  }
}
