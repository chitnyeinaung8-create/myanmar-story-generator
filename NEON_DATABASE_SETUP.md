# Free-Tier Database Setup with Neon PostgreSQL

## Why Neon?
- **Free tier:** 3 projects, unlimited queries, 3GB storage
- **PostgreSQL:** Industry standard, works perfectly with Drizzle ORM
- **No credit card required:** Completely free
- **Auto-scaling:** Handles traffic spikes automatically

## Step 1: Create Neon Account
1. Go to https://console.neon.tech
2. Sign up with GitHub or email
3. Create a new project (free tier)

## Step 2: Get Connection String
1. In Neon console, click your project
2. Click "Connection string"
3. Copy the PostgreSQL connection string (looks like: `postgresql://user:password@host/dbname`)

## Step 3: Update Environment Variables
The connection string will be set as `DATABASE_URL` in Vercel deployment.

## Step 4: Migrate Database Schema
When deployed to Vercel, the database schema will be created automatically using Drizzle migrations.

## Free Tier Limits
- 3 projects
- 3 GB storage
- Unlimited queries
- Auto-suspend after 7 days of inactivity (wakes up on connection)
- Perfect for development and small production apps

## Alternative Free Databases
If you prefer alternatives:
- **Supabase:** PostgreSQL with auth, realtime (https://supabase.com)
- **PlanetScale:** MySQL serverless (https://planetscale.com)
- **MongoDB Atlas:** NoSQL (https://www.mongodb.com/cloud/atlas)

All are free tier friendly!
