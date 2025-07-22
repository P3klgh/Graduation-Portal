import emailjs from '@emailjs/browser'

// Initialize EmailJS
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'placeholder_key')

export const sendRSVPConfirmation = async (data: {
  first_name: string
  last_name: string
  email: string
  graduation_date?: string
}) => {
  try {
    // Check if EmailJS is properly configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'placeholder_service' || 
        templateId === 'placeholder_template' || 
        publicKey === 'placeholder_key') {
      console.warn('EmailJS not properly configured - skipping email send')
      return { 
        success: false, 
        error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
      }
    }

    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_name: `${data.first_name} ${data.last_name}`,
        to_email: data.email,
        graduation_date: data.graduation_date || 'TBD',
        message: `Thank you for RSVPing to our graduation ceremony! We'll keep you updated with all the details.`
      }
    )
    return { success: true, response }
  } catch (error) {
    console.error('EmailJS Error:', error)
    return { success: false, error }
  }
}

export const sendBulkNotification = async (emails: string[], message: string, subject: string) => {
  try {
    // Check if EmailJS is properly configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'placeholder_service' || 
        templateId === 'placeholder_template' || 
        publicKey === 'placeholder_key') {
      console.warn('EmailJS not properly configured - skipping bulk email send')
      return { 
        success: false, 
        error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
      }
    }

    const promises = emails.map(email => 
      emailjs.send(
        serviceId,
        templateId,
        {
          to_email: email,
          subject: subject,
          message: message
        }
      )
    )
    
    const responses = await Promise.all(promises)
    return { success: true, responses }
  } catch (error) {
    console.error('Bulk Email Error:', error)
    return { success: false, error }
  }
}

export const sendReminderEmail = async (data: {
  first_name: string
  last_name: string
  email: string
  graduation_date?: string
}) => {
  try {
    // Check if EmailJS is properly configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'placeholder_service' || 
        templateId === 'placeholder_template' || 
        publicKey === 'placeholder_key') {
      console.warn('EmailJS not properly configured - skipping reminder email send')
      return { 
        success: false, 
        error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
      }
    }

    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_name: `${data.first_name} ${data.last_name}`,
        to_email: data.email,
        graduation_date: data.graduation_date || 'TBD',
        message: `This is a friendly reminder that Kenneth's Graduation Ceremony is coming up! Please make sure to mark your calendar and arrive on time.`
      }
    )
    return { success: true, response }
  } catch (error) {
    console.error('Reminder Email Error:', error)
    return { success: false, error }
  }
}

export const sendAdminNotification = async (data: {
  first_name: string
  last_name: string
  email: string
  phone?: string
}) => {
  try {
    // Check if EmailJS is properly configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'placeholder_service' || 
        templateId === 'placeholder_template' || 
        publicKey === 'placeholder_key') {
      console.warn('EmailJS not properly configured - skipping admin notification')
      return { 
        success: false, 
        error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
      }
    }

    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        to_name: 'Kenneth',
        to_email: 'kenneth.agent.bot@gmail.com',
        graduation_date: 'August 2nd, 2025',
        message: `New RSVP received from ${data.first_name} ${data.last_name} (${data.email})${data.phone ? ` - Phone: ${data.phone}` : ''}. Total RSVPs can be viewed in the admin dashboard.`
      }
    )
    return { success: true, response }
  } catch (error) {
    console.error('Admin Notification Error:', error)
    return { success: false, error }
  }
} 