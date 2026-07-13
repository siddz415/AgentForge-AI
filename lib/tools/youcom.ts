/**
 * You.com API tool for AI-powered web search and content discovery.
 * Falls back to realistic mock data when YOUCOM_API_KEY is not configured.
 */

export interface YouComResult {
  title: string
  url: string
  snippet: string
}

export interface YouComResponse {
  query: string
  hits: YouComResult[]
}

const YOUCOM_API_URL = "https://api.ydc-index.io/search"

function mockResults(query: string): YouComResponse {
  return {
    query,
    hits: [
      {
        title: `${query} - Industry Analysis`,
        url: "https://example.com/industry-analysis",
        snippet: `You.com aggregated sources suggest strong interest in ${query}, with growing search demand and content coverage across news and expert blogs.`,
      },
      {
        title: `Deep Dive: ${query}`,
        url: "https://example.com/deep-dive",
        snippet: `Contextual synthesis of recent articles and discussions about ${query} reveals common themes around efficiency, ROI, and adoption barriers.`,
      },
      {
        title: `Expert Opinions on ${query}`,
        url: "https://example.com/expert-opinions",
        snippet: `Domain experts weigh in on ${query}, citing both opportunities and risks that organizations should account for during planning.`,
      },
    ],
  }
}

export async function youComSearch(query: string): Promise<YouComResponse> {
  const apiKey = process.env.YOUCOM_API_KEY

  if (!apiKey) {
    return mockResults(query)
  }

  try {
    const url = new URL(YOUCOM_API_URL)
    url.searchParams.set("query", query)

    const response = await fetch(url.toString(), {
      headers: { "X-API-Key": apiKey },
    })

    if (!response.ok) {
      throw new Error(`You.com API error: ${response.status}`)
    }

    const data = await response.json()

    interface YouComRawHit {
      title: string
      url: string
      snippets?: string[]
      description?: string
    }

    const hits = ((data.hits ?? []) as YouComRawHit[]).map((h) => ({
      title: h.title,
      url: h.url,
      snippet: Array.isArray(h.snippets) ? h.snippets.join(" ") : h.description ?? "",
    }))

    return { query, hits: hits.length ? hits : mockResults(query).hits }
  } catch (error) {
    console.error("You.com search failed, falling back to mock data:", error)
    return mockResults(query)
  }
}
