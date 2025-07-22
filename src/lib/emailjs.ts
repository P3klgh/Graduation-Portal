import emailjs from '@emailjs/browser'

/**
 * Initialize EmailJS with the public key from environment variables
 * @returns {boolean} True if initialization was successful, false otherwise
 */
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

// Initialize EmailJS on module load
const emailjsInitialized = initializeEmailJS()

/**
 * Send an email using EmailJS with error handling
 * @param {string} serviceID - The EmailJS service ID
 * @param {string} templateID - The EmailJS template ID
 * @param {Record<string, string>} templateParams - Parameters to pass to the email template
 * @param {string} userID - The EmailJS public key
 * @returns {Promise<{success: boolean, response?: unknown, error?: string}>} Result object with success status and response/error
 */
const sendEmail = async (serviceID: string, templateID: string, templateParams: Record<string, string>, userID: string) => {
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

/**
 * Send a confirmation email to a user who has submitted an RSVP
 * @param {Object} data - User data for the email
 * @param {string} data.first_name - User's first name
 * @param {string} data.last_name - User's last name
 * @param {string} data.email - User's email address
 * @param {string} [data.graduation_date] - Graduation date (optional)
 * @returns {Promise<{success: boolean, response?: unknown, error?: string}>} Result object with success status and response/error
 */
export const sendRSVPConfirmation = async (data: {
  first_name: string
  last_name: string
  email: string
  graduation_date?: string
}) => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  // Check if EmailJS is properly configured
  if (!serviceID || !templateID || !userID || 
      serviceID === 'placeholder_service' || 
      templateID === 'placeholder_template' || 
      userID === 'placeholder_key') {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  // Prepare email template parameters
  const templateParams = {
    to_name: `${data.first_name} ${data.last_name}`,
    to_email: data.email,
    graduation_date: data.graduation_date || 'TBD',
    message: `Thank you for RSVPing to our graduation ceremony! We'll keep you updated with all the details.`
  }

  return await sendEmail(serviceID, templateID, templateParams, userID)
}

/**
 * Send bulk notification emails to multiple recipients
 * @param {string[]} emails - Array of email addresses to send to
 * @param {string} message - The message content to send
 * @param {string} subject - The email subject line
 * @returns {Promise<{success: boolean, responses?: unknown[], error?: string}>} Result object with success status and responses/error
 */
export const sendBulkNotification = async (emails: string[], message: string, subject: string) => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  // Check if EmailJS is properly configured
  if (!serviceID || !templateID || !userID || 
      serviceID === 'placeholder_service' || 
      templateID === 'placeholder_template' || 
      userID === 'placeholder_key') {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  // Create promises for sending emails to all recipients
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

/**
 * Send a reminder email to a user about the upcoming graduation ceremony
 * @param {Object} data - User data for the reminder email
 * @param {string} data.first_name - User's first name
 * @param {string} data.last_name - User's last name
 * @param {string} data.email - User's email address
 * @param {string} [data.graduation_date] - Graduation date (optional)
 * @returns {Promise<{success: boolean, response?: unknown, error?: string}>} Result object with success status and response/error
 */
export const sendReminderEmail = async (data: {
  first_name: string
  last_name: string
  email: string
  graduation_date?: string
}) => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  // Check if EmailJS is properly configured
  if (!serviceID || !templateID || !userID || 
      serviceID === 'placeholder_service' || 
      templateID === 'placeholder_template' || 
      userID === 'placeholder_key') {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  // Prepare email template parameters for reminder
  const templateParams = {
    to_name: `${data.first_name} ${data.last_name}`,
    to_email: data.email,
    graduation_date: data.graduation_date || 'TBD',
    message: `This is a friendly reminder that Kenneth's Graduation Ceremony is coming up! Please make sure to mark your calendar and arrive on time.`
  }

  return await sendEmail(serviceID, templateID, templateParams, userID)
}

/**
 * Send an admin notification email when a new RSVP is received
 * @param {Object} data - RSVP data for the admin notification
 * @param {string} data.first_name - RSVP submitter's first name
 * @param {string} data.last_name - RSVP submitter's last name
 * @param {string} data.email - RSVP submitter's email address
 * @param {string} [data.phone] - RSVP submitter's phone number (optional)
 * @returns {Promise<{success: boolean, response?: unknown, error?: string}>} Result object with success status and response/error
 */
export const sendAdminNotification = async (data: {
  first_name: string
  last_name: string
  email: string
  phone?: string
}) => {
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  // Check if EmailJS is properly configured
  if (!serviceID || !templateID || !userID || 
      serviceID === 'placeholder_service' || 
      templateID === 'placeholder_template' || 
      userID === 'placeholder_key') {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please set up EmailJS environment variables.' 
    }
  }

  // Prepare email template parameters for admin notification
  const templateParams = {
    to_name: 'Kenneth',
    to_email: 'kenneth.agent.bot@gmail.com',
    graduation_date: 'August 2nd, 2025',
    message: `New RSVP received from ${data.first_name} ${data.last_name} (${data.email})${data.phone ? ` - Phone: ${data.phone}` : ''}. Total RSVPs can be viewed in the admin dashboard.`
  }

  return await sendEmail(serviceID, templateID, templateParams, userID)
} 