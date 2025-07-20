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
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Graduation Date', 'Plus One', 'Plus One Name', 'Dietary Restrictions', 'Created At']
    const csvContent = [
      headers.join(','),
      ...rsvps.map(rsvp => [
        rsvp.first_name,
        rsvp.last_name,
        rsvp.email,
        rsvp.phone || '',
        rsvp.graduation_date || '',
        rsvp.plus_one ? 'Yes' : 'No',
        rsvp.plus_one_name || '',
        rsvp.dietary_restrictions || '',
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
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Admin Dashboard</h2>
          
          {message && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
              {message.text}
            </div>
          )}

          {/* Statistics */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">{rsvps.length}</h5>
                  <p className="card-text">Total RSVPs</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">{rsvps.filter(r => r.plus_one).length}</h5>
                  <p className="card-text">With Guests</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">{rsvps.filter(r => r.dietary_restrictions).length}</h5>
                  <p className="card-text">Dietary Restrictions</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <button className="btn btn-outline-primary" onClick={exportToCSV}>
                    📊 Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Form */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Send Bulk Notification</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSendNotification}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="notificationSubject" className="form-label">Subject*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="notificationSubject"
                      value={notificationSubject}
                      onChange={(e) => setNotificationSubject(e.target.value)}
                      placeholder="Notification subject"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Recipients</label>
                    <input
                      type="text"
                      className="form-control"
                      value={`${rsvps.length} recipients`}
                      disabled
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="notificationMessage" className="form-label">Message*</label>
                  <textarea
                    className="form-control"
                    id="notificationMessage"
                    rows={4}
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sendingNotification}
                >
                  {sendingNotification ? 'Sending...' : 'Send Notification'}
                </button>
              </form>
            </div>
          </div>

          {/* RSVP List */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">RSVP Submissions</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Graduation Date</th>
                      <th>Plus One</th>
                      <th>Dietary Restrictions</th>
                      <th>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map((rsvp) => (
                      <tr key={rsvp.id}>
                        <td>{rsvp.first_name} {rsvp.last_name}</td>
                        <td>{rsvp.email}</td>
                        <td>{rsvp.phone || '-'}</td>
                        <td>{rsvp.graduation_date || '-'}</td>
                        <td>
                          {rsvp.plus_one ? (
                            <span className="badge bg-success">Yes{rsvp.plus_one_name ? ` (${rsvp.plus_one_name})` : ''}</span>
                          ) : (
                            <span className="badge bg-secondary">No</span>
                          )}
                        </td>
                        <td>{rsvp.dietary_restrictions || '-'}</td>
                        <td>{new Date(rsvp.created_at!).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 