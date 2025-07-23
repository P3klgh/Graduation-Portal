# 🚀 Deployment Setup Guide

## 📋 Overview

This project includes two GitHub Actions workflows for deployment:

1. **`deploy.yml`** - Vercel deployment (recommended for Next.js)
2. **`github-pages.yml`** - GitHub Pages deployment (alternative)

## 🔧 Setup Instructions

### Option 1: Vercel Deployment (Recommended)

#### Step 1: Set up Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard

#### Step 2: Get Vercel Tokens
1. In Vercel dashboard, go to Settings → Tokens
2. Create a new token
3. Copy the token

#### Step 3: Get Project IDs
1. In Vercel dashboard, go to your project
2. Go to Settings → General
3. Copy the Project ID and Org ID

#### Step 4: Add GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
NEXT_PUBLIC_SUPABASE_URL=https://luvpxxulpvqztcqrgitu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_supabase_key
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_new_emailjs_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_yoj98ua
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_61vv0ji
NEXT_PUBLIC_GRADUATION_DATE=2025-08-02T09:00:00
NEXT_PUBLIC_GRADUATION_LOCATION=Star Brisbane
```

### Option 2: GitHub Pages Deployment

#### Step 1: Enable GitHub Pages
1. Go to your GitHub repository → Settings → Pages
2. Set Source to "GitHub Actions"

#### Step 2: Add GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
NEXT_PUBLIC_SUPABASE_URL=https://luvpxxulpvqztcqrgitu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_supabase_key
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_new_emailjs_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_yoj98ua
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_61vv0ji
NEXT_PUBLIC_GRADUATION_DATE=2025-08-02T09:00:00
NEXT_PUBLIC_GRADUATION_LOCATION=Star Brisbane
```

## 🔄 Workflow Usage

### For Vercel:
- Push to `main` branch → Automatic deployment
- Pull requests → Build test only

### For GitHub Pages:
- Push to `main` branch → Automatic deployment
- Manual trigger available via Actions tab

## ⚙️ Configuration Files

### `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  output: 'export',        // Required for GitHub Pages
  trailingSlash: true,     // Required for GitHub Pages
  images: {
    unoptimized: true      // Required for static export
  }
};
```

### Environment Variables
All environment variables are prefixed with `NEXT_PUBLIC_` because they're used on the client side.

## 🚨 Important Notes

### Security
- ✅ API keys are stored as GitHub Secrets
- ✅ No sensitive data in repository
- ✅ Environment variables are encrypted

### Build Process
- ✅ Static export for GitHub Pages compatibility
- ✅ Optimized for production
- ✅ Environment variables injected at build time

### Troubleshooting

#### Build Failures
1. Check GitHub Actions logs
2. Verify all secrets are set
3. Ensure environment variables are correct

#### Deployment Issues
1. **Vercel**: Check Vercel dashboard for errors
2. **GitHub Pages**: Check Actions tab for build status

#### Environment Variables
- All variables must be prefixed with `NEXT_PUBLIC_`
- Values are injected at build time
- Changes require a new deployment

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify environment variables
3. Ensure API keys are valid and rotated
4. Check deployment platform status

## 🔄 Updating Deployment

To update your deployment:
1. Push changes to `main` branch
2. GitHub Actions will automatically trigger
3. Monitor the Actions tab for status
4. Check your deployed site

**Remember: Always rotate API keys if they were exposed!** 🔐 