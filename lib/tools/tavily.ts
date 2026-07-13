/**
 * Tavily web search tool.
 * Falls back to realistic mock data when TAVILY_API_KEY is not configured,
 * so the platform remains fully demoable without external credentials.
 */

export interface TavilySearchResult {
  title: string
  url: string
  content: string
  score: number
}

export interface TavilySearchResponse {
  query: string
  results: TavilySearchResult[]
  answer?: string
}

const TAVILY_API_URL = "https://api.tavily.com/search"

function mockResults(query: string): TavilySearchResponse {
  return {
    query,
    answer: `Based on current web sources, "${query}" is a growing area of interest with multiple active players, increasing search volume, and strong momentum over the last 12 months.`,
    results: [
      {
        title: `${query} — Market Overview & Key Players`,
        url: "https://example.com/market-overview",
        content: `An overview of the current landscape for ${query}, including major companies, recent funding rounds, and adoption trends across the industry.`,
        score: 0.94,
      },
      {
        title: `Top 10 Companies Leading in ${query}`,
        url: "https://example.com/top-companies",
        content: `A curated list of the leading organizations working on ${query}, their positioning, differentiators, and go-to-market strategy.`,
        score: 0.91,
      },
      {
        title: `${query}: Trends to Watch This Year`,
        url: "https://example.com/trends",
        content: `Analysts highlight several emerging trends related to ${query}, including increased automation, consolidation, and rising customer expectations.`,
        score: 0.88,
      },
      {
        title: `How Businesses Are Approaching ${query}`,
        url: "https://example.com/approach",
        content: `Case studies of companies successfully tackling ${query} with a mix of technology, process change, and strategic hiring.`,
        score: 0.85,
      },
    ],
  }
}

export async function tavilySearch(
  query: string,
  options: { maxResults?: number; searchDepth?: "basic" | "advanced" } = {}
): Promise<TavilySearchResponse> {
  const apiKey = process.env.TAVILY_API_KEY

  if (!apiKey) {
    return mockResults(query)
  }

  try {
    const response = await fetch(TAVILY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: options.searchDepth ?? "basic",
        max_results: options.maxResults ?? 5,
        include_answer: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status}`)
    }

    const data = await response.json()

    interface TavilyRawResult {
      title: string
      url: string
      content: string
      score: number
    }

    return {
      query,
      answer: data.answer,
      results: ((data.results ?? []) as TavilyRawResult[]).map((r) => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
      })),
    }
  } catch (error) {
    console.error("Tavily search failed, falling back to mock data:", error)
    return mockResults(query)
  }
}
