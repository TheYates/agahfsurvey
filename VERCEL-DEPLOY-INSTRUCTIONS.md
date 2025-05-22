# Deploying to Vercel with Supabase

This guide will help you deploy your AGA Health Foundation Survey application to Vercel with Supabase as the database.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [Supabase account](https://supabase.com/signup)
- Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up Supabase

1. **Create a new Supabase project**:

   - Log in to your Supabase account
   - Click "New Project"
   - Enter a name for your project
   - Set a secure database password (save this for later)
   - Choose a region close to your users
   - Click "Create new project"

2. **Get your Supabase connection information**:

   - Go to Project Settings > Database
   - Find your connection string in the "Connection Pooling" section
   - It should look like: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1`
   - Save this connection string
   - Also save the direct connection string (without `pgbouncer=true&connection_limit=1` parameters)

3. **Get your Supabase API keys**:
   - Go to Project Settings > API
   - Copy the URL and the anon key
   - These will be used for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Connect Your Repository to Vercel

1. **Log in to Vercel** and go to your dashboard
2. **Click "Add New" > "Project"**
3. **Import your Git repository** containing the AGA Health Foundation Survey code
4. **Configure the project**:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: This is already set in your package.json
   - Output Directory: Leave as default (.next)

## Step 3: Add Environment Variables

Add the following environment variables to your Vercel project:

1. **Click on "Environment Variables"** tab
2. **Add the following variables**:

   | Name                          | Value                                                                |
   | ----------------------------- | -------------------------------------------------------------------- |
   | DATABASE_URL                  | Your Supabase connection string with pooling (from Step 1)           |
   | DIRECT_URL                    | Your Supabase direct connection string without pooling (from Step 1) |
   | NEXT_PUBLIC_SUPABASE_URL      | Your Supabase URL (from Step 1)                                      |
   | NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anon key (from Step 1)                                 |

3. **Make sure** to click "Save" after adding all variables

## Step 4: Deploy Your Application

1. **Click "Deploy"** to start the deployment process
2. **Watch the build logs** for any errors
3. **If successful**, you'll receive a deployment URL

## Step 5: Run Database Migrations

After the initial deployment, you need to run the database migrations. We've provided a helper script to make this easier:

1. **Run the migration script**:

   ```bash
   npm run deploy:migrations
   ```

   This script will:

   - Prompt you for your Supabase direct URL
   - Deploy all migrations to your database
   - Ask if you want to seed the database
   - Clean up temporary files when done

2. **Alternatively, run the commands manually**:

   ```bash
   # Set your Supabase direct URL
   DATABASE_URL="your-supabase-direct-url" npx prisma migrate deploy

   # If you want to seed the database
   DATABASE_URL="your-supabase-direct-url" npx prisma db seed
   ```

## Step 6: Verify Deployment

1. **Visit your deployment URL** to ensure everything is working
2. **Check database connections** by testing the application's functionality
3. **Monitor logs** in Vercel for any issues

## Troubleshooting

### Invalid URL Error During Build

If you see an error like `TypeError: Invalid URL` during build, it's likely because the Supabase client is trying to initialize without proper environment variables. We've added a fix for this in the code, but if it persists:

1. Make sure all environment variables are correctly set in Vercel
2. Check that the Supabase client initialization has proper fallbacks for SSR/build time
3. If needed, bypass Supabase initialization during build time by adding checks for `process.env.NODE_ENV === 'production'`

### Other Common Issues

1. **Check Vercel logs**: Go to your project > Deployments > Click on the latest deployment > Logs
2. **Check Supabase logs**: Go to your Supabase project > Database > API Logs
3. **Verify environment variables**: Make sure all variables are set correctly
4. **Check Prisma migration status**: Run `npx prisma migrate status` locally with the Supabase connection string

## Regular Maintenance

For future updates:

1. **Push changes** to your Git repository
2. **Vercel will automatically deploy** the new changes
3. **Run migrations** if schema changes are made using `npm run deploy:migrations`

For more help, refer to:

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
