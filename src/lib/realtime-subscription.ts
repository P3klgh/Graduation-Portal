import { supabase } from './supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

export const setupRSVPSubscription = (): RealtimeChannel | null => {
  if (!supabase) {
    console.warn('Supabase not configured - cannot setup real-time subscription')
    return null
  }

  // Setting up real-time RSVP subscription

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
                async () => {
          try {
            // New RSVP detected - real-time updates handled
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

export const cleanupRSVPSubscription = (subscription: RealtimeChannel | null) => {
  if (subscription) {
    // Cleaning up RSVP subscription
    supabase?.removeChannel(subscription)
  }
} 