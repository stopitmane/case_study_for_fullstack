import { NextRequest, NextResponse } from 'next/server'
import { WorkflowClient, EmailWorkflowPayload } from '@/lib/workflow-client'
import { validateFormData, sanitizeInput, ValidationError, EmailFormData } from '@/lib/validators'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const formData: EmailFormData = {
      userEmail: body.userEmail,
      userFirstName: body.userFirstName,
      referredUserName: body.referredUserName,
      courseName: body.courseName,
      currency: body.currency,
      referralAmount: body.referralAmount,
      recipientEmail: body.recipientEmail
    }

    // Validate input
    validateFormData(formData)

    // Sanitize inputs
    const sanitizedData = {
      userEmail: sanitizeInput(formData.userEmail),
      userFirstName: sanitizeInput(formData.userFirstName),
      referredUserName: sanitizeInput(formData.referredUserName),
      courseName: sanitizeInput(formData.courseName),
      currency: formData.currency,
      referralAmount: formData.referralAmount,
      recipientEmail: sanitizeInput(formData.recipientEmail)
    }

    // Prepare workflow payload matching Django implementation
    const workflowPayload: EmailWorkflowPayload = {
      to: sanitizedData.userEmail,
      from: 'Medbuddy <info@medbuddyafrica.com>',
      context: {
        user_first_name: sanitizedData.userFirstName.split(' ')[0],
        referred_user_name: sanitizedData.referredUserName,
        course_name: sanitizedData.courseName,
        currency: sanitizedData.currency,
        referral_value: sanitizedData.referralAmount,
        referral_tracking_page_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL || ''}/app/referrals`,
        recipient: sanitizedData.recipientEmail
      },
      template: 'medbuddy_referral_followup'
    }

    // Trigger workflow automation
    const workflowClient = new WorkflowClient()
    const result = await workflowClient.triggerEmailWorkflow(workflowPayload)

    return NextResponse.json({
      success: result.success,
      message: result.message,
      workflowId: result.workflowId,
      environment: workflowClient.getEnvironment()
    }, { status: 200 })

  } catch (error: any) {
    console.error('API Error:', error)

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { 
          error: error.message,
          field: error.field
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
