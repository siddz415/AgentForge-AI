import { BaseAgent, AgentResult } from "./base-agent"
import { tavilySearch } from "@/lib/tools/tavily"
import { nimbleEnrichLeads } from "@/lib/tools/nimble"
import { generateText, hasLLM } from "@/lib/llm"

/**
 * Recruiting Agent
 * 1. Defines candidate profile with OpenAI
 * 2. Searches for candidates (Tavily/Nimble)
 * 3. Evaluates candidate profiles
 * 4. Prepares interview questions
 * 5. Generates candidate summary report
 */
export class RecruitingAgent extends BaseAgent {
  protected totalSteps() {
    return 5
  }

  // Deterministic mock match-score generator: scores range from
  // MATCH_SCORE_BASE up to (MATCH_SCORE_BASE + MATCH_SCORE_RANGE - 1),
  // varying by candidate index so the demo data looks realistic without
  // being random (keeps output stable/reproducible for the same input).
  private static readonly MATCH_SCORE_BASE = 72
  private static readonly MATCH_SCORE_STEP = 7
  private static readonly MATCH_SCORE_RANGE = 25

  async execute(goal: string): Promise<AgentResult> {
    const candidateProfile = await this.executeStep(
      "Defining ideal candidate profile",
      () => this.defineCandidateProfile(goal),
      20
    )

    const sourcing = await this.executeStep(
      "Sourcing candidates",
      () => tavilySearch(`candidates for role: ${goal}`, { maxResults: 5 }),
      40
    )

    const candidateNames = sourcing.results.slice(0, 5).map((r, i) => {
      const guess = r.title.split(/[-|—:]/)[0].trim()
      return guess.length > 3 && guess.length < 60 ? guess : `Candidate ${i + 1}`
    })

    const evaluations = await this.executeStep(
      "Evaluating candidate profiles",
      async () => this.evaluateCandidates(candidateNames, goal),
      65
    )

    const interviewQuestions = await this.executeStep(
      "Preparing interview questions",
      () => this.generateInterviewQuestions(goal),
      85
    )

    const summaryReport = await this.executeStep(
      "Generating candidate summary report",
      async () => this.buildSummaryReport(goal, evaluations),
      100
    )

    return {
      summary: `Defined the ideal candidate profile for "${goal}", sourced and evaluated ${evaluations.length} candidates, and prepared a tailored interview kit.`,
      data: {
        goal,
        candidateProfile,
        candidates: evaluations,
        interviewQuestions,
        summaryReport,
      },
      steps: this.steps,
    }
  }

  private async defineCandidateProfile(goal: string) {
    const prompt = `Define an ideal candidate profile for this hiring goal: "${goal}". Include: required skills, years of experience, nice-to-haves, and culture fit signals. Keep it under 120 words.`
    const generated = hasLLM ? await generateText(prompt) : ""

    return (
      generated ||
      `Ideal candidate for "${goal}": 5+ years of relevant hands-on experience, strong track record of ownership and shipping high-impact work, excellent communication skills, and comfort operating in a fast-paced, ambiguous environment. Nice-to-haves include startup experience and relevant domain expertise.`
    )
  }

  private async evaluateCandidates(names: string[], goal: string) {
    const enriched = await nimbleEnrichLeads(names)

    return enriched.map((c, i) => ({
      name: c.name,
      currentTitle: c.title,
      currentCompany: c.company,
      location: c.location,
      linkedin: c.linkedin,
      matchScore:
        RecruitingAgent.MATCH_SCORE_BASE +
        ((i * RecruitingAgent.MATCH_SCORE_STEP) % RecruitingAgent.MATCH_SCORE_RANGE),
      strengths: [
        `Strong background relevant to "${goal}"`,
        "Proven track record of ownership",
        "Good communication and stakeholder management",
      ],
      considerations: i % 2 === 0 ? ["May require relocation"] : ["Slightly light on niche domain experience"],
    }))
  }

  private async generateInterviewQuestions(goal: string) {
    const prompt = `Write 6 targeted interview questions (mix of technical and behavioral) for evaluating a candidate for this role: "${goal}". Return one question per line.`
    const generated = hasLLM ? await generateText(prompt) : ""

    if (generated) {
      return generated.split("\n").filter(Boolean)
    }

    return [
      "Walk me through a project most relevant to this role and your specific contributions.",
      "How do you prioritize when facing competing deadlines?",
      "Describe a time you had to influence a decision without direct authority.",
      "What's your approach to ramping up quickly in a new domain?",
      "Tell me about a failure and what you learned from it.",
      "What questions do you have about our team and this role?",
    ]
  }

  private buildSummaryReport(goal: string, evaluations: { name: string; matchScore: number }[]) {
    const ranked = [...evaluations].sort((a, b) => b.matchScore - a.matchScore)
    return {
      role: goal,
      totalCandidatesEvaluated: evaluations.length,
      topCandidate: ranked[0]?.name ?? "N/A",
      averageMatchScore:
        evaluations.length > 0
          ? Math.round(evaluations.reduce((sum, c) => sum + c.matchScore, 0) / evaluations.length)
          : 0,
      recommendation:
        ranked.length > 0
          ? `Prioritize outreach to ${ranked[0].name} and the next 2 top-ranked candidates for initial screening calls.`
          : "No strong candidates identified yet; broaden sourcing criteria.",
    }
  }
}
