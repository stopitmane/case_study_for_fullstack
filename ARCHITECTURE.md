# Architecture Documentation

## Overview
This is a fullstack Next.js application that implements an email workflow trigger system. The application follows modern best practices with clear separation of concerns, proper validation, and environment-aware configuration.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes (serverless functions)
- **Styling**: CSS (vanilla, no framework dependencies)
- **Validation**: Custom validators with sanitization
- **Integration**: Workflow automation tools (Zapier, Make, n8n, etc.)

## Architecture Decisions

### 1. Workflow Automation Integration
Instead of directly integrating with email services (SendGrid, Mailgun, etc.), all email sending goes through workflow automation tools. This provides:
- Centralized control over third-party integrations
- Easy switching between email providers without code changes
- Built-in retry logic and error handling
- Audit trails and monitoring
- Environment-specific configurations (staging vs production)

### 2. Environment-Aware Design
The application automatically detects the environment and routes requests to appropriate workflow endpoints:
- **Development/Staging**: Uses `WORKFLOW_API_URL_STAGING`
- **Production**: Uses `WORKFLOW_API_URL_PRODUCTION`

### 3. Security Measures
- Input validation on both client and server
- Input sanitization to prevent XSS attacks
- Email format validation
- API key authentication for workflow service
- Environment variables for sensitive data
- No PII in logs or error messages

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── send-email/
│   │   │   └── route.ts          # Main API endpoint
│   │   └── health/
│   │       └── route.ts          # Health check endpoint
│   ├── page.tsx                  # Main form page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── lib/
│   ├── workflow-client.ts        # Workflow API client
│   └── validators.ts             # Input validation & sanitization
├── .env.local                    # Environment variables
└── README.md                     # Setup documentation
```

## API Endpoints

### POST /api/send-email
Triggers the email workflow with validated and sanitized data.

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "userFirstName": "John",
  "referredUserName": "Jane Doe",
  "courseName": "Advanced JavaScript",
  "currency": "USD",
  "referralAmount": "50.00",
  "recipientEmail": "recipient@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "workflowId": "wf_123456",
  "environment": "staging"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid user email address",
  "field": "userEmail"
}
```

**Error Response (500):**
```json
{
  "error": "Workflow API Error: Connection timeout"
}
```

### GET /api/health
Health check endpoint for monitoring.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-04T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## Data Flow

1. User fills out the form on the frontend
2. Client-side validation occurs on submit
3. Form data is sent to `/api/send-email` endpoint
4. Server validates and sanitizes all inputs
5. Data is transformed into workflow payload format
6. WorkflowClient sends request to appropriate environment endpoint
7. Workflow automation tool receives request and triggers email sending
8. Response is returned to client with success/error status

## Workflow Payload Format

The application maintains compatibility with the existing Django implementation:

```json
{
  "to": "user@example.com",
  "from": "Medbuddy <info@medbuddyafrica.com>",
  "context": {
    "user_first_name": "John",
    "referred_user_name": "Jane Doe",
    "course_name": "Advanced JavaScript",
    "currency": "USD",
    "referral_value": "50.00",
    "referral_tracking_page_url": "https://yourwebsite.com/app/referrals",
    "recipient": "recipient@example.com"
  },
  "template": "medbuddy_referral_followup"
}
```

## Error Handling

### Validation Errors
- Email format validation
- Required field checks
- Currency whitelist validation
- Numeric amount validation
- Minimum length checks for text fields

### Runtime Errors
- Network failures
- Workflow API errors
- Authentication failures
- Timeout handling

All errors are logged server-side and user-friendly messages are returned to the client.

## Scalability Considerations

1. **Serverless Architecture**: Next.js API routes are serverless by default, scaling automatically
2. **Stateless Design**: No session management, each request is independent
3. **External Workflow Service**: Email processing is offloaded to dedicated automation tools
4. **Environment Separation**: Clear separation between staging and production

## Future Enhancements

- Add request rate limiting
- Implement request logging and analytics
- Add webhook endpoint for workflow status updates
- Implement retry logic with exponential backoff
- Add unit and integration tests
- Add API documentation with OpenAPI/Swagger
- Implement request queuing for high volume
