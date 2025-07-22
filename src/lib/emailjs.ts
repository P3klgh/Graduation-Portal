import emailjs from '@emailjs/browser'

// Initialize EmailJS with proper error handling
const initializeEmailJS = () => {
  try {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    if (publicKey && publicKey !== 'placeholder_key' && typeof emailjs !== 'undefined') {
      emailjs.init(publicKey)
      return true
    }
    return false
  } catch (error) {
    console.warn('Failed to initialize EmailJS:', error)
    return false
  }
}

// Initialize on module load
const emailjsInitialized = initializeEmailJS()

// Helper function to safely send emails
const safeEmailSend = async (serviceId: string, templateId: string, templateParams: any) => {
  try {
    if (typeof emailjs === 'undefined' || !emailjsInitialized) {
      throw new Error('EmailJS not available')
    }
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
  try {
    // Check if EmailJS is properly configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'placeholder_service' || 
        templateId === 'placeholder_template' || 
        publicKey === 'placeholder_key' ||
        !emailjsInitialized) {
      console.warn('EmailJS not properly configured - skipping email send')
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
  try {
    // Check if EmailJS is properly configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'placeholder_service' || 
        templateId === 'placeholder_template' || 
        publicKey === 'placeholder_key' ||
        !emailjsInitialized) {
      console.warn('EmailJS not properly configured - skipping bulk email send')
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
  try {
    // Check if EmailJS is properly configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'placeholder_service' || 
        templateId === 'placeholder_template' || 
        publicKey === 'placeholder_key' ||
        !emailjsInitialized) {
      console.warn('EmailJS not properly configured - skipping reminder email send')
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
  try {
    // Check if EmailJS is properly configured
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey || 
        serviceId === 'placeholder_service' || 
        templateId === 'placeholder_template' || 
        publicKey === 'placeholder_key' ||
        !emailjsInitialized) {
      console.warn('EmailJS not properly configured - skipping admin notification')
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