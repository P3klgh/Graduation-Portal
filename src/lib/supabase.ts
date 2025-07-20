import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface RSVPData {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  dietary_restrictions?: string
  plus_one?: boolean
  plus_one_name?: string
  graduation_date?: string
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