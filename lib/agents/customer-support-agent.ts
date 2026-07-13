import { BaseAgent, AgentResult } from "./base-agent"
import { tavilySearch } from "@/lib/tools/tavily"
import { generateText, hasLLM } from "@/lib/llm"

/**
 * Customer Support Agent
 * 1. Analyzes support request
 * 2. Searches knowledge base (Tavily)
 * 3. Generates resolution steps
 * 4. Creates FAQ entry
 * 5. Drafts response template
 */
export class CustomerSupportAgent extends BaseAgent {
  protected totalSteps() {
    return 5
  }

  async execute(goal: string): Promise<AgentResult> {
    const analysis = await this.executeStep(
      "Analyzing support request",
      () => this.analyzeRequest(goal),
      20
    )

    const knowledgeBase = await this.executeStep(
      "Searching knowledge base",
      () => tavilySearch(`how to resolve: ${goal}`, { maxResults: 4 }),
      40
    )

    const resolutionSteps = await this.executeStep(
      "Generating resolution steps",
      () => this.generateResolutionSteps(goal, knowledgeBase.answer),
      65
    )

    const faqEntry = await this.executeStep(
      "Creating FAQ entry",
      () => this.generateFaqEntry(goal, resolutionSteps),
      85
    )

    const responseTemplate = await this.executeStep(
      "Drafting response template",
      () => this.generateResponseTemplate(goal, resolutionSteps),
      100
    )

    return {
      summary: `Analyzed the support request "${goal}", researched relevant solutions, and produced resolution steps, an FAQ entry, and a ready-to-send response template.`,
      data: {
        goal,
        analysis,
        resolutionSteps,
        faqEntry,
        responseTemplate,
      },
      steps: this.steps,
    }
  }

  private async analyzeRequest(goal: string) {
    const prompt = `Classify and briefly analyze this customer support request: "${goal}". Identify the likely category (billing, technical, account, other), urgency (low/medium/high), and sentiment. Keep it under 60 words.`
    const generated = hasLLM ? await generateText(prompt) : ""

    return (
      generated ||
      `Category: General Support. Urgency: Medium. Sentiment: Neutral. The request "${goal}" appears to be a common inquiry that can likely be resolved with existing documentation and a clear step-by-step response.`
    )
  }

  private async generateResolutionSteps(goal: string, context?: string) {
    const prompt = `A customer needs help with: "${goal}". Relevant context: "${context}". Write 4-5 clear, numbered resolution steps a support agent could follow or share with the customer.`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return generated.split("\n").filter(Boolean)
    }

    return [
      "1. Confirm the customer's account details and reproduce the issue if possible.",
      "2. Check the relevant settings or billing page related to the request.",
      "3. Walk the customer through the fix step by step, or apply it on their behalf if permitted.",
      "4. Verify the issue is resolved and ask the customer to confirm.",
      "5. Log the resolution and flag any recurring pattern to the product team.",
    ]
  }

  private async generateFaqEntry(goal: string, steps: string[]) {
    return {
      question: `How do I resolve: "${goal}"?`,
      answer: steps.join(" "),
    }
  }

  private async generateResponseTemplate(goal: string, steps: string[]) {
    const prompt = `Write a friendly, professional customer support email response template addressing: "${goal}". Incorporate these resolution steps: ${steps.join(" ")}. Keep it under 150 words.`
    const generated = hasLLM ? await generateText(prompt) : ""

    return (
      generated ||
      `Hi there,\n\nThanks for reaching out about "${goal}" — I completely understand the concern and I'm happy to help.\n\nHere's what I'd recommend:\n${steps.join("\n")}\n\nLet me know if this resolves things on your end, or if you run into anything else — I'm here to help!\n\nBest,\nSupport Team`
    )
  }
}
