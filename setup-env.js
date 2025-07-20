#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎓 Graduation Portal Environment Setup\n');

// Check if .env.local already exists
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
  fs.copyFileSync(envPath, envPath + '.backup');
}

// Create environment template
const envTemplate = `# Graduation Portal Environment Variables
# Copy this file to .env.local and fill in your actual values

# Supabase Configuration
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# EmailJS Configuration
# Get these from your EmailJS dashboard
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id

# Optional: Custom graduation details
NEXT_PUBLIC_GRADUATION_DATE=2025-08-02T09:00:00
NEXT_PUBLIC_GRADUATION_LOCATION=Star Brisbane
`;

// Write the template
fs.writeFileSync(envPath, envTemplate);

console.log('✅ Created .env.local template');
console.log('\n📋 Next steps:');
console.log('1. Open .env.local and fill in your actual values');
console.log('2. Get Supabase credentials from: https://supabase.com/dashboard');
console.log('3. Get EmailJS credentials from: https://dashboard.emailjs.com');
console.log('4. Run "npm run dev" to test locally');
console.log('5. Follow DEPLOYMENT.md to deploy to production');
console.log('\n🔗 Helpful links:');
console.log('- Supabase Setup: https://supabase.com/docs/guides/getting-started');
console.log('- EmailJS Setup: https://www.emailjs.com/docs/rest-api/send/');
console.log('- Vercel Deployment: https://vercel.com/docs'); 