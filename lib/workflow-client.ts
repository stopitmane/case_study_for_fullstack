// Workflow automation client
export interface EmailWorkflowPayload {
  to: string
  from: string
  context: {
    user_first_name: string
    referred_user_name: string
    course_name: string
    currency: string
    referral_value: string
    referral_tracking_page_url: string
    recipient: string
  }
  template: string
}

export interface WorkflowResponse {
  success: boolean
  workflowId: string
  message: string
}

export class WorkflowClient {
  private apiUrl: string
  private apiKey: string
  private environment: 'staging' | 'production'

  constructor() {
    this.environment = process.env.NODE_ENV === 'production' ? 'production' : 'staging'
    this.apiUrl = this.environment === 'production' 
      ? process.env.WORKFLOW_API_URL_PRODUCTION || ''
      : process.env.WORKFLOW_API_URL_STAGING || ''
    this.apiKey = process.env.WORKFLOW_API_KEY || ''
  }

  async triggerEmailWorkflow(payload: EmailWorkflowPayload): Promise<WorkflowResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/workflows/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Environment': this.environment
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `HTTP ${response.status}: Workflow trigger failed`)
      }

      const result = await response.json()
      return {
        success: true,
        workflowId: result.id || result.workflowId,
        message: result.message || 'Workflow triggered successfully'
      }
    } catch (error: any) {
      throw new Error(`Workflow API Error: ${error.message}`)
    }
  }

  getEnvironment(): string {
    return this.environment
  }
}
