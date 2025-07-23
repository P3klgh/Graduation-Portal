import emailjs from '@emailjs/browser'

/**
 * Initialize EmailJS with the public key from environment variables
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
 * Send RSVP confirmation email to user
 * @param userData - The user's RSVP data
 * @returns Promise with success status and response/error
 */
export const sendRSVPEmail = async (userData: {
  first_name: string
  last_name: string
  email: string
  phone?: string
  graduation_date?: string
}) => {
  // Get EmailJS configuration from environment
  const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
  const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  const userID = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

  // Validate EmailJS configuration
  if (!serviceID || !templateID || !userID) {
    return { 
      success: false, 
      error: 'EmailJS not configured. Please check environment variables.' 
    }
  }

  // Check if EmailJS is initialized
  if (!emailjsInitialized) {
    return { 
      success: false, 
      error: 'EmailJS not initialized' 
    }
  }

  try {
    // Prepare email template parameters with working configuration
    const templateParams = {
      to_name: `${userData.first_name} ${userData.last_name}`,
      email: userData.email,  // This is the working email field
      graduation_date: userData.graduation_date || 'August 2nd, 2025',
      message: `Thank you for RSVPing to Kenneth's Graduation Ceremony! We're excited to celebrate this special day with you.`
    }

    // Send email using EmailJS
    const response = await emailjs.send(serviceID, templateID, templateParams, userID)
    
    return { 
      success: true, 
      response 
    }
  } catch (error) {
    console.error('EmailJS send error:', error)
    
    let errorMessage = 'Unknown error occurred'
    
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error)
    }
    
    return { 
      success: false, 
      error: errorMessage 
    }
  }
} 