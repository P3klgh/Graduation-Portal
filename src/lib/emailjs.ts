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
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'placeholder_service',
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'placeholder_template',
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
    const promises = emails.map(email => 
      emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'placeholder_service',
        process.env.NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID || 'placeholder_bulk_template',
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
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'placeholder_service',
      process.env.NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID || 'placeholder_reminder_template',
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