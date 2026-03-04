# Email Workflow Application

Next.js application that triggers email sending through workflow automation tools.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```
WORKFLOW_API_URL_STAGING=https://staging-workflow.example.com/api
WORKFLOW_API_URL_PRODUCTION=https://production-workflow.example.com/api
WORKFLOW_API_KEY=your_workflow_api_key_here
NEXT_PUBLIC_WEBSITE_URL=https://yourwebsite.com
NODE_ENV=development
```

3. Run development server:
```bash
npm run dev
```

Visit http://localhost:3000

## Architecture

- Frontend: Next.js 14 with App Router
- Form collects all required fields for the email workflow
- API route triggers workflow automation service
- Environment-aware: automatically uses staging or production workflow endpoints
