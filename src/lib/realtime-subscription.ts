import { supabase } from './supabase'
import { sendAdminNotification } from './emailjs'

export const setupRSVPSubscription = () => {
  if (!supabase) {
    console.warn('Supabase not configured - cannot setup real-time subscription')
    return null
  }

  console.log('Setting up real-time RSVP subscription...')

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
        console.log('New RSVP detected:', payload.new)
        
        const { first_name, last_name, email, phone } = payload.new as any
        
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
      }
    )
    .subscribe()

  return subscription
}

export const cleanupRSVPSubscription = (subscription: any) => {
  if (subscription) {
    console.log('Cleaning up RSVP subscription...')
    supabase?.removeChannel(subscription)
  }
} 