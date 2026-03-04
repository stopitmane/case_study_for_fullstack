# Testing Guide

## Manual Testing Checklist

### Form Validation Testing

#### Valid Inputs
- [ ] Submit form with all valid fields
- [ ] Verify success message appears
- [ ] Verify form clears after successful submission

#### Email Validation
- [ ] Enter invalid email format (e.g., "notanemail")
- [ ] Verify error message appears
- [ ] Enter valid email format
- [ ] Verify error clears

#### Required Fields
- [ ] Leave user email empty and submit
- [ ] Leave first name empty and submit
- [ ] Leave referred user name empty and submit
- [ ] Leave course name empty and submit
- [ ] Leave currency unselected and submit
- [ ] Leave referral amount empty and submit
- [ ] Leave recipient email empty and submit
- [ ] Verify appropriate error messages for each

#### Numeric Validation
- [ ] Enter negative number in referral amount
- [ ] Enter zero in referral amount
- [ ] Enter text in referral amount
- [ ] Enter valid positive number
- [ ] Verify validation works correctly

#### Text Length Validation
- [ ] Enter single character in first name
- [ ] Enter single character in referred user name
- [ ] Enter single character in course name
- [ ] Verify minimum length validation

### API Testing

#### Success Cases
```bash
# Test valid request
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "john@example.com",
    "userFirstName": "John Doe",
    "referredUserName": "Jane Smith",
    "courseName": "JavaScript Fundamentals",
    "currency": "USD",
    "referralAmount": "75.50",
    "recipientEmail": "jane@example.com"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Workflow triggered successfully",
  "workflowId": "wf_xxxxx",
  "environment": "staging"
}
```

#### Error Cases

**Invalid Email:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "invalid-email",
    "userFirstName": "John",
    "referredUserName": "Jane",
    "courseName": "Course",
    "currency": "USD",
    "referralAmount": "50",
    "recipientEmail": "jane@example.com"
  }'
```

Expected Response (400):
```json
{
  "error": "Invalid user email address",
  "field": "userEmail"
}
```

**Missing Required Field:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "john@example.com",
    "userFirstName": "",
    "referredUserName": "Jane",
    "courseName": "Course",
    "currency": "USD",
    "referralAmount": "50",
    "recipientEmail": "jane@example.com"
  }'
```

Expected Response (400):
```json
{
  "error": "User first name must be at least 2 characters",
  "field": "userFirstName"
}
```

**Invalid Currency:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "john@example.com",
    "userFirstName": "John",
    "referredUserName": "Jane",
    "courseName": "Course",
    "currency": "JPY",
    "referralAmount": "50",
    "recipientEmail": "jane@example.com"
  }'
```

Expected Response (400):
```json
{
  "error": "Invalid currency",
  "field": "currency"
}
```

**Invalid Amount:**
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "john@example.com",
    "userFirstName": "John",
    "referredUserName": "Jane",
    "courseName": "Course",
    "currency": "USD",
    "referralAmount": "-10",
    "recipientEmail": "jane@example.com"
  }'
```

Expected Response (400):
```json
{
  "error": "Referral amount must be a positive number",
  "field": "referralAmount"
}
```

### Health Check Testing

```bash
curl http://localhost:3000/api/health
```

Expected Response (200):
```json
{
  "status": "healthy",
  "timestamp": "2026-03-04T10:30:00.000Z",
  "environment": "development",
  "version": "1.0.0"
}
```

## Environment Testing

### Staging Environment
1. Set `NODE_ENV=development` in `.env.local`
2. Restart the server
3. Submit a form
4. Verify the response includes `"environment": "staging"`
5. Verify request goes to `WORKFLOW_API_URL_STAGING`

### Production Environment
1. Set `NODE_ENV=production` in `.env.local`
2. Restart the server
3. Submit a form
4. Verify the response includes `"environment": "production"`
5. Verify request goes to `WORKFLOW_API_URL_PRODUCTION`

## Security Testing

### XSS Prevention
```bash
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "john@example.com",
    "userFirstName": "<script>alert(\"xss\")</script>",
    "referredUserName": "Jane",
    "courseName": "Course",
    "currency": "USD",
    "referralAmount": "50",
    "recipientEmail": "jane@example.com"
  }'
```

Verify that:
- [ ] Script tags are sanitized/removed
- [ ] No script execution occurs
- [ ] Data is safely stored/transmitted

### Input Sanitization
Test with various malicious inputs:
- HTML tags: `<b>Bold</b>`
- SQL injection attempts: `'; DROP TABLE users; --`
- Special characters: `<>'"&`

Verify all inputs are properly sanitized.

## Performance Testing

### Load Testing (Basic)
```bash
# Install Apache Bench (if not installed)
# Windows: Download from Apache website
# Mac: brew install httpd
# Linux: sudo apt-get install apache2-utils

# Run 100 requests with 10 concurrent
ab -n 100 -c 10 -p payload.json -T application/json http://localhost:3000/api/send-email
```

Create `payload.json`:
```json
{
  "userEmail": "test@example.com",
  "userFirstName": "Test",
  "referredUserName": "User",
  "courseName": "Course",
  "currency": "USD",
  "referralAmount": "50",
  "recipientEmail": "recipient@example.com"
}
```

## Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

Verify:
- [ ] Form renders correctly
- [ ] Validation works
- [ ] Submit functionality works
- [ ] Error messages display properly
- [ ] Success messages display properly

## Accessibility Testing

- [ ] Tab through form fields (keyboard navigation)
- [ ] Verify all inputs have labels
- [ ] Verify error messages are announced
- [ ] Test with screen reader (if available)
- [ ] Verify color contrast meets WCAG standards

## Test Results Template

```
Date: ___________
Tester: ___________
Environment: Development / Staging / Production

Form Validation: PASS / FAIL
API Endpoints: PASS / FAIL
Environment Routing: PASS / FAIL
Security: PASS / FAIL
Performance: PASS / FAIL
Browser Compatibility: PASS / FAIL
Accessibility: PASS / FAIL

Notes:
_________________________________
_________________________________
_________________________________
```
