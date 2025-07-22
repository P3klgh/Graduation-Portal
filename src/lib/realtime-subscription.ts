import { supabase } from './supabase'
import { sendAdminNotification } from './emailjs'

export const setupRSVPSubscription = () => {
  if (!supabase) {
    console.warn('Supabase not configured - cannot setup real-time subscription')
    return null
  }

  console.log('Setting up real-time RSVP subscription...')

  try {
    const subscription = supabase
      .channel('rsvp_submissions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rsvp_submissions'
        },
        async (payload) => {
                  try {
          console.log('New RSVP detected:', payload.new)
          
          const { first_name, last_name, email, phone } = payload.new as any
          
          // Only send admin notification if EmailJS is properly configured
          const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
          const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
          const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
          
          if (serviceId && templateId && publicKey && 
              serviceId !== 'placeholder_service' && 
              templateId !== 'placeholder_template' && 
              publicKey !== 'placeholder_key') {
            
            // Send admin notification
            const adminResult = await sendAdminNotification({
              first_name,
              last_name,
              email,
              phone
            })
            
            if (adminResult.success) {
              console.log('Admin notification sent successfully')
            } else {
              console.error('Failed to send admin notification:', adminResult.error)
            }
          } else {
            console.log('EmailJS not configured - skipping admin notification')
          }
        } catch (error) {
          console.error('Error in real-time subscription handler:', error)
        }
        }
      )
      .subscribe()

    return subscription
  } catch (error) {
    console.error('Error setting up real-time subscription:', error)
    return null
  }
}

export const cleanupRSVPSubscription = (subscription: any) => {
  if (subscription) {
    console.log('Cleaning up RSVP subscription...')
    supabase?.removeChannel(subscription)
  }
} 