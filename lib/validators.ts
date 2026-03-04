// Input validation utilities
export interface EmailFormData {
  userEmail: string
  userFirstName: string
  referredUserName: string
  courseName: string
  currency: string
  referralAmount: string
  recipientEmail: string
}

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validateFormData(data: EmailFormData): void {
  if (!data.userEmail || !validateEmail(data.userEmail)) {
    throw new ValidationError('userEmail', 'Invalid user email address')
  }

  if (!data.recipientEmail || !validateEmail(data.recipientEmail)) {
    throw new ValidationError('recipientEmail', 'Invalid recipient email address')
  }

  if (!data.userFirstName || data.userFirstName.trim().length < 2) {
    throw new ValidationError('userFirstName', 'User first name must be at least 2 characters')
  }

  if (!data.referredUserName || data.referredUserName.trim().length < 2) {
    throw new ValidationError('referredUserName', 'Referred user name must be at least 2 characters')
  }

  if (!data.courseName || data.courseName.trim().length < 2) {
    throw new ValidationError('courseName', 'Course name must be at least 2 characters')
  }

  if (!data.currency || !['USD', 'EUR', 'GBP'].includes(data.currency)) {
    throw new ValidationError('currency', 'Invalid currency')
  }

  const amount = parseFloat(data.referralAmount)
  if (isNaN(amount) || amount <= 0) {
    throw new ValidationError('referralAmount', 'Referral amount must be a positive number')
  }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
