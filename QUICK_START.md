# Quick Start: Deploy to Vercel in 5 Minutes

**Prerequisites:**
- GitHub account (username: `chitnyeinaung8-create`)
- Vercel account (free at https://vercel.com)
- Gemini API key (free at https://aistudio.google.com/app/apikey)
- Groq API key (free at https://console.groq.com/keys)
- Neon PostgreSQL URL (already provided)

---

## Step 1: Create GitHub Repository (2 min)

```bash
# 1. Go to https://github.com/new
# 2. Name: myanmar-story-generator
# 3. Visibility: Public
# 4. Create repository

# 5. Then run these commands:
cd /home/ubuntu/myanmar-story-generator
git remote remove origin
git remote add origin https://github.com/chitnyeinaung8-create/myanmar-story-generator.git
git branch -M main
git push -u origin main
```

**Expected:** Code appears on GitHub at https://github.com/chitnyeinaung8-create/myanmar-story-generator

---

## Step 2: Deploy to Vercel (2 min)

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select **`myanmar-story-generator`** repository
4. Click **"Deploy"** (Vercel auto-detects settings)

---

## Step 3: Add Environment Variables (1 min)

Before deployment completes, Vercel shows "Environment Variables" section.

Add these three variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_5dZNzEIuqb7p@ep-withered-sunset-aqcoz78y.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=<paste your key here>
GROQ_API_KEY=<paste your key here>
```

Click **"Deploy"** and wait 2-5 minutes.

---

## Step 4: Test Live App (1 min)

1. Vercel shows your live URL (e.g., `https://myanmar-story-generator.vercel.app`)
2. Click the URL to open your app
3. Click **"Create Story"** and generate a test story
4. Verify story appears in **Myanmar Unicode**

---

## 🎉 Done!

Your app is now live and costs **$0/month**.

**Automatic Updates:**
- Every `git push` to GitHub automatically deploys to Vercel
- No manual deployment needed

---

## Troubleshooting

**"Database connection failed"**
- Check DATABASE_URL in Vercel settings
- Verify Neon database is active

**"Invalid API key"**
- Double-check Gemini and Groq keys
- Ensure keys are not expired

**"Story generation timeout"**
- Normal on free tier (has rate limits)
- Wait 30 seconds and try again
- App automatically falls back to Groq if Gemini quota exceeded

---

**Full guide:** See `MANUAL_DEPLOYMENT_GUIDE.md`
**Checklist:** See `DEPLOYMENT_CHECKLIST.md`
