import { BaseAgent, ProgressCallback } from "./base-agent"
import { SalesAgent } from "./sales-agent"
import { MarketingAgent } from "./marketing-agent"
import { ResearchAgent } from "./research-agent"
import { RecruitingAgent } from "./recruiting-agent"
import { CustomerSupportAgent } from "./customer-support-agent"
import { StartupAdvisorAgent } from "./startup-advisor-agent"

export function createAgent(agentType: string, onProgress?: ProgressCallback): BaseAgent {
  switch (agentType) {
    case "sales":
      return new SalesAgent(onProgress)
    case "marketing":
      return new MarketingAgent(onProgress)
    case "research":
      return new ResearchAgent(onProgress)
    case "recruiting":
      return new RecruitingAgent(onProgress)
    case "customer-support":
      return new CustomerSupportAgent(onProgress)
    case "startup-advisor":
      return new StartupAdvisorAgent(onProgress)
    default:
      throw new Error(`Unknown agent type: ${agentType}`)
  }
}
