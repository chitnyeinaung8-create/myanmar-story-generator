# Free Tier AI Setup Guide

This guide explains how to migrate from Manus paid LLM to completely free AI providers with zero cost.

## Problem

Your app hit the Manus free tier quota limit (412 error: "usage exhausted"). You need unlimited free AI access.

## Solution

We've configured your app to use **Google Gemini API** (free tier) with **Groq API** as automatic fallback.

### Why These Providers?

| Provider | Free Tier | Speed | Quality | Best For |
|----------|-----------|-------|---------|----------|
| **Google Gemini** | 15 req/min, 1M tokens/month | Fast | Excellent | Primary (recommended) |
| **Groq** | Unlimited requests | Very Fast | Good | Fallback (always works) |
| **Manus Forge** | Limited quota | Fast | Excellent | Fallback if both free fail |

## Step 1: Get Free API Keys

### Google Gemini API (Recommended - Primary)

1. Go to: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select your project (or create new)
4. Copy the API key
5. Save it somewhere safe

**Free Tier Limits:**
- 15 requests per minute
- 1 million tokens per month
- Sufficient for ~300-500 stories/month

### Groq API (Fallback - Unlimited)

1. Go to: https://console.groq.com/keys
2. Sign up with email
3. Click **"Create API Key"**
4. Copy the API key
5. Save it somewhere safe

**Free Tier Limits:**
- Unlimited requests
- Unlimited tokens
- Perfect fallback

## Step 2: Configure Environment Variables

Add these to your deployment platform:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

### For Manus Deployment

Use the Secrets panel in Management UI:

1. Click **Settings** → **Secrets**
2. Add `GEMINI_API_KEY` with your Gemini key
3. Add `GROQ_API_KEY` with your Groq key
4. Save and redeploy

### For Vercel / Railway / Render

Add environment variables in your deployment dashboard:

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add `GEMINI_API_KEY` and `GROQ_API_KEY`
3. Redeploy

**Railway:**
1. Go to Variables
2. Add `GEMINI_API_KEY` and `GROQ_API_KEY`
3. Redeploy

**Render:**
1. Go to Environment
2. Add `GEMINI_API_KEY` and `GROQ_API_KEY`
3. Redeploy

## Step 3: How It Works

The app now uses this priority:

```
1. Try Gemini API (free tier)
   ↓ (if fails)
2. Try Groq API (unlimited fallback)
   ↓ (if both fail)
3. Fall back to Manus Forge (if configured)
```

**Result:** Your app will almost never fail due to quota limits.

## Step 4: Test It

1. Restart your app
2. Click "Create Story"
3. Fill in the form
4. Click "Generate"
5. Check the server logs for: `[Stories] Using free tier LLM (Gemini/Groq)`

If you see that message, you're using free tier! ✅

## Step 5: Deploy to Free Hosting (Optional)

If you want to completely remove Manus costs, deploy to free hosting:

### Option A: Vercel (Recommended for React apps)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your GitHub repo
5. Add environment variables (GEMINI_API_KEY, GROQ_API_KEY)
6. Deploy

**Free Tier:** 100GB bandwidth/month, unlimited deployments

### Option B: Railway (Recommended for full-stack)

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Select your repo
5. Add environment variables
6. Deploy

**Free Tier:** $5 credit/month (usually enough for small projects)

### Option C: Render (Recommended for Node.js)

1. Go to https://render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub
5. Select your repo
6. Add environment variables
7. Deploy

**Free Tier:** Spins down after 15 minutes of inactivity (but restarts instantly)

## Cost Breakdown

| Component | Cost |
|-----------|------|
| Gemini API (free tier) | $0 |
| Groq API (free tier) | $0 |
| Vercel hosting | $0 |
| Railway hosting | $0 (with $5 credit) |
| Render hosting | $0 |
| **Total** | **$0** |

## Troubleshooting

### "GEMINI_API_KEY not configured"

**Solution:** Add the environment variable to your deployment platform and redeploy.

### "All LLM providers failed"

**Solution:** 
1. Check both API keys are correct
2. Check you haven't exceeded rate limits (wait 1 minute for Gemini)
3. Check internet connection
4. Try Groq key alone to verify it works

### "Groq API quota exceeded"

**Solution:** Groq free tier is generous but can have temporary limits. Wait a few minutes and try again.

### "Story generation is slow"

**Solution:** 
- Gemini free tier has 15 req/min limit
- If you're generating many stories, wait between requests
- Groq is faster - it will kick in if Gemini is rate-limited

## Advanced: Monitoring Usage

Add this to your server logs to track API usage:

```typescript
console.log(`[LLM] Used ${response.tokensUsed} tokens with ${response.provider}`);
```

This helps you understand which provider is being used and token consumption.

## FAQ

**Q: Can I use both Gemini and Groq?**
A: Yes! The app automatically tries Gemini first, then Groq if Gemini fails. This gives you maximum reliability.

**Q: What if I exceed Gemini's 1M tokens/month?**
A: Groq will automatically take over. You have unlimited fallback.

**Q: Is free tier quality good enough?**
A: Yes! Gemini 1.5 Flash and Groq's Mixtral are excellent for story generation.

**Q: Can I go back to Manus?**
A: Yes! Just don't set GEMINI_API_KEY or GROQ_API_KEY, and it will use Manus automatically.

**Q: How do I know which provider is being used?**
A: Check server logs for `[Stories] Using free tier LLM` or `[LLM] Trying gemini` / `[LLM] Trying groq`.

## Support

If you have issues:

1. Check that API keys are correct
2. Verify environment variables are set
3. Check server logs for error messages
4. Try with just one provider first (e.g., just Groq)
5. If still stuck, regenerate API keys and try again

## Next Steps

1. ✅ Get Gemini API key
2. ✅ Get Groq API key
3. ✅ Add environment variables
4. ✅ Restart app
5. ✅ Test story generation
6. ✅ (Optional) Deploy to free hosting

You're now on completely free tier! 🎉
