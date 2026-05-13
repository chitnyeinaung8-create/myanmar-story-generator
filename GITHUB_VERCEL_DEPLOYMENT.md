# Complete GitHub & Vercel Deployment Guide

This guide walks you through deploying the Myanmar Story Generator to GitHub and Vercel with zero cost using free-tier services.

---

## Prerequisites

Before starting, ensure you have:

- ✅ **GitHub Account** - https://github.com (free)
- ✅ **Vercel Account** - https://vercel.com (free)
- ✅ **Neon PostgreSQL URL** - Already provided: `postgresql://neondb_owner:npg_5dZNzEIuqb7p@ep-withered-sunset-aqcoz78y.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require`
- ✅ **Gemini API Key** - Get free at https://aistudio.google.com/app/apikey
- ✅ **Groq API Key** - Get free at https://console.groq.com/keys

---

## Phase 1: GitHub Repository Setup

### Step 1.1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name:** `myanmar-story-generator`
   - **Description:** "AI-powered Myanmar Unicode story generator for viral social media content"
   - **Visibility:** Public (recommended for free tier)
   - **Initialize repository:** Leave unchecked (we'll push existing code)
3. Click **"Create repository"**

### Step 1.2: Push Code to GitHub

GitHub will show you push commands. Execute these in your terminal:

```bash
# Navigate to project directory
cd /home/ubuntu/myanmar-story-generator

# Remove old remote (Manus internal)
git remote remove origin

# Add GitHub as new remote
git remote add origin https://github.com/chitnyeinaung8-create/myanmar-story-generator.git

# Rename branch to main (if needed)
git branch -M main

# Push all commits to GitHub
git push -u origin main
```

**Expected output:**
```
Enumerating objects: ...
Counting objects: ...
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### Step 1.3: Verify GitHub Repository

1. Go to https://github.com/chitnyeinaung8-create/myanmar-story-generator
2. Confirm you see all project files:
   - `client/` - React frontend
   - `server/` - Express backend with tRPC
   - `drizzle/` - Database schema and migrations
   - `package.json` - Dependencies
   - `vercel.json` - Vercel configuration
   - `api/trpc.ts` - Serverless handler

---

## Phase 2: Vercel Deployment

### Step 2.1: Connect Vercel to GitHub

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. You'll be asked to authorize Vercel to access GitHub:
   - Click **"Authorize Vercel"**
   - Grant permissions to access repositories
4. Search for and select **`myanmar-story-generator`** repository

### Step 2.2: Configure Vercel Project

After selecting the repository, Vercel shows the import screen:

**Framework Preset:** Select **"Other"** (auto-detected)

**Project Settings:**
- **Project Name:** `myanmar-story-generator`
- **Root Directory:** `./` (default)

**Build Settings:**
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### Step 2.3: Add Environment Variables

Before clicking "Deploy", Vercel shows an "Environment Variables" section.

Add these three critical variables:

#### Database Configuration
```
DATABASE_URL=postgresql://neondb_owner:npg_5dZNzEIuqb7p@ep-withered-sunset-aqcoz78y.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### LLM API Keys (Free Tier)
```
GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
GROQ_API_KEY=<YOUR_GROQ_API_KEY>
```

**How to get API keys:**

**Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy the key and paste into Vercel

**Groq API Key:**
1. Go to https://console.groq.com/keys
2. Click **"Create API Key"**
3. Copy the key and paste into Vercel

### Step 2.4: Deploy to Vercel

1. After adding environment variables, click **"Deploy"**
2. Vercel will build and deploy your project (takes 2-5 minutes)
3. You'll see a **"Congratulations"** message with your live URL

**Your live URL will be:** `https://myanmar-story-generator.vercel.app` (or similar)

---

## Phase 3: Post-Deployment Verification

### Step 3.1: Test the Live Application

1. Open your Vercel URL in a browser
2. You should see the Myanmar Story Generator homepage
3. Click **"Get Started Free"** or **"Create Story"** to test the form

### Step 3.2: Verify Database Connection

1. In the app, try generating a story:
   - **Type:** "Romance"
   - **Tone:** "Heartwarming"
   - **Platform:** "TikTok"
   - **Length:** "Medium"
   - **Topic:** "Love story"

2. Check that the story is saved and appears in **"History"**

3. If you see errors, check Vercel logs:
   - Go to https://vercel.com/dashboard
   - Select your project
   - Click **"Deployments"** → Latest deployment → **"Logs"**

### Step 3.3: Verify LLM Integration

1. Generate a test story with the form
2. Verify the story is generated in **Myanmar Unicode**
3. Verify the cover image is generated and displayed

### Step 3.4: Verify Free Tier Fallback

The app uses:
- **Primary:** Google Gemini API (free tier: 15 req/min, 1M tokens/month)
- **Fallback:** Groq API (unlimited free tier)

If Gemini quota is exceeded, the app automatically switches to Groq. You can test this by:
1. Generating multiple stories rapidly
2. Monitoring Vercel logs for fallback messages

---

## Phase 4: Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Verify DATABASE_URL in Vercel environment variables
2. Ensure Neon database is active: https://console.neon.tech
3. Check that IP whitelist allows Vercel IPs (Neon allows all by default)
4. Restart the Vercel deployment:
   - Go to **Deployments** → Latest → Click **"Redeploy"**

### Issue: "Invalid API key" for Gemini or Groq

**Solution:**
1. Verify API keys are correct in Vercel environment variables
2. Check that keys are not expired or revoked
3. Ensure keys have correct permissions:
   - **Gemini:** Should have access to `generativeai.googleapis.com`
   - **Groq:** Should have access to chat completions API
4. Redeploy after updating keys

### Issue: "Story generation timeout"

**Solution:**
1. This is normal on free tier (has rate limits)
2. The app automatically retries with fallback provider
3. Wait 30 seconds and try again
4. If persistent, check Vercel logs for quota errors

### Issue: "Myanmar Unicode not displaying"

**Solution:**
1. Ensure browser supports Myanmar Unicode (all modern browsers do)
2. Clear browser cache and reload
3. Check that the LLM response contains valid Myanmar Unicode
4. Verify in Vercel logs that the story was generated correctly

---

## Phase 5: Continuous Deployment

Your Vercel project is now set up with **automatic deployments**:

- Every push to `main` branch on GitHub automatically deploys to Vercel
- Deployments take 2-5 minutes
- Previous deployments are preserved (can rollback if needed)

To deploy changes:
```bash
cd /home/ubuntu/myanmar-story-generator
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically build and deploy!

---

## Phase 6: Monitoring & Optimization

### Monitor API Usage

**Gemini API:**
- Go to https://aistudio.google.com/app/apikey
- Check usage under **"Quota"** section
- Free tier: 60 requests per minute

**Groq API:**
- Go to https://console.groq.com/usage
- Check usage dashboard
- Free tier: Unlimited (rate-limited)

### Set Up Alerts (Optional)

1. In Vercel dashboard, go to **"Settings"** → **"Notifications"**
2. Enable deployment failure notifications
3. Add your email for alerts

### Enable Vercel Analytics (Optional)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **"Settings"** → **"Analytics"**
4. Enable **"Web Analytics"** for free tier

---

## Phase 7: Custom Domain (Optional)

If you want a custom domain instead of `vercel.app`:

1. Go to Vercel project **"Settings"** → **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

---

## Summary

✅ **GitHub Repository:** https://github.com/chitnyeinaung8-create/myanmar-story-generator
✅ **Live Application:** https://myanmar-story-generator.vercel.app
✅ **Database:** Neon PostgreSQL (free tier: 3GB storage)
✅ **LLM:** Gemini (primary) + Groq (fallback) - both free tier
✅ **Hosting:** Vercel (free tier)
✅ **Total Cost:** **$0/month**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Myanmar Story Generator                   │
│                    (Vercel Serverless)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼───────┐ ┌──▼──────┐ ┌──▼──────┐
        │   Frontend    │ │ tRPC    │ │ Neon    │
        │  (React 19)   │ │ Server  │ │ Postgres│
        │  (Tailwind 4) │ │ (Express)│ │ (Free)  │
        └───────────────┘ └────┬────┘ └────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼──────┐ ┌─▼──────┐ ┌─▼──────┐
            │   Gemini     │ │  Groq  │ │ Image  │
            │   API        │ │  API   │ │ Gen    │
            │   (Primary)  │ │(Fallback)│(Built-in)
            │   (Free)     │ │ (Free) │ │        │
            └──────────────┘ └────────┘ └────────┘
```

---

## Support & Documentation

- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **Gemini API:** https://ai.google.dev/docs
- **Groq API:** https://console.groq.com/docs
- **Drizzle ORM:** https://orm.drizzle.team/docs

---

**Happy deploying! 🚀**

Your Myanmar Story Generator is now production-ready and costs **$0/month**.
