import { createClient } from '@supabase/supabase-js'

// Only create client if environment variables are properly set and not placeholder values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set')
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set')
console.log('Full Supabase URL:', supabaseUrl)
console.log('Anon Key length:', supabaseAnonKey?.length || 0)

// Environment variables are properly configured
export const supabase = supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') && !supabaseAnonKey.includes('placeholder')
  ? createClient(supabaseUrl, supabaseAnonKey, {
      db: {
        schema: 'public'
      },
      auth: {
        persistSession: false
      },
      global: {
        headers: {
          'X-Client-Info': 'graduation-portal'
        }
      }
    })
  : null

// Additional debug logging
console.log('Supabase client created:', supabase ? 'Yes' : 'No')

export interface RSVPData {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  created_at?: string
  updated_at?: string
}

export interface NotificationData {
  id?: string
  email: string
  notification_type: 'graduation_reminder' | 'event_update' | 'general'
  sent_at?: string
  created_at?: string
} 