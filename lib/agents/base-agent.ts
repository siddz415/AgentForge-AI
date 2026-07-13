export interface AgentStep {
  name: string
  status: "pending" | "running" | "completed" | "failed"
  result?: unknown
  startedAt?: string
  completedAt?: string
}

export interface AgentResult {
  summary: string
  data: Record<string, unknown>
  steps: AgentStep[]
}

export type ProgressCallback = (progress: number, stepName: string) => void | Promise<void>

/**
 * Abstract base class shared by all AgentForge agents. Provides consistent
 * step tracking and progress reporting so the UI can render a live,
 * step-by-step execution view for any agent type.
 */
export abstract class BaseAgent {
  steps: AgentStep[] = []
  onProgress?: ProgressCallback

  constructor(onProgress?: ProgressCallback) {
    this.onProgress = onProgress
  }

  protected async executeStep<T>(
    stepName: string,
    fn: () => Promise<T>,
    progressAfter?: number
  ): Promise<T> {
    const step: AgentStep = {
      name: stepName,
      status: "running",
      startedAt: new Date().toISOString(),
    }
    this.steps.push(step)
    await this.reportProgress(stepName)

    try {
      const result = await fn()
      step.status = "completed"
      step.result = result
      step.completedAt = new Date().toISOString()

      // Awaiting the progress callback is intentional: it's a lightweight,
      // idempotent state write (e.g. a DB update), and awaiting it guarantees
      // progress updates are persisted in the order they occur. Firing it
      // without awaiting previously caused a race where an earlier, smaller
      // progress value could overwrite a later 100% completion update.
      if (progressAfter !== undefined) {
        await this.onProgress?.(progressAfter, stepName)
      }

      return result
    } catch (error) {
      step.status = "failed"
      step.result = error instanceof Error ? error.message : String(error)
      step.completedAt = new Date().toISOString()
      throw error
    }
  }

  private async reportProgress(stepName: string) {
    const totalPlanned = this.totalSteps()
    const completed = this.steps.filter((s) => s.status === "completed").length
    const progress = totalPlanned > 0 ? Math.round((completed / totalPlanned) * 100) : 0
    await this.onProgress?.(progress, stepName)
  }

  /** Subclasses may override to give more accurate progress percentages. */
  protected totalSteps(): number {
    return 5
  }

  abstract execute(goal: string): Promise<AgentResult>
}
