'use client'

import React, { useState, useEffect } from 'react'
import { supabase, RSVPData } from '@/lib/supabase'
import { sendBulkNotification } from '@/lib/emailjs'

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RSVPData[]>([])
  const [loading, setLoading] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationSubject, setNotificationSubject] = useState('')
  const [sendingNotification, setSendingNotification] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchRSVPs()
  }, [])

  const fetchRSVPs = async () => {
    try {
      if (!supabase) {
        throw new Error('Database connection not configured')
      }

      const { data, error } = await supabase
        .from('rsvp_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRsvps(data || [])
    } catch (error) {
      console.error('Error fetching RSVPs:', error)
      setMessage({
        type: 'error',
        text: 'Failed to load RSVP data'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notificationMessage.trim() || !notificationSubject.trim()) {
      setMessage({
        type: 'error',
        text: 'Please fill in both subject and message'
      })
      return
    }

    setSendingNotification(true)
    setMessage(null)

    try {
      const emails = rsvps.map(rsvp => rsvp.email)
      const result = await sendBulkNotification(
        emails,
        notificationMessage,
        notificationSubject
      )

      if (result.success) {
        setMessage({
          type: 'success',
          text: `Notification sent successfully to ${emails.length} recipients`
        })
        setNotificationMessage('')
        setNotificationSubject('')
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to send notification'
        })
      }
    } catch (error) {
      console.error('Notification error:', error)
      setMessage({
        type: 'error',
        text: 'Error sending notification'
      })
    } finally {
      setSendingNotification(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Created At']
    const csvContent = [
      headers.join(','),
      ...rsvps.map(rsvp => [
        rsvp.first_name,
        rsvp.last_name,
        rsvp.email,
        rsvp.phone || '',
        rsvp.created_at
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'graduation-rsvps.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div style={{ background: 'rgba(0, 0, 0, 0.8)', borderRadius: '10px', padding: '2rem', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
        <div style={{ color: 'white' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ background: 'rgba(0, 0, 0, 0.8)', borderRadius: '10px', padding: '2rem', backdropFilter: 'blur(10px)' }}>
      <div>
        <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: 'white' }}>Admin Dashboard</h2>
        
        {message && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        {/* Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '5px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <h5 style={{ color: 'white', margin: 0 }}>{rsvps.length}</h5>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>Total RSVPs</p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '5px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <button 
              onClick={exportToCSV}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              📊 Export CSV
            </button>
          </div>
        </div>

        {/* Notification Form */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.5rem', borderRadius: '5px', marginBottom: '2rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <h5 style={{ color: 'white', marginBottom: '1rem' }}>Send Bulk Notification</h5>
          <form onSubmit={handleSendNotification}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label htmlFor="notificationSubject" style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>Subject*</label>
                <input
                  type="text"
                  id="notificationSubject"
                  value={notificationSubject}
                  onChange={(e) => setNotificationSubject(e.target.value)}
                  placeholder="Notification subject"
                  required
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '5px',
                    width: '100%'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>Recipients</label>
                <input
                  type="text"
                  value={`${rsvps.length} recipients`}
                  disabled
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    padding: '0.75rem',
                    borderRadius: '5px',
                    width: '100%'
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="notificationMessage" style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>Message*</label>
              <textarea
                id="notificationMessage"
                rows={4}
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Enter your message here..."
                required
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '5px',
                  width: '100%',
                  resize: 'vertical'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={sendingNotification}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!sendingNotification) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                if (!sendingNotification) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }
              }}
            >
              {sendingNotification ? 'Sending...' : 'Send Notification'}
            </button>
          </form>
        </div>

        {/* RSVP List */}
        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1.5rem', borderRadius: '5px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <h5 style={{ color: 'white', marginBottom: '1rem' }}>RSVP Submissions</h5>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Phone</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Graduation Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Plus One</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Dietary Restrictions</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <td style={{ padding: '0.75rem', color: 'white' }}>{rsvp.first_name} {rsvp.last_name}</td>
                    <td style={{ padding: '0.75rem', color: 'white' }}>{rsvp.email}</td>
                    <td style={{ padding: '0.75rem', color: 'white' }}>{rsvp.phone || '-'}</td>
                    <td style={{ padding: '0.75rem', color: 'white' }}>{new Date(rsvp.created_at!).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 