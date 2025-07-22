// Check if EmailJS should be used at all
const shouldUseEmailJS = () => {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
  
  return serviceId && templateId && publicKey && 
    serviceId !== 'placeholder_service' && 
    templateId !== 'placeholder_template' && 
    publicKey !== 'placeholder_key'
}

// Only import EmailJS if it's properly configured
let emailjs: any = null
let emailjsInitialized = false

if (shouldUseEmailJS()) {
  try {
    emailjs = require('@emailjs/browser')
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    if (publicKey) {
      emailjs.init(publicKey)
      emailjsInitialized = true
    }
  } catch (error) {
    console.warn('EmailJS not available or failed to initialize:', error)
    emailjs = null
    emailjsInitialized = false
  }
}

// Helper function to safely send emails
const safeEmailSend = async (serviceId: string, templateId: string, templateParams: any) => {
  if (!emailjs || !emailjsInitialized) {
    throw new Error('EmailJS not available')
  }
  
  try {
    return await emailjs.send(serviceId, templateId, templateParams)
  } catch (error) {
    console.error('EmailJS send error:', error)
    throw error
  }
}

export const sendRSVPConfirmation = async (data: {
  first_name: string
  last_name: string
  email: string
  graduation_date?: string
}) => {
  // Early return if EmailJS is not available
  if (!emailjs || !emailjsInitialized) {
    console.warn('EmailJS not available - skipping email send')
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

    if (!serviceId || !templateId) {
      console.warn('EmailJS service or template not configured')
      return { 
        success: false, 
        error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
      }
    }

    const response = await safeEmailSend(
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
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendBulkNotification = async (emails: string[], message: string, subject: string) => {
  // Early return if EmailJS is not available
  if (!emailjs || !emailjsInitialized) {
    console.warn('EmailJS not available - skipping bulk email send')
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

    if (!serviceId || !templateId) {
      console.warn('EmailJS service or template not configured')
      return { 
        success: false, 
        error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
      }
    }

    const promises = emails.map(email => 
      safeEmailSend(
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
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendReminderEmail = async (data: {
  first_name: string
  last_name: string
  email: string
  graduation_date?: string
}) => {
  // Early return if EmailJS is not available
  if (!emailjs || !emailjsInitialized) {
    console.warn('EmailJS not available - skipping reminder email send')
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

    if (!serviceId || !templateId) {
      console.warn('EmailJS service or template not configured')
      return { 
        success: false, 
        error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
      }
    }

    const response = await safeEmailSend(
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
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendAdminNotification = async (data: {
  first_name: string
  last_name: string
  email: string
  phone?: string
}) => {
  // Early return if EmailJS is not available
  if (!emailjs || !emailjsInitialized) {
    console.warn('EmailJS not available - skipping admin notification')
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID

    if (!serviceId || !templateId) {
      console.warn('EmailJS service or template not configured')
      return { 
        success: false, 
        error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
      }
    }

    const response = await safeEmailSend(
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
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
} 