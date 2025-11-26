# Netlify Direct Upload Instructions

## 📁 Ready for Upload

Your `dist` folder is built and ready for Netlify deployment!

## 🔧 Before You Upload

### 1. Set Environment Variables in Netlify
After uploading, you MUST set these in Netlify dashboard:

**Go to:** Site settings → Environment variables

Add these variables:
```
VITE_SUPABASE_URL=https://dvifymyoyvkxvllcbine.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aWZ5bXlveXZreHZsbGNiaW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMzc5MDMsImV4cCI6MjA3OTcxMzkwM30.VRROT9VYbZPKnABOOUlKaFi8lURLQYfE0YnRjJKmPUY
```

### 2. Setup Supabase Database
1. Go to your Supabase project: https://dvifymyoyvkxvllcbine.supabase.co
2. Open SQL Editor
3. Copy entire contents of `supabase_schema.sql`
4. Paste and click "Run"

## 📤 Upload Methods

### Method 1: Drag & Drop (Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Deploy manually"
3. Drag the entire `dist` folder onto the upload area
4. Wait for deployment
5. Set environment variables (see above)

### Method 2: Zip Upload
1. Zip the `dist` folder
2. Upload the zip file to Netlify
3. Set environment variables

## 🚀 After Upload

1. **Test Authentication**
   - Visit your Netlify URL
   - Try registering a new user
   - Check login works

2. **Verify Database**
   - Go to Supabase → Table Editor
   - Check that new users appear in `profiles` table

3. **Configure Auth URLs** (Important!)
   - In Supabase → Authentication → Settings
   - Set Site URL: `https://your-site-name.netlify.app`
   - Add Redirect URL: `https://your-site-name.netlify.app/**`

## 📁 What's in Your dist Folder

```
dist/
├── index.html          # Main HTML file
├── assets/
│   └── index-D7tOly49.js  # Compiled JavaScript
└── data/               # (empty - mock data handled in JS)
```

## ⚠️ Important Notes

- **Authentication**: ✅ Works with real Supabase
- **Other Features**: Use mock data (curriculum, tasks, events, flashcards)
- **Build Status**: ✅ Successful (422KB JS, 2.6KB HTML)
- **Environment**: Variables must be set in Netlify, not hardcoded

## 🔧 Troubleshooting

If authentication doesn't work:
1. Check environment variables are set correctly in Netlify
2. Verify Supabase project URL and keys
3. Ensure SQL schema was executed in Supabase
4. Check authentication redirect URLs in Supabase settings

## 📞 Support

- Netlify Dashboard: Your site settings after upload
- Supabase Dashboard: https://dvifymyoyvkxvllcbine.supabase.co
- Build logs: Available in Netlify site dashboard

Your app is ready to deploy! 🎉
