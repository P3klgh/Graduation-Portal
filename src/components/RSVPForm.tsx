'use client'

import React, { useState } from 'react'
import { supabase, RSVPData } from '@/lib/supabase'
import { sendRSVPConfirmation } from '@/lib/emailjs'

export default function RSVPForm() {
  const [formData, setFormData] = useState<RSVPData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dietary_restrictions: '',
    plus_one: false,
    plus_one_name: '',
    graduation_date: '2025-08-02'
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
        throw new Error('Database connection not configured')
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

      // Send confirmation email
      const emailResult = await sendRSVPConfirmation({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        graduation_date: formData.graduation_date
      })

      if (emailResult.success) {
        setMessage({
          type: 'success',
          text: 'Thank you for your RSVP! You will receive a confirmation email shortly.'
        })
        
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          dietary_restrictions: '',
          plus_one: false,
          plus_one_name: '',
          graduation_date: '2025-08-02'
        })
      } else {
        console.error('Email error:', emailResult.error)
        setMessage({
          type: 'error',
          text: 'RSVP submitted successfully, but there was an issue sending the confirmation email.'
        })
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
      padding: '1.5rem', 
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5em', color: 'white' }}>
        RSVP for Graduation 2025
      </h3>
      
      {message && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '5px',
          backgroundColor: message.type === 'success' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          border: `1px solid ${message.type === 'success' ? '#4CAF50' : '#F44336'}`,
          color: message.type === 'success' ? '#4CAF50' : '#F44336'
        }}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="first_name" style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
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
              padding: '0.75rem',
              borderRadius: '5px',
              width: '100%'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="last_name" style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
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
              padding: '0.75rem',
              borderRadius: '5px',
              width: '100%'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '0.75rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
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
              padding: '0.75rem',
              borderRadius: '5px',
              width: '100%'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', color: 'white' }}>
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
              padding: '0.75rem',
              borderRadius: '5px',
              width: '100%'
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
            padding: '0.75rem 2rem',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            fontSize: '1.1em'
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