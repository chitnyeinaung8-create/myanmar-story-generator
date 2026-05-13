# Complete Vercel Deployment Guide - Myanmar Story Generator

## Overview
This guide walks you through deploying the Myanmar Story Generator to Vercel with free-tier services only.

**Total cost: $0/month** (Vercel free tier + Gemini API free tier + Groq API free tier + Neon PostgreSQL free tier)

---

## Prerequisites

You'll need:
1. **GitHub account** (free at https://github.com)
2. **Vercel account** (free at https://vercel.com)
3. **Google Gemini API key** (free at https://aistudio.google.com/app/apikey)
4. **Groq API key** (free at https://console.groq.com/keys)
5. **Neon PostgreSQL** (free at https://console.neon.tech)

---

## Step 1: Set Up Free-Tier Database (Neon PostgreSQL)

### 1.1 Create Neon Account
- Go to https://console.neon.tech
- Sign up with GitHub or email
- Create a new project (select "Free" tier)

### 1.2 Get Connection String
- In Neon console, click your project
- Click "Connection string" tab
- Copy the PostgreSQL URL (looks like: `postgresql://user:password@host/dbname`)
- **Save this URL** - you'll need it for Vercel environment variables

### 1.3 Verify Connection
- The database is ready immediately
- No manual schema setup needed (Drizzle handles it)

---

## Step 2: Get API Keys

### 2.1 Google Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key
4. **Save as:** `GEMINI_API_KEY`

### 2.2 Groq API Key
1. Go to https://console.groq.com/keys
2. Sign up or log in
3. Click "Create API Key"
4. Copy the key
5. **Save as:** `GROQ_API_KEY`

---

## Step 3: Export Project to GitHub

### 3.1 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `myanmar-story-generator`
3. Description: "AI-powered Myanmar story generator"
4. Select "Public" (required for Vercel free tier)
5. Click "Create repository"

### 3.2 Push Code to GitHub
```bash
cd /home/ubuntu/myanmar-story-generator

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/myanmar-story-generator.git

# Rename branch to main
git branch -M main

# Push code
git push -u origin main
```

**Note:** Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 4: Deploy to Vercel

### 4.1 Import Project
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account
4. Find and select `myanmar-story-generator`
5. Click "Import"

### 4.2 Configure Environment Variables
In the "Environment Variables" section, add:

| Variable | Value | Source |
|----------|-------|--------|
| `GEMINI_API_KEY` | Your Gemini key | From Step 2.1 |
| `GROQ_API_KEY` | Your Groq key | From Step 2.2 |
| `DATABASE_URL` | Your Neon PostgreSQL URL | From Step 1.2 |
| `NODE_ENV` | `production` | Fixed value |

### 4.3 Deploy
1. Click "Deploy"
2. Wait 3-5 minutes for build to complete
3. When done, you'll see: "Congratulations! Your project has been successfully deployed"
4. Click the URL to view your live app

---

## Step 5: Verify Deployment

### 5.1 Test Story Generation
1. Click the Vercel deployment URL
2. Click "Create Story" button
3. Fill in form:
   - Story Type: Horror
   - Topic: Haunted house
   - Tone: Suspenseful
   - Platform: TikTok
   - Length: Medium
   - Location: Myanmar
   - Characters: A family
   - Ending Type: Twist
4. Click "Generate Story"
5. Wait 10-15 seconds for story to generate
6. Verify the story appears with title, hook, story, twist, CTA, and hashtags

### 5.2 Test Story History
1. Click "History" button
2. Verify your generated story appears in the list
3. Click on it to view full details

### 5.3 Test Copy Functionality
1. In story display, click "Copy Full Story"
2. Verify toast notification appears: "Copied to clipboard!"
3. Paste in a text editor to confirm story was copied

---

## Troubleshooting

### Issue: "Failed to generate story: LLM invoke failed"
**Solution:** 
- Verify `GEMINI_API_KEY` and `GROQ_API_KEY` are set correctly in Vercel
- Check that keys have not been revoked
- Try again in 5 minutes (rate limit)

### Issue: "Database connection failed"
**Solution:**
- Verify `DATABASE_URL` is correct
- Check Neon project is active (not suspended)
- Ensure IP whitelist allows all IPs (default in Neon free tier)

### Issue: "Build failed on Vercel"
**Solution:**
- Check Vercel build logs for error details
- Ensure all environment variables are set
- Try redeploying: Click "Redeploy" in Vercel dashboard

### Issue: "Page shows blank/404"
**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Check Vercel deployment status (should show "Ready")

---

## Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth, unlimited deployments | $0 |
| Gemini API | 15 requests/min, 1M tokens/month | $0 |
| Groq API | Unlimited requests | $0 |
| Neon PostgreSQL | 3GB storage, unlimited queries | $0 |
| **Total** | | **$0** |

---

## Next Steps

### Optional Enhancements
1. **Custom Domain:** Add your own domain in Vercel settings (free DNS)
2. **Analytics:** Enable Vercel Analytics to track usage
3. **Monitoring:** Set up error notifications in Vercel

### Scaling (If Needed)
- **Vercel Pro:** $20/month (for production apps with high traffic)
- **Neon Pro:** $15/month (for larger databases)
- **Gemini API:** Paid tier available for high volume

---

## Support

For issues:
1. Check Vercel deployment logs: Dashboard → Project → Deployments → Click latest → View logs
2. Check Neon database status: https://console.neon.tech
3. Verify API keys are valid and not rate-limited

---

**Deployment complete! Your Myanmar Story Generator is now live and free! 🎉**
