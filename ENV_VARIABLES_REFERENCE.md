# Environment Variables Reference

Complete guide to all environment variables required for the Myanmar Story Generator.

---

## Required Variables for Vercel Deployment

### 1. Database Configuration

**Variable:** `DATABASE_URL`

**Purpose:** PostgreSQL connection string for Neon database

**Value:**
```
postgresql://neondb_owner:npg_5dZNzEIuqb7p@ep-withered-sunset-aqcoz78y.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Where to add:**
- Vercel Dashboard → Project Settings → Environment Variables
- Add as: `DATABASE_URL` = (paste the value above)

**Notes:**
- This is the production database
- SSL is required (`sslmode=require`)
- Free tier: 3GB storage, 1 project

---

### 2. LLM API Keys (Free Tier)

#### Gemini API Key

**Variable:** `GEMINI_API_KEY`

**Purpose:** Google Gemini API for primary story generation

**How to get:**
1. Go to https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Select **"Create API key in new project"**
4. Copy the generated key

**Where to add:**
- Vercel Dashboard → Project Settings → Environment Variables
- Add as: `GEMINI_API_KEY` = (paste your key)

**Free tier limits:**
- 60 requests per minute
- 1 million tokens per month
- Unlimited projects

**Example format:**
```
AIzaSyD...xyz (typically starts with AIzaSy)
```

#### Groq API Key

**Variable:** `GROQ_API_KEY`

**Purpose:** Groq API for fallback story generation (unlimited free tier)

**How to get:**
1. Go to https://console.groq.com/keys
2. Click **"Create API Key"**
3. Copy the generated key

**Where to add:**
- Vercel Dashboard → Project Settings → Environment Variables
- Add as: `GROQ_API_KEY` = (paste your key)

**Free tier limits:**
- Unlimited requests (rate-limited)
- No monthly token limit
- Perfect as fallback provider

**Example format:**
```
gsk_...xyz (typically starts with gsk_)
```

---

## Optional: Auto-Injected Variables (Manus Environment)

These variables are automatically injected by the Manus platform when running in the Manus environment. You do NOT need to add them manually for Vercel deployment.

| Variable | Purpose | Source |
|----------|---------|--------|
| `JWT_SECRET` | Session cookie signing | Manus platform |
| `VITE_APP_ID` | OAuth application ID | Manus platform |
| `OAUTH_SERVER_URL` | OAuth backend URL | Manus platform |
| `VITE_OAUTH_PORTAL_URL` | OAuth login portal | Manus platform |
| `OWNER_OPEN_ID` | Owner's OAuth ID | Manus platform |
| `OWNER_NAME` | Owner's name | Manus platform |
| `BUILT_IN_FORGE_API_URL` | Manus built-in APIs | Manus platform |
| `BUILT_IN_FORGE_API_KEY` | Manus API key | Manus platform |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend API key | Manus platform |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend API URL | Manus platform |

---

## Environment Variable Setup Checklist

### Pre-Deployment

- [ ] **Neon Database URL** - Copied and ready
  - [ ] URL format verified: `postgresql://...`
  - [ ] SSL mode enabled: `sslmode=require`

- [ ] **Gemini API Key** - Created and copied
  - [ ] Key format verified: Starts with `AIzaSy`
  - [ ] Key is not expired
  - [ ] Quota limits understood (60 req/min)

- [ ] **Groq API Key** - Created and copied
  - [ ] Key format verified: Starts with `gsk_`
  - [ ] Key is not expired
  - [ ] Unlimited free tier confirmed

### During Vercel Deployment

- [ ] **Add DATABASE_URL**
  - [ ] Vercel Environment Variables section
  - [ ] Value: `postgresql://neondb_owner:npg_5dZNzEIuqb7p@ep-withered-sunset-aqcoz78y.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require`

- [ ] **Add GEMINI_API_KEY**
  - [ ] Vercel Environment Variables section
  - [ ] Value: Your Gemini API key

- [ ] **Add GROQ_API_KEY**
  - [ ] Vercel Environment Variables section
  - [ ] Value: Your Groq API key

### Post-Deployment

- [ ] **Verify Variables in Vercel**
  - [ ] Go to Project Settings → Environment Variables
  - [ ] Confirm all three variables are listed
  - [ ] Values are masked (security feature)

- [ ] **Test Database Connection**
  - [ ] Generate a test story
  - [ ] Verify story is saved to Neon
  - [ ] Check Vercel logs for connection success

- [ ] **Test LLM Integration**
  - [ ] Generate a story with Gemini
  - [ ] Verify story is in Myanmar Unicode
  - [ ] Check Vercel logs for API calls

- [ ] **Test Fallback Mechanism**
  - [ ] Generate multiple stories rapidly
  - [ ] Monitor Vercel logs for Groq fallback
  - [ ] Verify fallback works if Gemini quota exceeded

---

## Troubleshooting Environment Variables

### Issue: "Database connection failed"

**Cause:** DATABASE_URL is incorrect or missing

**Solution:**
1. Verify DATABASE_URL in Vercel settings
2. Ensure URL includes `sslmode=require`
3. Check Neon console for connection status
4. Redeploy after fixing

### Issue: "Invalid API key" for Gemini

**Cause:** GEMINI_API_KEY is incorrect, expired, or missing

**Solution:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Update GEMINI_API_KEY in Vercel
4. Redeploy the project

### Issue: "Invalid API key" for Groq

**Cause:** GROQ_API_KEY is incorrect, expired, or missing

**Solution:**
1. Go to https://console.groq.com/keys
2. Create a new API key
3. Update GROQ_API_KEY in Vercel
4. Redeploy the project

### Issue: "Story generation timeout"

**Cause:** API rate limit or quota exceeded

**Solution:**
1. Check Gemini quota: https://aistudio.google.com/app/apikey
2. Check Groq usage: https://console.groq.com/usage
3. Wait 1 minute and try again
4. App will automatically fallback to Groq if Gemini quota exceeded

---

## Security Best Practices

### DO:
- ✅ Use Vercel's Environment Variables section (encrypted at rest)
- ✅ Never commit `.env` files to GitHub
- ✅ Rotate API keys regularly
- ✅ Use separate keys for development and production
- ✅ Monitor API usage for suspicious activity

### DON'T:
- ❌ Hardcode API keys in source code
- ❌ Share API keys in chat, email, or public channels
- ❌ Use the same API key across multiple projects
- ❌ Commit environment files to version control
- ❌ Log API keys in error messages

---

## Cost Breakdown (Free Tier)

| Service | Cost | Limits |
|---------|------|--------|
| **Vercel Hosting** | $0 | Unlimited deployments, 100 GB bandwidth/month |
| **Neon PostgreSQL** | $0 | 3 GB storage, 1 project |
| **Gemini API** | $0 | 60 requests/min, 1M tokens/month |
| **Groq API** | $0 | Unlimited (rate-limited) |
| **Image Generation** | $0 | Built-in (included with Manus) |
| **Total** | **$0/month** | Perfect for MVP & testing |

---

## Next Steps

1. ✅ Create Gemini API key
2. ✅ Create Groq API key
3. ✅ Add all three variables to Vercel
4. ✅ Deploy to Vercel
5. ✅ Test story generation
6. ✅ Monitor API usage

---

## Support

- **Vercel Env Vars:** https://vercel.com/docs/projects/environment-variables
- **Neon Connection:** https://neon.tech/docs/connect/connection-details
- **Gemini API:** https://ai.google.dev/docs
- **Groq API:** https://console.groq.com/docs

---

**Questions?** Check the troubleshooting section above or refer to the main deployment guide.
