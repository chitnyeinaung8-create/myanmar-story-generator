# Vercel Build Settings & Deployment Configuration

Complete guide for configuring Vercel build settings and environment variables.

---

## Vercel Project Configuration

### Step 1: Import Project on Vercel

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Authorize Vercel to access GitHub
4. Search for and select **`myanmar-story-generator`** repository

---

## Build Settings

Use these exact settings when importing the project:

### Framework & Root Directory
| Setting | Value |
|---------|-------|
| **Framework Preset** | Other (auto-detected) |
| **Project Name** | `myanmar-story-generator` |
| **Root Directory** | `./` (default) |

### Build Configuration
| Setting | Value |
|---------|-------|
| **Build Command** | `pnpm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install` |
| **Node.js Version** | 20.x (default) |

### Advanced Settings (Optional)
| Setting | Value |
|---------|-------|
| **Automatically expose System Environment Variables** | Enabled |
| **Build & Development Settings** | Override |

---

## Environment Variables

### Required Variables (MUST ADD)

Add these three variables in the Vercel dashboard before deploying:

#### 1. Database Configuration

**Variable Name:** `DATABASE_URL`

**Value:**
```
postgresql://neondb_owner:npg_5dZNzEIuqb7p@ep-withered-sunset-aqcoz78y.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Scope:** Production (default)

#### 2. Gemini API Key

**Variable Name:** `GEMINI_API_KEY`

**Value:** (Paste your Gemini API key from https://aistudio.google.com/app/apikey)

**Format:** Should start with `AIzaSy`

**Scope:** Production (default)

#### 3. Groq API Key

**Variable Name:** `GROQ_API_KEY`

**Value:** (Paste your Groq API key from https://console.groq.com/keys)

**Format:** Should start with `gsk_`

**Scope:** Production (default)

---

## Step-by-Step Vercel Setup

### Step 1: Framework Selection

```
Framework Preset: Other
Project Name: myanmar-story-generator
Root Directory: ./
```

Click **"Continue"**

### Step 2: Build Settings

```
Build Command: pnpm run build
Output Directory: dist
Install Command: pnpm install
```

Click **"Continue"**

### Step 3: Environment Variables

**Add three variables:**

1. **DATABASE_URL**
   - Name: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_5dZNzEIuqb7p@ep-withered-sunset-aqcoz78y.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - Scope: Production
   - Click **"Add"**

2. **GEMINI_API_KEY**
   - Name: `GEMINI_API_KEY`
   - Value: (Your Gemini API key)
   - Scope: Production
   - Click **"Add"**

3. **GROQ_API_KEY**
   - Name: `GROQ_API_KEY`
   - Value: (Your Groq API key)
   - Scope: Production
   - Click **"Add"**

### Step 4: Deploy

Click **"Deploy"**

Wait for build to complete (2-5 minutes)

---

## Deployment Commands

### Local Build Test

Before deploying to Vercel, test the build locally:

```bash
cd /home/ubuntu/myanmar-story-generator

# Install dependencies
pnpm install

# Run tests
pnpm test

# Check TypeScript
pnpm check

# Build for production
pnpm build
```

Expected output:
```
✓ 1773 modules transformed
✓ built in 4.27s
✓ dist/index.js 70.4kb
```

### Vercel CLI Deployment (Optional)

If you want to deploy using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## Vercel Configuration File (vercel.json)

The project includes a pre-configured `vercel.json` file:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "nodeVersion": "20.x",
  "rewrites": [
    {
      "source": "/api/trpc/:path*",
      "destination": "/api/trpc"
    },
    {
      "source": "/:path*",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/trpc",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Pragma",
          "value": "no-cache"
        },
        {
          "key": "Expires",
          "value": "0"
        }
      ]
    }
  ]
}
```

This configuration:
- Routes all `/api/trpc` requests to the serverless handler
- Disables caching for authenticated API requests
- Rewrites all other requests to `index.html` (SPA routing)

---

## Serverless Function Configuration

The project uses a serverless tRPC handler at `api/trpc.ts`:

```typescript
// api/trpc.ts - Vercel serverless function
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';
import * as trpcNext from '@trpc/server/adapters/next';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
});
```

**Key features:**
- ✅ Compatible with Vercel serverless functions
- ✅ Automatic request/response handling
- ✅ Context injection for authentication
- ✅ Error handling and logging

---

## Database Connection Pooling

For serverless deployment, the database uses connection pooling:

```typescript
// server/db.ts
const _pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Single connection for serverless
});
```

**Why max: 1?**
- Serverless functions are ephemeral
- Each function invocation gets a new connection
- Connection pooling prevents exhaustion
- Neon handles connection management

---

## Deployment Verification

### Immediate After Deployment

1. **Check Deployment Status**
   - Go to https://vercel.com/dashboard
   - Select your project
   - Latest deployment should show "Ready"

2. **View Deployment Logs**
   - Click latest deployment
   - View "Build Logs" - should show successful build
   - View "Function Logs" - check for errors

3. **Test Live URL**
   - Click the live URL (e.g., `https://myanmar-story-generator.vercel.app`)
   - Homepage should load
   - No console errors

### Post-Deployment Testing

1. **Test Story Generation**
   - Click "Get Started Free"
   - Fill form with test data
   - Click "Generate Story"
   - Wait 30-60 seconds
   - Verify story appears in Myanmar Unicode

2. **Test Database**
   - Generate a story
   - Click "History"
   - Verify story appears in list
   - Click story to view details

3. **Check Vercel Logs**
   - Go to Vercel dashboard
   - Click "Deployments" → Latest
   - View "Function Logs"
   - Look for:
     - `[Database] Connected to PostgreSQL via Neon`
     - `[LLM] Trying gemini...`
     - Story generation success message

---

## Common Deployment Issues

### Issue: Build Fails

**Error:** `Command "pnpm run build" exited with 1`

**Solution:**
1. Check build logs in Vercel dashboard
2. Verify all dependencies installed: `pnpm install`
3. Check TypeScript errors: `pnpm check`
4. Check for missing environment variables
5. Redeploy after fixing

### Issue: Database Connection Failed

**Error:** `Error: connect ECONNREFUSED`

**Solution:**
1. Verify DATABASE_URL in Vercel environment variables
2. Ensure URL includes `sslmode=require`
3. Check Neon database is active: https://console.neon.tech
4. Test connection locally: `psql <DATABASE_URL>`
5. Redeploy after fixing

### Issue: Invalid API Key

**Error:** `Error: Invalid API key`

**Solution:**
1. Verify GEMINI_API_KEY in Vercel environment variables
2. Verify GROQ_API_KEY in Vercel environment variables
3. Check keys are not expired
4. Create new keys if needed
5. Redeploy after updating

### Issue: Story Generation Timeout

**Error:** `Request timeout after 60 seconds`

**Solution:**
1. This is normal on free tier (rate limits)
2. App automatically retries with fallback
3. Wait 30 seconds and try again
4. Check API usage:
   - Gemini: https://aistudio.google.com/app/apikey
   - Groq: https://console.groq.com/usage

### Issue: Myanmar Unicode Not Displaying

**Error:** Text appears as boxes or gibberish

**Solution:**
1. Clear browser cache
2. Ensure browser supports Myanmar Unicode (all modern browsers do)
3. Check LLM response contains valid Myanmar Unicode
4. View Vercel logs for generation details

---

## Monitoring After Deployment

### Vercel Dashboard

**Monitor these metrics:**
- Build time (should be < 5 minutes)
- Deployment status (should be "Ready")
- Function execution time (should be < 2 seconds)
- Error rate (should be 0%)

### Neon Database

**Monitor these metrics:**
- Active connections (should be 1-5)
- Query performance (should be < 100ms)
- Storage usage (should be < 1 GB)

### API Usage

**Gemini API:**
- Go to https://aistudio.google.com/app/apikey
- Check "Quota" section
- Monitor requests per minute (limit: 60)
- Monitor tokens per month (limit: 1M)

**Groq API:**
- Go to https://console.groq.com/usage
- Monitor request rate
- Check for rate limit errors

---

## Scaling & Optimization

### If You Hit Free Tier Limits

**Gemini API (60 req/min limit):**
- Upgrade to paid Gemini API
- Implement request queuing
- Cache frequently generated stories
- Use Groq as primary (unlimited)

**Neon Database (3 GB limit):**
- Upgrade to Neon Pro ($15/month)
- Implement data archival
- Delete old stories periodically

**Vercel (100 GB bandwidth limit):**
- Upgrade to Vercel Pro ($20/month)
- Implement CDN caching
- Optimize image sizes

---

## Production Checklist

Before going live, verify:

- [ ] All environment variables added to Vercel
- [ ] Build successful (no errors)
- [ ] Homepage loads correctly
- [ ] Story generation works
- [ ] Database saves stories
- [ ] History page shows saved stories
- [ ] Myanmar Unicode displays correctly
- [ ] No console errors
- [ ] Vercel logs show successful requests
- [ ] API usage within free tier limits

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Environment Variables:** https://vercel.com/docs/projects/environment-variables
- **Neon Connection Guide:** https://neon.tech/docs/connect/connection-details
- **Gemini API:** https://ai.google.dev/docs
- **Groq API:** https://console.groq.com/docs

---

## Quick Reference

| Item | Value |
|------|-------|
| **Build Command** | `pnpm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `pnpm install` |
| **Node.js Version** | 20.x |
| **Required Env Vars** | 3 (DATABASE_URL, GEMINI_API_KEY, GROQ_API_KEY) |
| **Build Time** | 2-5 minutes |
| **Expected Live URL** | `https://myanmar-story-generator.vercel.app` |
| **Total Cost** | $0/month |

---

**Ready to deploy! 🚀**
