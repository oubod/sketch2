# MediSketch - Netlify + Supabase Deployment Guide

## Overview
This guide walks you through deploying the MediSketch medical study app to Netlify with Supabase as the backend database.

## Prerequisites
- Netlify account
- Supabase account
- Git repository with your code

## Step 1: Set Up Supabase Project

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name (e.g., "medisketch")
   - Set database password (save it securely)
   - Choose region closest to your users
   - Click "Create new project"

2. **Run SQL Schema**
   - In your Supabase project dashboard, go to "SQL Editor"
   - Copy the entire contents of `supabase_schema.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the schema
   - This will create all tables, indexes, RLS policies, and initial data

3. **Get API Keys**
   - Go to Project Settings → API
   - Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy the **anon public** key
   - Keep these secure - you'll need them for environment variables

## Step 2: Configure Local Environment

1. **Create Environment File**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in Your Supabase Credentials**
   ```
   # .env.local
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key # if still needed
   ```

3. **Test Locally**
   ```bash
   npm run dev
   ```
   - Verify the app loads and you can register/login

## Step 3: Deploy to Netlify

### Option A: Git Integration (Recommended)

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Add Supabase integration and deployment config"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider
   - Select your repository
   - Build settings should auto-detect:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Set Environment Variables**
   - In Netlify dashboard, go to Site settings → Environment variables
   - Add:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - Click "Save"

4. **Deploy**
   - Netlify will automatically deploy on push
   - Or click "Deploy site" manually

### Option B: CLI Deployment

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

## Step 4: Post-Deployment Configuration

1. **Authentication Settings**
   - In Supabase, go to Authentication → Settings
   - Add your Netlify site URL to "Site URL"
   - Add redirect URLs: `https://your-site.netlify.app/**`

2. **Test Your Deployed App**
   - Visit your Netlify URL
   - Try registering a new user
   - Verify login works
   - Check that user data appears in Supabase tables

## Current Limitations

**Important**: The current implementation only uses Supabase for authentication. The following features still use mock data and need to be migrated:

- **Curriculum/Lectures**: Still uses `MOCK_CURRICULUM` from constants.ts
- **Calendar Events**: Still uses `MOCK_EVENTS`  
- **Study Tasks**: Still uses `MOCK_TASKS`
- **Flashcards**: Still uses `MOCK_FLASHCARDS`
- **Repetition History**: Still uses `MOCK_HISTORY`

To fully migrate these features, you would need to:
1. Replace mock data fetching with Supabase queries
2. Add CRUD operations for user-specific data
3. Update the UI components to handle real database operations

## Security Considerations

1. **Row Level Security (RLS)**: Already configured in the schema
   - Users can only access their own data
   - Public read access for subjects/lectures content

2. **Environment Variables**: Never commit `.env.local` to Git
   - Use Netlify environment variables for production
   - Keep Supabase keys secure

3. **Database**: The schema includes proper foreign key relationships and constraints

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check that `netlify.toml` is properly configured

### Authentication Issues
- Verify Supabase URL and keys are correct
- Check that redirect URLs are properly configured in Supabase
- Ensure RLS policies are enabled

### Environment Variables
- Local: Use `.env.local` (already in .gitignore)
- Netlify: Set in Site settings → Environment variables
- Variables must start with `VITE_` for Vite to expose them

## Next Steps

1. **Migrate Mock Data**: Replace remaining mock data with Supabase queries
2. **Add Real Content**: Populate your database with actual medical content
3. **User Management**: Implement user profile editing features
4. **Backup Strategy**: Set up regular database backups in Supabase

## Support

- Netlify Docs: [docs.netlify.com](https://docs.netlify.com)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- React + Supabase Guide: Check Supabase documentation for React integration examples
