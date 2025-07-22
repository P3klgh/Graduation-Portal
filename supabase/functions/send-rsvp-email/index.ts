import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { record, old_record, eventType } = await req.json()
    
    // Only process INSERT events
    if (eventType !== 'INSERT') {
      return new Response(JSON.stringify({ message: 'Not an INSERT event' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    // Extract email data from the new record
    const { first_name, last_name, email } = record

    // EmailJS configuration
    const emailjsServiceId = Deno.env.get('EMAILJS_SERVICE_ID')
    const emailjsTemplateId = Deno.env.get('EMAILJS_TEMPLATE_ID')
    const emailjsPublicKey = Deno.env.get('EMAILJS_PUBLIC_KEY')

    if (!emailjsServiceId || !emailjsTemplateId || !emailjsPublicKey) {
      console.error('EmailJS environment variables not configured')
      return new Response(JSON.stringify({ error: 'EmailJS not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    // Send email using EmailJS
    const emailData = {
      service_id: emailjsServiceId,
      template_id: emailjsTemplateId,
      user_id: emailjsPublicKey,
      template_params: {
        to_name: `${first_name} ${last_name}`,
        to_email: email,
        graduation_date: 'August 2nd, 2025',
        message: `Thank you for RSVPing to Kenneth's Graduation Ceremony! We're excited to celebrate this special day with you. We'll keep you updated with all the details as the date approaches.`
      }
    }

    const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('EmailJS API error:', errorText)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }

    console.log(`Email sent successfully to ${email}`)
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: `Email sent to ${email}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
}) 