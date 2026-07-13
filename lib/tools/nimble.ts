/**
 * Nimble API tool for web data extraction and lead/contact enrichment.
 * Falls back to realistic mock data when NIMBLE_API_KEY is not configured.
 */

export interface EnrichedLead {
  name: string
  title: string
  company: string
  email: string
  linkedin: string
  location: string
  companySize: string
  industry: string
}

const NIMBLE_API_URL = "https://api.nimbleway.com/v1/enrich"

const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Avery", "Cameron", "Drew"]
const LAST_NAMES = ["Chen", "Patel", "Garcia", "Kim", "Nguyen", "Smith", "Johnson", "Williams", "Brown", "Davis"]
const TITLES = ["VP of Sales", "Head of Growth", "CEO", "COO", "Director of Marketing", "CTO", "VP of Operations"]
const INDUSTRIES = ["SaaS", "FinTech", "HealthTech", "E-commerce", "Cybersecurity", "EdTech"]
const SIZES = ["11-50", "51-200", "201-500", "501-1000", "1000+"]
const LOCATIONS = ["New York, NY", "San Francisco, CA", "Austin, TX", "Boston, MA", "Chicago, IL", "Remote"]

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function mockEnrichment(companyName: string, index: number): EnrichedLead {
  const first = pick(FIRST_NAMES, index)
  const last = pick(LAST_NAMES, index + 3)
  const domain = companyName.toLowerCase().replace(/[^a-z0-9]/g, "")
  return {
    name: `${first} ${last}`,
    title: pick(TITLES, index),
    company: companyName,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${domain}.com`,
    linkedin: `linkedin.com/in/${first.toLowerCase()}-${last.toLowerCase()}`,
    location: pick(LOCATIONS, index),
    companySize: pick(SIZES, index),
    industry: pick(INDUSTRIES, index),
  }
}

export async function nimbleEnrichLeads(
  companyNames: string[]
): Promise<EnrichedLead[]> {
  const apiKey = process.env.NIMBLE_API_KEY

  if (!apiKey) {
    return companyNames.map((name, i) => mockEnrichment(name, i))
  }

  try {
    const results = await Promise.all(
      companyNames.map(async (name) => {
        const response = await fetch(NIMBLE_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiKey,
          },
          body: JSON.stringify({ company: name }),
        })

        if (!response.ok) {
          throw new Error(`Nimble API error: ${response.status}`)
        }

        const data = await response.json()
        return {
          name: data.name ?? "Unknown Contact",
          title: data.title ?? "Unknown Title",
          company: name,
          email: data.email ?? "",
          linkedin: data.linkedin ?? "",
          location: data.location ?? "",
          companySize: data.companySize ?? "",
          industry: data.industry ?? "",
        } as EnrichedLead
      })
    )
    return results
  } catch (error) {
    console.error("Nimble enrichment failed, falling back to mock data:", error)
    return companyNames.map((name, i) => mockEnrichment(name, i))
  }
}
