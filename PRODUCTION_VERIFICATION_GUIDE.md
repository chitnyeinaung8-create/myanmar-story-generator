# Production Verification & Troubleshooting Guide

Complete guide for verifying production deployment and troubleshooting issues.

---

## Pre-Deployment Verification

Before deploying to Vercel, verify everything works locally:

### Step 1: Local Build Test

```bash
cd /home/ubuntu/myanmar-story-generator

# Install dependencies
pnpm install

# Run all tests
pnpm test
# Expected: 74 tests passing ✅

# Check TypeScript
pnpm check
# Expected: No errors ✅

# Build for production
pnpm build
# Expected: Build successful, dist/ created ✅
```

### Step 2: Verify Configuration Files

```bash
# Check vercel.json exists
cat vercel.json
# Should show build command, rewrites, headers

# Check api/trpc.ts exists
ls -la api/trpc.ts
# Should exist and be readable

# Check server/db.ts uses PostgreSQL
grep "drizzle-orm/node-postgres" server/db.ts
# Should find the import
```

### Step 3: Verify Environment Variables

```bash
# Check .env file (if exists)
cat .env
# Should NOT contain sensitive data
# Should be in .gitignore

# Verify no hardcoded API keys
grep -r "AIzaSy" . --exclude-dir=node_modules
grep -r "gsk_" . --exclude-dir=node_modules
# Should return nothing (keys only in env vars)
```

---

## Post-Deployment Verification

After deploying to Vercel, follow this checklist:

### Step 1: Homepage Verification

**URL:** `https://your-project.vercel.app`

- [ ] Page loads without errors
- [ ] See "Create Viral Myanmar Stories Instantly" heading
- [ ] See "Get Started Free" button
- [ ] See "View Examples" button
- [ ] Navigation works
- [ ] No console errors (F12 → Console tab)

### Step 2: Database Connection Test

**Test:** Generate a story and verify it's saved

1. Click "Get Started Free"
2. Fill form:
   - Type: "Romance"
   - Tone: "Heartwarming"
   - Platform: "TikTok"
   - Length: "Medium"
   - Topic: "Love story"
3. Click "Generate Story"
4. Wait 30-60 seconds
5. Verify story appears

**Expected outcome:**
- Story displays in Myanmar Unicode
- Cover image generated
- No error messages

**If failed:**
- Check Vercel logs (see "Checking Logs" section below)
- Verify DATABASE_URL in Vercel environment variables
- Verify Neon database is active

### Step 3: Story History Test

**Test:** Verify story is saved to database

1. After generating a story, click "History"
2. See generated story in list
3. Click story to view details
4. Verify all fields display correctly

**Expected outcome:**
- Story appears in history
- All story details visible
- No database errors

**If failed:**
- Check Vercel logs for database errors
- Verify DATABASE_URL is correct
- Test Neon connection directly

### Step 4: LLM Integration Test

**Test:** Verify Gemini API is working

1. Generate a story (as above)
2. Verify story is in Myanmar Unicode
3. Check Vercel logs for LLM messages

**Expected log messages:**
```
[LLM] Trying gemini...
[Story] Generated story successfully
```

**If failed:**
- Verify GEMINI_API_KEY in Vercel environment variables
- Check Gemini quota: https://aistudio.google.com/app/apikey
- Try again in 1 minute (rate limit)

### Step 5: Fallback Mechanism Test

**Test:** Verify Groq fallback works

1. Generate multiple stories rapidly (5-10 stories)
2. Monitor Vercel logs
3. Look for fallback messages

**Expected behavior:**
- First few stories use Gemini
- After quota exceeded, switches to Groq
- All stories generate successfully

**Expected log messages:**
```
[LLM] Trying gemini...
[LLM] Gemini quota exceeded, trying groq...
[LLM] Trying groq...
[Story] Generated story successfully
```

**If failed:**
- Check Groq API key in Vercel environment variables
- Verify Groq account is active
- Check Groq usage: https://console.groq.com/usage

---

## Checking Vercel Logs

### Access Logs

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click "Deployments"
4. Click latest deployment
5. Click "Logs"

### Log Types

**Build Logs:**
- Shows build process
- Check for build errors
- Expected: "✓ built in X.XXs"

**Function Logs:**
- Shows runtime output
- Check for API errors
- Expected: "[Database] Connected to PostgreSQL via Neon"

**Runtime Logs:**
- Shows real-time output
- Check for request errors
- Expected: No error messages

### Common Log Messages

**Success:**
```
[Database] Connected to PostgreSQL via Neon
[LLM] Trying gemini...
[Story] Generated story successfully
[Story] Saved story with ID: 123
```

**Errors:**
```
[Database] Failed to connect: Error: ...
[LLM] Gemini API error: Invalid API key
[Story] Failed to generate: Timeout
```

---

## Troubleshooting Guide

### Issue 1: Homepage Loads But Story Generation Fails

**Symptoms:**
- Homepage displays correctly
- Clicking "Generate Story" shows loading spinner
- After 60 seconds, shows error message

**Diagnosis:**
1. Check Vercel logs for error messages
2. Verify DATABASE_URL in Vercel environment variables
3. Verify GEMINI_API_KEY in Vercel environment variables

**Solutions:**

**If error is "Database connection failed":**
```
1. Go to Vercel dashboard
2. Select project → Settings → Environment Variables
3. Verify DATABASE_URL value:
   postgresql://neondb_owner:npg_5dZNzEIuqb7p@ep-withered-sunset-aqcoz78y.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
4. Ensure value is complete (no truncation)
5. Click "Redeploy" to deploy with fixed variables
```

**If error is "Invalid API key":**
```
1. Go to https://aistudio.google.com/app/apikey
2. Create a new Gemini API key
3. Go to Vercel dashboard
4. Select project → Settings → Environment Variables
5. Update GEMINI_API_KEY with new key
6. Click "Redeploy"
```

**If error is "Request timeout":**
```
1. This is normal on free tier (rate limits)
2. Wait 1 minute and try again
3. App will automatically fallback to Groq
4. Check Gemini quota: https://aistudio.google.com/app/apikey
```

### Issue 2: Story Generation Works But Myanmar Unicode Not Displaying

**Symptoms:**
- Story generates successfully
- Text appears as boxes or gibberish
- Cover image displays correctly

**Diagnosis:**
1. Check browser support for Myanmar Unicode
2. Verify LLM response contains valid Myanmar Unicode
3. Check browser encoding settings

**Solutions:**

**Clear browser cache:**
```
1. Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Select "All time"
3. Check "Cookies and other site data"
4. Click "Clear data"
5. Reload page
```

**Check browser encoding:**
```
1. Right-click page
2. Select "Inspect" (F12)
3. Go to "Console" tab
4. Type: document.characterSet
5. Should show "UTF-8"
```

**Verify LLM response:**
```
1. Go to Vercel logs
2. Look for story content in logs
3. Check if Myanmar Unicode is present
4. If not, LLM is not generating Myanmar Unicode
```

### Issue 3: Story Saves But Doesn't Appear in History

**Symptoms:**
- Story generates successfully
- Story displays on screen
- History page is empty or story missing

**Diagnosis:**
1. Check Vercel logs for database save errors
2. Verify story ID is returned
3. Check Neon database directly

**Solutions:**

**Check Vercel logs:**
```
1. Go to Vercel dashboard
2. Click "Deployments" → Latest
3. Click "Logs"
4. Look for error messages like:
   - "Failed to save story"
   - "Database error"
   - "Invalid story ID"
```

**Check Neon database:**
```
1. Go to https://console.neon.tech
2. Select your project
3. Click "SQL Editor"
4. Run: SELECT COUNT(*) FROM stories;
5. Should show number of stories
6. Run: SELECT * FROM stories ORDER BY createdAt DESC LIMIT 1;
7. Should show latest story
```

**Verify story save logic:**
```
1. Check server/routers.ts for save logic
2. Verify story.save procedure returns story ID
3. Check server/db.ts saveStory function
4. Ensure ID is extracted correctly from PostgreSQL response
```

### Issue 4: Gemini Quota Exceeded But Groq Not Working

**Symptoms:**
- Story generation fails after several stories
- Error message: "Gemini quota exceeded"
- Groq fallback doesn't work

**Diagnosis:**
1. Check GROQ_API_KEY in Vercel environment variables
2. Verify Groq account is active
3. Check Groq usage limits

**Solutions:**

**Verify Groq API key:**
```
1. Go to https://console.groq.com/keys
2. Create new API key if needed
3. Go to Vercel dashboard
4. Update GROQ_API_KEY environment variable
5. Click "Redeploy"
```

**Check Groq usage:**
```
1. Go to https://console.groq.com/usage
2. Check if account is rate-limited
3. Check if quota is exceeded
4. Wait 1 hour and try again
```

**Test Groq directly:**
```
1. Go to Vercel logs
2. Look for Groq API calls
3. Check for error messages
4. Verify Groq response format
```

### Issue 5: Build Fails on Vercel

**Symptoms:**
- Deployment shows "Failed"
- Build logs show errors
- Previous deployment still live

**Diagnosis:**
1. Check build logs for specific errors
2. Verify all dependencies installed
3. Check for TypeScript errors

**Solutions:**

**Check build logs:**
```
1. Go to Vercel dashboard
2. Click "Deployments" → Failed deployment
3. Click "Build Logs"
4. Look for error messages
5. Common errors:
   - "pnpm: command not found"
   - "TypeScript error"
   - "Module not found"
```

**Fix common build errors:**

**If "pnpm: command not found":**
```
1. Go to Vercel project settings
2. Verify "Install Command": pnpm install
3. Verify "Build Command": pnpm run build
4. Click "Redeploy"
```

**If "TypeScript error":**
```
1. Run locally: pnpm check
2. Fix TypeScript errors
3. Commit and push to GitHub
4. Vercel will auto-redeploy
```

**If "Module not found":**
```
1. Run locally: pnpm install
2. Verify package.json has all dependencies
3. Commit package.json changes
4. Push to GitHub
5. Vercel will auto-redeploy
```

---

## Performance Verification

### Page Load Time

**Test:** Measure homepage load time

1. Open DevTools (F12)
2. Go to "Network" tab
3. Reload page
4. Check "Finish" time at bottom

**Expected:** < 3 seconds

**If slower:**
- Check Vercel function performance
- Check database query performance
- Implement caching

### Story Generation Time

**Test:** Measure story generation time

1. Open DevTools (F12)
2. Go to "Network" tab
3. Click "Generate Story"
4. Monitor request time

**Expected:** 30-60 seconds (including LLM processing)

**If slower:**
- Check LLM API response time
- Check database save time
- Check Vercel function execution time

### Database Query Performance

**Test:** Check database query performance

1. Go to Neon console: https://console.neon.tech
2. Click "SQL Editor"
3. Run: EXPLAIN ANALYZE SELECT * FROM stories WHERE userId = 1;
4. Check execution time

**Expected:** < 100ms

**If slower:**
- Add indexes to frequently queried columns
- Optimize query logic
- Check for N+1 queries

---

## Security Verification

### API Key Security

**Verify:**
- [ ] No API keys in source code
- [ ] No API keys in git history
- [ ] API keys only in Vercel environment variables
- [ ] API keys not exposed in logs

**Check:**
```bash
# Search for hardcoded keys
grep -r "AIzaSy" . --exclude-dir=node_modules
grep -r "gsk_" . --exclude-dir=node_modules
# Should return nothing
```

### Database Security

**Verify:**
- [ ] DATABASE_URL uses SSL/TLS
- [ ] Connection pooling configured
- [ ] No SQL injection vulnerabilities
- [ ] Proper error handling (no sensitive data in errors)

**Check:**
```
DATABASE_URL should include: sslmode=require
```

### CORS Security

**Verify:**
- [ ] CORS headers configured
- [ ] Only allowed origins can access API
- [ ] Credentials properly handled

**Check:**
```bash
# Test CORS
curl -H "Origin: https://example.com" \
     -H "Access-Control-Request-Method: POST" \
     https://your-project.vercel.app/api/trpc
```

---

## Monitoring Checklist

**Daily:**
- [ ] Check Vercel dashboard for errors
- [ ] Monitor API usage (Gemini & Groq)
- [ ] Check database storage usage

**Weekly:**
- [ ] Review Vercel logs for patterns
- [ ] Check performance metrics
- [ ] Verify all features working

**Monthly:**
- [ ] Review cost breakdown
- [ ] Plan for scaling if needed
- [ ] Update dependencies

---

## Emergency Procedures

### If Production is Down

1. **Check Vercel Status**
   - Go to https://vercel.com/status
   - Check if Vercel has issues

2. **Check Deployment Status**
   - Go to Vercel dashboard
   - Check latest deployment status
   - Redeploy if needed

3. **Check Logs**
   - View Vercel function logs
   - Look for error messages
   - Check database connectivity

4. **Rollback**
   - Go to Vercel dashboard
   - Click "Deployments"
   - Select previous successful deployment
   - Click "Promote to Production"

### If Database is Down

1. **Check Neon Status**
   - Go to https://console.neon.tech
   - Check database status
   - Check connection limits

2. **Verify Connection String**
   - Go to Vercel environment variables
   - Verify DATABASE_URL is correct
   - Test connection: `psql <DATABASE_URL>`

3. **Restart Connection Pool**
   - Redeploy to Vercel (creates new connection pool)
   - Or wait 5 minutes (connection pool resets)

### If APIs Are Down

1. **Check API Status**
   - Gemini: https://status.cloud.google.com
   - Groq: https://console.groq.com/status

2. **Check API Keys**
   - Verify keys in Vercel environment variables
   - Check if keys are expired
   - Create new keys if needed

3. **Monitor Usage**
   - Check if quota exceeded
   - Check if rate-limited
   - Wait for quota reset

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Vercel Support:** https://vercel.com/support
- **Neon Docs:** https://neon.tech/docs
- **Neon Support:** https://neon.tech/support
- **Gemini API:** https://ai.google.dev/docs
- **Groq API:** https://console.groq.com/docs

---

**Production deployment verified and ready! ✅**
