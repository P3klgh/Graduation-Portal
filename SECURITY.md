# 🔒 Security Guidelines

## API Keys and Environment Variables

### ⚠️ IMPORTANT: Never Commit Real API Keys

**Your actual API keys should NEVER be committed to the repository.**

### ✅ Safe Environment Setup

1. **Local Development:**
   - Create `.env.local` file (already in .gitignore)
   - Add your real API keys to `.env.local` only
   - Never commit `.env.local`

2. **Production Deployment:**
   - Use environment variables in your hosting platform
   - Never hardcode keys in the code

### 🔑 Required Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

### 🚨 Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] `env.example` contains only placeholder values
- [ ] No real API keys in any committed files
- [ ] Production uses environment variables
- [ ] API keys are rotated regularly

### 🔄 If You Accidentally Exposed Keys

1. **Immediately rotate your API keys:**
   - Supabase: Regenerate anon key in dashboard
   - EmailJS: Regenerate public key in dashboard

2. **Update your `.env.local`** with new keys

3. **Check git history** and remove any commits with real keys

### 📝 Deployment Security

For GitHub Pages or other static hosting:
- Use build-time environment variables
- Never expose server-side secrets
- Consider using a backend service for sensitive operations 