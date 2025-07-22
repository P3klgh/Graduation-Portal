import emailjs from '@emailjs/browser'

// Initialize EmailJS
const initializeEmailJS = () => {
  try {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    if (publicKey && publicKey !== 'placeholder_key') {
      emailjs.init(publicKey)
      return true
    }
    return false
  } catch (error) {
    console.warn('Failed to initialize EmailJS:', error)
    return false
  }
}

const emailjsInitialized = initializeEmailJS()

// Simple EmailJS send function with error handling
const sendEmail = async (serviceID: string, templateID: string, templateParams: any, userID: string) => {
  try {
    if (!emailjsInitialized) {
      throw new Error('EmailJS not initialized')
    }
    
    const response = await emailjs.send(serviceID, templateID, templateParams, userID)
    return { success: true, response }
  } catch (error) {
    console.error('EmailJS send error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendRSVPConfirmation = async (data: {
  first_name: string
  last_name: string
  email: string
  graduation_date?: string
}) => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceID || !templateID || !userID || 
      serviceID === 'placeholder_service' || 
      templateID === 'placeholder_template' || 
      userID === 'placeholder_key') {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  const templateParams = {
    to_name: `${data.first_name} ${data.last_name}`,
    to_email: data.email,
    graduation_date: data.graduation_date || 'TBD',
    message: `Thank you for RSVPing to our graduation ceremony! We'll keep you updated with all the details.`
  }

  return await sendEmail(serviceID, templateID, templateParams, userID)
}

export const sendBulkNotification = async (emails: string[], message: string, subject: string) => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceID || !templateID || !userID || 
      serviceID === 'placeholder_service' || 
      templateID === 'placeholder_template' || 
      userID === 'placeholder_key') {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  const promises = emails.map(email => {
    const templateParams = {
      to_email: email,
      subject: subject,
      message: message
    }
    return sendEmail(serviceID, templateID, templateParams, userID)
  })
  
  try {
    const responses = await Promise.all(promises)
    return { success: true, responses }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const sendReminderEmail = async (data: {
  first_name: string
  last_name: string
  email: string
  graduation_date?: string
}) => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceID || !templateID || !userID || 
      serviceID === 'placeholder_service' || 
      templateID === 'placeholder_template' || 
      userID === 'placeholder_key') {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  const templateParams = {
    to_name: `${data.first_name} ${data.last_name}`,
    to_email: data.email,
    graduation_date: data.graduation_date || 'TBD',
    message: `This is a friendly reminder that Kenneth's Graduation Ceremony is coming up! Please make sure to mark your calendar and arrive on time.`
  }

  return await sendEmail(serviceID, templateID, templateParams, userID)
}

export const sendAdminNotification = async (data: {
  first_name: string
  last_name: string
  email: string
  phone?: string
}) => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  if (!serviceID || !templateID || !userID || 
      serviceID === 'placeholder_service' || 
      templateID === 'placeholder_template' || 
      userID === 'placeholder_key') {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  const templateParams = {
    to_name: 'Kenneth',
    to_email: 'kenneth.agent.bot@gmail.com',
    graduation_date: 'August 2nd, 2025',
    message: `New RSVP received from ${data.first_name} ${data.last_name} (${data.email})${data.phone ? ` - Phone: ${data.phone}` : ''}. Total RSVPs can be viewed in the admin dashboard.`
  }

  return await sendEmail(serviceID, templateID, templateParams, userID)
} 