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
    graduation_date: ''
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
      // Insert RSVP data into Supabase
      const { error } = await supabase
        .from('rsvp_submissions')
        .insert([formData])
        .select()

      if (error) throw error

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
          graduation_date: ''
        })
      } else {
        setMessage({
          type: 'error',
          text: 'RSVP submitted successfully, but there was an issue sending the confirmation email.'
        })
      }
    } catch (error) {
      console.error('Submission error:', error)
      setMessage({
        type: 'error',
        text: 'There was an error submitting your RSVP. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact-form" className="py-5">
      <div className="container bg-white shadow-lg rounded">
        <div className="row align-items-center g-md-5 top-margin">
          {/* Left Side - Contact Info */}
          <div className="col-md-6 bg-image align-content-center p-5 mt-md-0 text-white">
            <div className="d-flex mt-2 mb-5">
              <div>
                <h3 className="text-white mb-0">Graduation RSVP</h3>
              </div>
            </div>
            
            <div className="d-flex mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-white me-2" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 12q.825 0 1.413-.587T14 10t-.587-1.412T12 8t-1.412.588T10 10t.588 1.413T12 12m0 7.35q3.05-2.8 4.525-5.087T18 10.2q0-2.725-1.737-4.462T12 4T7.738 5.738T6 10.2q0 1.775 1.475 4.063T12 19.35M12 22q-4.025-3.425-6.012-6.362T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 2.5-1.987 5.438T12 22m0-12" />
              </svg>
              <p className="text-white text-capitalize m-0">University Campus, Graduation Hall</p>
            </div>
            
            <div className="d-flex mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-white me-2" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19.95 21q-3.125 0-6.175-1.362t-5.55-3.863t-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3M6.025 9l1.65-1.65L7.25 5H5.025q.125 1.025.35 2.025T6.025 9m8.95 8.95q.975.425 1.988.675T19 18.95v-2.2l-2.35-.475zm0 0" />
              </svg>
              <p className="text-white text-capitalize m-0">+1 (555) 123-4567</p>
            </div>
            
            <div className="d-flex mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-white me-2" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor" d="m15.95 22l-4.25-4.25l1.4-1.4l2.85 2.85l5.65-5.65l1.4 1.4zM12 11l8-5H4zm0 2L4 8v10h5.15l2 2H4q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v4.35l-2 2V8zm0 0" />
              </svg>
              <p className="text-white text-capitalize m-0">graduation@university.edu</p>
            </div>
            
            <div className="social-links py-3">
              <ul className="d-flex list-unstyled gap-3">
                <li className="social">
                  <a href="#" className="text-decoration-none">
                    <span className="social-icon text-light bg-light bg-opacity-25 border border-light p-2 rounded-circle fs-5">
                      📘
                    </span>
                  </a>
                </li>
                <li className="social">
                  <a href="#" className="text-decoration-none">
                    <span className="social-icon text-light bg-light bg-opacity-25 border border-light p-2 rounded-circle fs-5">
                      🐦
                    </span>
                  </a>
                </li>
                <li className="social">
                  <a href="#" className="text-decoration-none">
                    <span className="social-icon text-light bg-light bg-opacity-25 border border-light p-2 rounded-circle fs-5">
                      📷
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            
            <p className="text-white m-0">Join us for this special celebration!</p>
          </div>

          {/* Right Side - RSVP Form */}
          <div className="col-md-6 mt-5 mt-md-0 px-md-5">
            <h4 className="mb-md-5">RSVP for Graduation</h4>
            
            {message && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="row g-md-3">
              <div className="col-md-6 mb-3">
                <label htmlFor="first_name" className="form-label">First name*</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Write your first name"
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="last_name" className="form-label">Last name*</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Write your last name"
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email address*</label>
                <input
                  type="email"
                  className="form-control shadow-none"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Write your e-mail address"
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control shadow-none"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Write your Phone Number"
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="graduation_date" className="form-label">Preferred Graduation Date</label>
                <input
                  type="date"
                  className="form-control shadow-none"
                  id="graduation_date"
                  name="graduation_date"
                  value={formData.graduation_date}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="form-check mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="plus_one"
                    name="plus_one"
                    checked={formData.plus_one}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label" htmlFor="plus_one">
                    Bringing a guest?
                  </label>
                </div>
              </div>
              
              {formData.plus_one && (
                <div className="col-md-6 mb-3">
                  <label htmlFor="plus_one_name" className="form-label">Guest Name</label>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    id="plus_one_name"
                    name="plus_one_name"
                    value={formData.plus_one_name}
                    onChange={handleInputChange}
                    placeholder="Guest's full name"
                  />
                </div>
              )}
              
              <div className="col-md-12 mb-3">
                <label htmlFor="dietary_restrictions" className="form-label">Dietary Restrictions</label>
                <textarea
                  className="form-control shadow-none"
                  id="dietary_restrictions"
                  name="dietary_restrictions"
                  value={formData.dietary_restrictions}
                  onChange={handleInputChange}
                  placeholder="Any dietary restrictions or special requirements"
                  rows={3}
                />
              </div>
              
              <div className="col-12 mb-3">
                <button
                  className="btn btn-custom px-5 py-2 text-uppercase"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit RSVP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
} 