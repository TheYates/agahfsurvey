# Supabase Keep-Alive Setup Guide

This guide provides multiple options to keep your Supabase database active and prevent the 7-day inactivity pause.

## Your Keep-Alive Endpoint

Your app now has a keep-alive endpoint at: `https://your-domain.com/api/ping`

This endpoint performs a lightweight database query and returns status information.

## Setup Options

### Option 1: Vercel Cron Jobs (Recommended if using Vercel)

If you're deploying to Vercel, the `vercel.json` file is already configured to ping your database every 3 days.

**Setup:**
1. Deploy your app to Vercel
2. The cron job will automatically run every 3 days at 2 AM UTC

### Option 2: GitHub Actions (If using GitHub)

The `.github/workflows/keep-alive.yml` file is configured to run every 3 days.

**Setup:**
1. In your GitHub repository, go to Settings → Secrets and variables → Actions
2. Add a secret named `APP_URL` with your deployed app URL (e.g., `https://your-app.vercel.app`)
3. The workflow will run automatically every 3 days

### Option 3: External Monitoring Services (Free)

Use these free services to ping your endpoint every few days:

#### UptimeRobot (Free)
- Website: https://uptimerobot.com
- Free plan: 50 monitors, 5-minute intervals
- Setup: Add your `/api/ping` endpoint as an HTTP monitor
- Set check interval to every 3 days (or minimum available)

#### Pingdom (Free tier)
- Website: https://www.pingdom.com
- Free plan: 1 check, 1-minute intervals
- Setup: Create a new check for your `/api/ping` endpoint

#### StatusCake (Free)
- Website: https://www.statuscake.com
- Free plan: 10 tests, 5-minute intervals
- Setup: Add uptime test for your `/api/ping` endpoint

#### Freshping (Free)
- Website: https://www.freshworks.com/website-monitoring/
- Free plan: 50 checks, 1-minute intervals
- Setup: Add your `/api/ping` endpoint as a check

### Option 4: Manual Script

Use the `scripts/keep-alive.js` script:

**Local cron setup (Linux/Mac):**
```bash
# Edit crontab
crontab -e

# Add this line to run every 3 days at 2 AM
0 2 */3 * * /usr/bin/node /path/to/your/project/scripts/keep-alive.js
```

**Manual execution:**
```bash
# Set your app URL
export APP_URL=https://your-app.vercel.app

# Run the script
node scripts/keep-alive.js
```

## Testing Your Setup

1. **Test the endpoint manually:**
   ```bash
   curl https://your-app-domain.com/api/ping
   ```

2. **Expected response:**
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-15T10:30:00.000Z",
     "message": "Database is active",
     "responseTime": "150ms",
     "userCount": 1
   }
   ```

## Monitoring

- Check your chosen monitoring service dashboard regularly
- Look for any failed pings in your app logs
- The ping endpoint logs successful connections to the console

## Troubleshooting

- **Endpoint returns 500 error**: Check your Supabase credentials in environment variables
- **Timeout errors**: Your database might be paused; try again in a few minutes
- **Authentication errors**: Verify your `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct

## Frequency Recommendations

- **Minimum**: Every 6 days (to stay within the 7-day limit)
- **Recommended**: Every 3 days (provides buffer for failures)
- **Conservative**: Every 2 days (maximum safety)

Choose based on your reliability needs and monitoring service limits.
