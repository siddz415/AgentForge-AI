import OpenAI from "openai"

/**
 * Shared OpenAI-compatible client. Uses the Nebius GPU inference endpoint when
 * NEBIUS_API_KEY is configured, otherwise falls back to the official OpenAI API.
 * When neither key is present, `hasLLM` is false and callers should use
 * deterministic mock content instead of making a network call.
 */

const nebiusKey = process.env.NEBIUS_API_KEY
const openaiKey = process.env.OPENAI_API_KEY

export const hasLLM = Boolean(nebiusKey || openaiKey)

export const llmClient = new OpenAI({
  apiKey: nebiusKey || openaiKey || "sk-placeholder",
  baseURL: nebiusKey
    ? process.env.NEBIUS_BASE_URL || "https://api.studio.nebius.ai/v1"
    : undefined,
})

export const LLM_MODEL = nebiusKey
  ? "meta-llama/Meta-Llama-3.1-70B-Instruct"
  : "gpt-4o-mini"

export async function generateText(
  prompt: string,
  system = "You are a helpful, expert AI business assistant."
): Promise<string> {
  if (!hasLLM) {
    return ""
  }

  try {
    const completion = await llmClient.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0]?.message?.content?.trim() ?? ""
  } catch (error) {
    console.error("LLM generation failed:", error)
    return ""
  }
}
