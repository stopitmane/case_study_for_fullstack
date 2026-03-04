import { NextRequest, NextResponse } from 'next/server'

// Workflow service client
class WorkflowService {
  private apiUrl: string
  private apiKey: string

  constructor() {
    const env = process.env.NODE_ENV
    this.apiUrl = env === 'production' 
      ? process.env.WORKFLOW_API_URL_PRODUCTION || ''
      : process.env.WORKFLOW_API_URL_STAGING || ''
    this.apiKey = process.env.WORKFLOW_API_KEY || ''
  }

  async triggerEmailWorkflow(payload: any) {
    const response = await fetch(`${this.apiUrl}/workflows/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(payload)
    })

    if (response.status !== 200) {
      const error = await response.json()
      throw new Error(error.message || 'Workflow trigger failed')
    }

    return await response.json()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      userEmail,
      userFirstName,
      referredUserName,
      courseName,
      currency,
      referralAmount,
      recipientEmail
    } = body

    // Validate required fields
    if (!userEmail || !userFirstName || !referredUserName || !courseName || 
        !currency || !referralAmount || !recipientEmail) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Prepare workflow payload matching the original structure
    const workflowPayload = {
      to: userEmail,
      from: 'Medbuddy <info@medbuddyafrica.com>',
      context: {
        user_first_name: userFirstName.split(' ')[0],
        referred_user_name: referredUserName,
        course_name: courseName,
        currency: currency,
        referral_value: referralAmount,
        referral_tracking_page_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL || ''}/app/referrals`,
        recipient: recipientEmail
      },
      template: 'medbuddy_referral_followup'
    }

    // Trigger workflow automation
    const workflowService = new WorkflowService()
    const result = await workflowService.triggerEmailWorkflow(workflowPayload)

    return NextResponse.json({
      success: true,
      message: 'Email workflow triggered successfully',
      workflowId: result.id
    })

  } catch (error: any) {
    console.error('Workflow trigger error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to trigger workflow' },
      { status: 500 }
    )
  }
}
