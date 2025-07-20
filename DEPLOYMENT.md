# Deployment Guide for Graduation Portal

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)
**Best for Next.js apps with Supabase and EmailJS**

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account
   - Click "New Project"
   - Import your graduation portal repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   In Vercel Dashboard → Settings → Environment Variables, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   EMAILJS_PRIVATE_KEY=your_emailjs_private_key
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id
   ```

4. **Deploy**: Vercel will give you a URL like `your-project.vercel.app`

5. **Custom Domain**: Connect `thekencave.com` in Vercel settings

### Option 2: Netlify
**Alternative platform with good Next.js support**

1. **Push to GitHub**
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
3. **Add environment variables** in Netlify dashboard
4. **Deploy and connect domain**

### Option 3: Railway
**Great for full-stack apps with databases**

1. **Push to GitHub**
2. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
3. **Add environment variables**
4. **Deploy and get URL**

## 🔧 Pre-Deployment Checklist

### ✅ Environment Variables
Make sure you have these set up:

1. **Supabase** (from your Supabase project dashboard):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **EmailJS** (from your EmailJS dashboard):
   - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
   - `EMAILJS_PRIVATE_KEY`
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`

### ✅ Database Setup
1. Run the SQL commands from `database-setup.sql` in your Supabase SQL editor
2. Test the RSVP form locally to ensure database connection works

### ✅ EmailJS Setup
1. Create an EmailJS account
2. Set up email service (Gmail, Outlook, etc.)
3. Create email templates for:
   - RSVP confirmation
   - Bulk notifications
4. Test email functionality locally

## 🌐 Domain Configuration

### Using thekencave.com
1. **DNS Settings**: Point your domain to your deployment platform
2. **SSL Certificate**: Most platforms provide automatic SSL
3. **Subdomain Option**: Consider using `graduation.thekencave.com` or `rsvp.thekencave.com`

### DNS Configuration Examples

**For Vercel:**
```
Type: CNAME
Name: graduation (or rsvp)
Value: your-project.vercel.app
```

**For Netlify:**
```
Type: CNAME
Name: graduation (or rsvp)
Value: your-site.netlify.app
```

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to Git
2. **Supabase RLS**: Enable Row Level Security in Supabase
3. **EmailJS**: Use private keys only on the server side
4. **Rate Limiting**: Consider adding rate limiting for form submissions

## 📊 Monitoring & Analytics

1. **Vercel Analytics**: Built-in analytics with Vercel
2. **Google Analytics**: Add GA4 tracking
3. **Supabase Dashboard**: Monitor database usage
4. **EmailJS Dashboard**: Track email delivery

## 🚀 Post-Deployment

1. **Test the live site**:
   - Submit test RSVP
   - Check email confirmation
   - Test admin dashboard
   - Verify CSV export

2. **Share the URL**:
   - Main RSVP page: `https://your-domain.com`
   - Admin dashboard: `https://your-domain.com/admin`

3. **Monitor performance**:
   - Check loading times
   - Monitor error rates
   - Track user engagement

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check environment variables are set
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection**:
   - Verify Supabase URL and keys
   - Check RLS policies
   - Test database queries

3. **Email Issues**:
   - Verify EmailJS credentials
   - Check email service configuration
   - Test email templates

4. **Domain Issues**:
   - Check DNS propagation (can take 24-48 hours)
   - Verify SSL certificate
   - Test both www and non-www versions

## 📱 Mobile Optimization

Your site is already mobile-responsive with the Aerial template, but verify:
- Form inputs work on mobile
- Admin dashboard is usable on tablets
- Email templates look good on mobile

## 🎉 Success!

Once deployed, your graduation portal will be:
- ✅ Live and accessible worldwide
- ✅ Connected to Supabase database
- ✅ Sending email notifications
- ✅ Mobile-responsive
- ✅ Beautiful with the Aerial template

**Your graduation portal will be ready for your guests to RSVP! 🎓** 