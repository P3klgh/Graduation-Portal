# EmailJS Setup Guide

## Current Status
Your RSVP form is working perfectly - data is being saved to the database successfully! However, email notifications are not configured yet.

## To Enable Email Notifications

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Set Up Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Add a new service (Gmail, Outlook, or custom SMTP)
3. Follow the setup instructions for your email provider
4. Note down your **Service ID** (e.g., `service_yoj98ua`)

### 3. Create Email Templates
1. Go to "Email Templates" in EmailJS dashboard
2. Create a new template for RSVP confirmations
3. Use this template structure:
   ```
   To: {{to_email}}
   Subject: RSVP Confirmation - Graduation Ceremony
   
   Dear {{to_name}},
   
   Thank you for RSVPing to our graduation ceremony!
   
   Graduation Date: {{graduation_date}}
   {{message}}
   
   We'll keep you updated with all the details.
   
   Best regards,
   Graduation Committee
   ```
4. Note down your **Template ID** (e.g., `template_ebzwv3n`)

### 4. Get Your Public Key
1. In EmailJS dashboard, go to "Account" → "API Keys"
2. Copy your **Public Key** (e.g., `MMy73LryhmLhEo-0z`)

### 5. Update Environment Variables
Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://luvpxxulpvqztcqrgitu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dnB4eHVscHZxenRjcXJnaXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMzIxOTcsImV4cCI6MjA2NzkwODE5N30.TIFDlKj_xR6ec9smuj3r6CL5wibDxg1u8nwvEM_eRIQ

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
NEXT_PUBLIC_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID_HERE
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID_HERE
NEXT_PUBLIC_EMAILJS_BULK_TEMPLATE_ID=YOUR_TEMPLATE_ID_HERE
NEXT_PUBLIC_EMAILJS_REMINDER_TEMPLATE_ID=YOUR_TEMPLATE_ID_HERE
```

Replace the placeholder values with your actual EmailJS credentials.

### 6. Test Email Notifications
1. Restart your development server: `npm run dev`
2. Submit a test RSVP
3. Check if confirmation emails are sent

## Current Functionality
✅ **Database**: RSVP submissions are saved successfully  
✅ **Form**: All form fields work correctly  
✅ **UI**: Clean, responsive design  
⚠️ **Email**: Notifications need EmailJS setup  

## Alternative: Disable Email Notifications
If you don't want email notifications, the RSVP form will still work perfectly and save all submissions to the database. Users will see a success message indicating their RSVP was saved.

## Support
- EmailJS Documentation: https://www.emailjs.com/docs/
- Free tier allows 200 emails per month
- Paid plans available for higher volume 