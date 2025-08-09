# Keep Supabase Database Active - Troubleshooting Guide

## 🎯 Overview

The "Keep Supabase Database Active" GitHub Actions workflow is designed to prevent your Supabase database from going to sleep due to inactivity (common with free tier projects). It does this by making a simple HTTP request to your deployed application every 3 days.

## 🔧 How It Works

1. **Scheduled Execution**: Runs every 3 days at 2 AM UTC
2. **Ping Endpoint**: Makes a GET request to `/api/ping`
3. **Database Query**: The endpoint queries the `Location` table to keep the database active
4. **Status Reporting**: Returns success/failure status with timing information

## ❌ Common Issues & Solutions

### 1. Missing APP_URL Secret

**Error**: `APP_URL secret is not set in repository settings`

**Solution**:
1. Go to your GitHub repository
2. Click on **Settings** tab
3. Go to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `APP_URL`
6. Value: Your deployed application URL (e.g., `https://yourapp.vercel.app`)

### 2. Wrong APP_URL Format

**Error**: HTTP 404 or connection errors

**Common Issues**:
- ❌ `https://yourapp.vercel.app/api/ping` (includes /api/ping)
- ❌ `yourapp.vercel.app` (missing protocol)
- ❌ `http://yourapp.vercel.app` (wrong protocol for production)

**Correct Format**:
- ✅ `https://yourapp.vercel.app` (without /api/ping, workflow adds it)

### 3. Application Not Deployed

**Error**: Connection timeout or DNS resolution errors

**Solution**:
- Ensure your application is deployed and accessible
- Test manually by visiting your app URL in a browser
- Check your deployment platform (Vercel, Netlify, etc.) for issues

### 4. Database Connection Issues

**Error**: HTTP 500 with database-related error messages

**Solution**:
1. Check your Supabase project status
2. Verify environment variables are set correctly in your deployment
3. Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured

### 5. API Endpoint Issues

**Error**: HTTP 404 for `/api/ping`

**Solution**:
- Verify the file exists at `app/api/ping/route.ts`
- Check that your deployment includes the API routes
- Ensure Next.js is configured correctly for API routes

## 🧪 Testing Locally

### Method 1: Using the Test Script

```bash
# Test localhost (if running dev server)
node scripts/test-ping.js

# Test your deployed app
node scripts/test-ping.js https://yourapp.vercel.app/api/ping
```

### Method 2: Using curl

```bash
# Test localhost
curl -v http://localhost:3000/api/ping

# Test deployed app
curl -v https://yourapp.vercel.app/api/ping
```

### Method 3: Browser

Visit `https://yourapp.vercel.app/api/ping` in your browser. You should see a JSON response like:

```json
{
  "status": "ok",
  "timestamp": "2025-01-09T10:30:00.000Z",
  "message": "Database is active and responding",
  "responseTime": "150ms",
  "locationCount": 25,
  "service": "AGA Health Foundation Survey",
  "version": "1.0.0"
}
```

## 🔄 Manual Workflow Trigger

You can manually trigger the workflow to test it:

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Keep Supabase Database Active** workflow
4. Click **Run workflow** button
5. Click **Run workflow** to confirm

## 📊 Monitoring

### Successful Run
- ✅ Green checkmark in Actions tab
- Response shows `"status": "ok"`
- Database query completes successfully

### Failed Run
- ❌ Red X in Actions tab
- Check the workflow logs for specific error messages
- Use the troubleshooting steps above

## 🛠️ Advanced Configuration

### Changing Schedule

Edit `.github/workflows/keep-alive.yml`:

```yaml
on:
  schedule:
    # Every day at 3 AM UTC
    - cron: '0 3 * * *'
    
    # Every 12 hours
    - cron: '0 */12 * * *'
    
    # Every Monday at 9 AM UTC
    - cron: '0 9 * * 1'
```

### Adding More Health Checks

You can modify `app/api/ping/route.ts` to include additional checks:

```typescript
// Check multiple tables
const [locationCount, submissionCount] = await Promise.all([
  supabase.from("Location").select("*", { count: "exact", head: true }),
  supabase.from("SurveySubmission").select("*", { count: "exact", head: true })
]);
```

## 🆘 Still Having Issues?

1. **Check GitHub Actions logs** for detailed error messages
2. **Test the ping endpoint manually** using the methods above
3. **Verify your deployment** is working correctly
4. **Check Supabase dashboard** for any service issues
5. **Review environment variables** in your deployment platform

## 📝 Workflow Status

The workflow runs every 3 days and should show:
- 🟢 **Success**: Database is being kept active
- 🔴 **Failure**: Needs attention (follow troubleshooting steps)
- ⚪ **Skipped**: Workflow is disabled or has issues

Remember: This workflow is essential for free tier Supabase projects to prevent database hibernation!
