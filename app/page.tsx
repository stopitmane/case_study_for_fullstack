'use client'

import { useState } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    userEmail: '',
    userFirstName: '',
    referredUserName: '',
    courseName: '',
    currency: '',
    referralAmount: '',
    recipientEmail: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Email workflow triggered successfully!' })
        setFormData({
          userEmail: '',
          userFirstName: '',
          referredUserName: '',
          courseName: '',
          currency: '',
          referralAmount: '',
          recipientEmail: ''
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to trigger workflow' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="container">
      <h1>Send Referral Email</h1>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userEmail">User Email</label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="userFirstName">User First Name</label>
          <input
            type="text"
            id="userFirstName"
            name="userFirstName"
            value={formData.userFirstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="referredUserName">Referred User Name</label>
          <input
            type="text"
            id="referredUserName"
            name="referredUserName"
            value={formData.referredUserName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="courseName">Course Name</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency</label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
          >
            <option value="">Select currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="referralAmount">Referral Amount</label>
          <input
            type="number"
            id="referralAmount"
            name="referralAmount"
            value={formData.referralAmount}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="recipientEmail">Recipient Email</label>
          <input
            type="email"
            id="recipientEmail"
            name="recipientEmail"
            value={formData.recipientEmail}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </form>
    </div>
  )
}
