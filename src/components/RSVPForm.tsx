'use client'

import React, { useState } from 'react'
import { supabase, RSVPData } from '@/lib/supabase'
import { sendRSVPConfirmation, sendReminderEmail, sendAdminNotification } from '@/lib/emailjs'

export default function RSVPForm() {
  const [formData, setFormData] = useState<RSVPData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Check if Supabase is available
      if (!supabase) {
        console.warn('Supabase not configured - skipping database save')
        console.log('Environment check:')
        console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
        console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
        setMessage({
          type: 'error',
          text: 'Database connection not configured. Please contact the administrator.'
        })
        return
      }

      // Insert RSVP data into Supabase
      const { data, error } = await supabase
        .from('rsvp_submissions')
        .insert([formData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('RSVP saved to database:', data)

      // Send confirmation email to the user
      const emailResult = await sendRSVPConfirmation({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        graduation_date: '2025-08-02'
      })

      // Send admin notification email
      try {
        const adminResult = await sendAdminNotification({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone
        })

        console.log('Admin notification result:', adminResult)
      } catch (error) {
        console.error('Error sending admin notification:', error)
        // Don't fail the form submission if admin notification fails
      }

      if (emailResult.success) {
        // Send reminder email (scheduled for 1 week before graduation)
        const reminderResult = await sendReminderEmail({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          graduation_date: '2025-08-02'
        })

        if (reminderResult.success) {
          setMessage({
            type: 'success',
            text: 'Thank you for your RSVP! You will receive a confirmation email shortly and a reminder email one week before the event.'
          })
        } else {
          console.error('Reminder email error:', reminderResult.error)
          if (reminderResult.error === 'EmailJS not configured. Please set up EmailJS environment variables.') {
            setMessage({
              type: 'success',
              text: 'Thank you for your RSVP! Your submission has been saved. Email notifications are not configured at this time.'
            })
          } else {
            setMessage({
              type: 'success',
              text: 'Thank you for your RSVP! You will receive a confirmation email shortly.'
            })
          }
        }
        
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: ''
        })
      } else {
        console.error('Email error:', emailResult.error)
        if (emailResult.error === 'EmailJS not configured. Please set up EmailJS environment variables.') {
          setMessage({
            type: 'success',
            text: 'Thank you for your RSVP! Your submission has been saved. Email notifications are not configured at this time.'
          })
        } else {
          setMessage({
            type: 'error',
            text: 'RSVP submitted successfully, but there was an issue sending the confirmation email.'
          })
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'There was an error submitting your RSVP. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rsvp-form" style={{ 
      background: 'rgba(0, 0, 0, 0.8)', 
      borderRadius: '10px', 
      padding: '1rem', 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      maxWidth: '500px',
      width: '100%',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.3em', color: 'white', fontWeight: 'bold' }}>
        RSVP for Graduation 2025
      </h3>
      
      {message && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '0.75rem',
          borderRadius: '5px',
          backgroundColor: message.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          border: `1px solid ${message.type === 'success' ? '#4CAF50' : '#F44336'}`,
          color: message.type === 'success' ? '#4CAF50' : '#F44336',
          fontSize: '0.9em'
        }}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="first_name" style={{ display: 'block', marginBottom: '0.25rem', color: 'white', fontSize: '0.9em' }}>
            First name*
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="Write your first name"
            required
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '5px',
              width: '100%',
              fontSize: '0.9em'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="last_name" style={{ display: 'block', marginBottom: '0.25rem', color: 'white', fontSize: '0.9em' }}>
            Last name*
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Write your last name"
            required
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '5px',
              width: '100%',
              fontSize: '0.9em'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.25rem', color: 'white', fontSize: '0.9em' }}>
            Email address*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Write your e-mail address"
            required
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '5px',
              width: '100%',
              fontSize: '0.9em'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.25rem', color: 'white', fontSize: '0.9em' }}>
            Phone Number*
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Write your Phone Number"
            required
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '5px',
              width: '100%',
              fontSize: '0.9em'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '0.5rem 1.5rem',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            fontSize: '1em',
            marginTop: '0.5rem'
          }}
          onMouseOver={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }
          }}
          onMouseOut={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  )
} 