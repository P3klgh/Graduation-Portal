'use client'

import React, { useState } from 'react'
import { supabase, RSVPData } from '@/lib/supabase'
import { sendRSVPEmail } from '@/lib/emailjs'
import { toast } from 'react-toastify'

// Regex patterns for validation
const NAME_REGEX = /^[A-Za-zÀ-ÿ\s'-]+$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/

export default function RSVPForm() {
  const [formData, setFormData] = useState<RSVPData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Validation functions
  const validateName = (name: string): boolean => {
    if (!name.trim()) return false
    return NAME_REGEX.test(name.trim())
  }

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) return false
    return EMAIL_REGEX.test(email.trim())
  }

  const validatePhone = (phone: string): boolean => {
    if (!phone.trim()) return false
    // Remove all non-digit characters except + for validation
    const cleanPhone = phone.replace(/[^\d+]/g, '')
    return PHONE_REGEX.test(cleanPhone) && cleanPhone.length >= 10
  }

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!validateName(formData.first_name || '')) {
      newErrors.first_name = 'First name must contain only letters, spaces, hyphens, and apostrophes'
    }

    if (!validateName(formData.last_name || '')) {
      newErrors.last_name = 'Last name must contain only letters, spaces, hyphens, and apostrophes'
    }

    if (!validateEmail(formData.email || '')) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!validatePhone(formData.phone || '')) {
      newErrors.phone = 'Please enter a valid phone number (minimum 10 digits)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let fieldError = ''

    switch (name) {
      case 'first_name':
        if (!validateName(value)) {
          fieldError = 'First name must contain only letters, spaces, hyphens, and apostrophes'
        }
        break
      case 'last_name':
        if (!validateName(value)) {
          fieldError = 'Last name must contain only letters, spaces, hyphens, and apostrophes'
        }
        break
      case 'email':
        if (!validateEmail(value)) {
          fieldError = 'Please enter a valid email address'
        }
        break
      case 'phone':
        if (!validatePhone(value)) {
          fieldError = 'Please enter a valid phone number (minimum 10 digits)'
        }
        break
    }

    if (fieldError) {
      setErrors(prev => ({ ...prev, [name]: fieldError }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('❌ Please fix the validation errors before submitting.')
      return
    }
    
    setIsSubmitting(true)

    try {
      // Check if Supabase is available
      if (!supabase) {
        toast.error('❌ Database connection not configured. Please contact the administrator.')
        return
      }

      // Check if user already exists (anti-spam feature)
      const { data: existingUser, error: checkError } = await supabase
        .from('rsvp_submissions')
        .select('id, created_at')
        .eq('email', formData.email)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking for existing user:', checkError)
        throw new Error(`Database error: ${checkError.message}`)
      }

      if (existingUser) {
        // User already exists - show message with original submission date
        const originalDate = new Date(existingUser.created_at).toLocaleDateString()
        toast.info(`ℹ️ You have already RSVP'd to this event on ${originalDate}. Thank you for your interest!`)
        
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: ''
        })
        return
      }

      // Insert RSVP data into Supabase
      const { error } = await supabase
        .from('rsvp_submissions')
        .insert([formData])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        
        // Check if it's a duplicate email error (constraint violation)
        if (error.code === '23505' && error.message.includes('unique_email')) {
          toast.info('ℹ️ You have already RSVP\'d to this event. Thank you for your interest!')
          
          // Reset form
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: ''
          })
          return
        }
        
        throw new Error(`Database error: ${error.message}`)
      }

      // RSVP saved successfully

      // Send confirmation email to the user (only for new submissions)
      const emailResult = await sendRSVPEmail({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        graduation_date: 'August 2nd, 2025'
      })

      if (emailResult.success) {
        toast.success('🎓 Thank you for your RSVP! You will receive a confirmation email shortly.')
        
        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: ''
        })
      } else {
        console.error('Email error:', emailResult.error)
        if (emailResult.error?.includes('not configured')) {
          toast.success('🎓 Thank you for your RSVP! Your submission has been saved. Email notifications are not configured at this time.')
        } else {
          toast.warning('⚠️ RSVP submitted successfully, but there was an issue sending the confirmation email.')
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(`❌ ${error instanceof Error ? error.message : 'There was an error submitting your RSVP. Please try again.'}`)
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
            onBlur={handleInputBlur}
            placeholder="Write your first name"
            required
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: errors.first_name ? '1px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '5px',
              width: '100%',
              fontSize: '0.9em'
            }}
          />
          {errors.first_name && (
            <div style={{ color: '#ff6b6b', fontSize: '0.8em', marginTop: '0.25rem' }}>
              {errors.first_name}
            </div>
          )}
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
            onBlur={handleInputBlur}
            placeholder="Write your last name"
            required
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: errors.last_name ? '1px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '5px',
              width: '100%',
              fontSize: '0.9em'
            }}
          />
          {errors.last_name && (
            <div style={{ color: '#ff6b6b', fontSize: '0.8em', marginTop: '0.25rem' }}>
              {errors.last_name}
            </div>
          )}
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
            onBlur={handleInputBlur}
            placeholder="Write your e-mail address"
            required
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: errors.email ? '1px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '5px',
              width: '100%',
              fontSize: '0.9em'
            }}
          />
          {errors.email && (
            <div style={{ color: '#ff6b6b', fontSize: '0.8em', marginTop: '0.25rem' }}>
              {errors.email}
            </div>
          )}
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
            onBlur={handleInputBlur}
            placeholder="Write your Phone Number"
            required
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: errors.phone ? '1px solid #ff6b6b' : '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '5px',
              width: '100%',
              fontSize: '0.9em'
            }}
          />
          {errors.phone && (
            <div style={{ color: '#ff6b6b', fontSize: '0.8em', marginTop: '0.25rem' }}>
              {errors.phone}
            </div>
          )}
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