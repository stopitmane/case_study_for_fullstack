# Email Workflow Application

## Case Study Solution: Fullstack Developer

A production-ready Next.js application that implements an email workflow trigger system using workflow automation tools instead of direct third-party email service integration.

## Problem Statement

The existing Django codebase has a utility method to send email notifications. Due to a technical decision to route all third-party integrations through automation workflow tools, this application provides an alternative implementation that:

1. Maintains the same functionality as the original Django implementation
2. Routes email sending through workflow automation tools (Zapier, Make, n8n)
3. Supports both staging and production environments
4. Provides a user interface to trigger the workflow

## Solution Overview

### Frontend
- Next.js 14 with App Router and TypeScript
- Form-based UI to collect all required email workflow parameters
- Client-side validation with real-time feedback
- Loading states and error handling
- Responsive design

### Backend
- Next.js API Routes (serverless functions)
- Input validation and sanitization
- Environment-aware workflow routing
- Structured error handling
- Health check endpoint

### Key Features
- **Security**: Input validation, sanitization, XSS prevention
- **Environment Management**: Automatic staging/production routing
- **Error Handling**: Comprehensive validation and runtime error handling
- **Maintainability**: Clean code structure with separation of concerns
- **Scalability**: Serverless architecture, stateless design

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/stopitmane/case_study_for_fullstack.git
cd case_study_for_fullstack
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
WORKFLOW_API_URL_STAGING=https://staging-workflow.example.com/api
WORKFLOW_API_URL_PRODUCTION=https://production-workflow.example.com/api
WORKFLOW_API_KEY=your_workflow_api_key_here
NEXT_PUBLIC_WEBSITE_URL=https://yourwebsite.com
NODE_ENV=development
```

4. Run development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## API Documentation

### POST /api/send-email

Triggers the email workflow with validated data.

**Request:**
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

### GET /api/health

Health check endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-04T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## Testing the Application

### Manual Testing

1. Start the development server
2. Navigate to http://localhost:3000
3. Fill out the form with test data:
   - User Email: test@example.com
   - User First Name: John
   - Referred User Name: Jane Doe
   - Course Name: Test Course
   - Currency: USD
   - Referral Amount: 50.00
   - Recipient Email: recipient@example.com
4. Click "Send Email"
5. Verify the success message appears

### API Testing with curl

```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "userFirstName": "John",
    "referredUserName": "Jane Doe",
    "courseName": "Test Course",
    "currency": "USD",
    "referralAmount": "50.00",
    "recipientEmail": "recipient@example.com"
  }'
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── send-email/route.ts   # Main API endpoint
│   │   └── health/route.ts       # Health check
│   ├── page.tsx                  # Form UI
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Styles
├── lib/
│   ├── workflow-client.ts        # Workflow API client
│   └── validators.ts             # Validation logic
├── .env.local                    # Environment config
├── ARCHITECTURE.md               # Detailed architecture docs
└── README.md                     # This file
```

## Technical Decisions

### Why Workflow Automation Tools?
- Centralized control over third-party integrations
- Easy provider switching without code changes
- Built-in retry logic and monitoring
- Environment-specific configurations

### Why Next.js?
- Modern React framework with excellent DX
- Built-in API routes (no separate backend needed)
- TypeScript support out of the box
- Serverless deployment ready
- Fast development iteration

### Security Measures
- Input validation on both client and server
- Input sanitization to prevent XSS
- Email format validation
- API key authentication
- Environment variables for secrets

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t email-workflow-app .
docker run -p 3000:3000 email-workflow-app
```

### Environment Variables for Production
Ensure these are set in your deployment platform:
- `WORKFLOW_API_URL_PRODUCTION`
- `WORKFLOW_API_KEY`
- `NEXT_PUBLIC_WEBSITE_URL`
- `NODE_ENV=production`

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [API Documentation](#api-documentation) - API endpoint details

## License

MIT

## Author

Developed as a case study solution for Fullstack Developer position
