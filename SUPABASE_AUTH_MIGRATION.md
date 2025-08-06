# Supabase Auth Migration Guide

This guide explains how to migrate from the custom authentication system to Supabase Auth.

## Overview

The application has been updated to use Supabase Auth instead of the custom cookie-based authentication system. This provides:

- Better security with JWT tokens
- Built-in password reset functionality
- Email verification
- Session management
- Role-based access control

## Migration Steps

### 1. Environment Setup

Make sure your `.env.local` file includes:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL
```

### 2. Run the Migration Script

To migrate existing users from the custom `users` table to Supabase Auth:

```bash
npm run migrate-auth
```

This script will:
- Read existing users from the `users` table
- Create corresponding Supabase Auth users
- Preserve user roles in metadata
- Generate temporary passwords
- Create a default admin user if no users exist

### 3. Supabase Auth Configuration

In your Supabase dashboard:

1. **Enable Email/Password Authentication**:
   - Go to Authentication > Settings
   - Enable "Email" provider
   - Configure email templates if needed

2. **Set up URL Configuration**:
   - Site URL: `http://localhost:3000` (development) or your production URL
   - Redirect URLs: Add your auth callback URLs

3. **Configure Email Templates** (optional):
   - Customize the password reset email template
   - Set up email verification templates

### 4. User Roles

User roles are stored in the `user_metadata` field:

```json
{
  "role": "admin" | "user",
  "migrated_from_custom_auth": true,
  "original_username": "admin",
  "migration_date": "2024-01-01T00:00:00.000Z"
}
```

## New Auth Flow

### Login Process

1. User enters email and password
2. Supabase Auth validates credentials
3. JWT token is stored in cookies
4. User is redirected to `/admin`

### Protected Routes

Routes are protected by middleware that checks for valid Supabase sessions:

- `/admin/*` - Requires authentication
- `/auth/*` - Redirects to admin if already authenticated

### Role-Based Access

Use the `useRequireRole` hook for role-based protection:

```tsx
import { useRequireRole } from "@/lib/auth/hooks";

function AdminOnlyComponent() {
  const { user, loading } = useRequireRole("admin");
  
  if (loading) return <div>Loading...</div>;
  
  return <div>Admin content</div>;
}
```

## API Changes

### Client-Side Auth

```tsx
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";

function LoginComponent() {
  const { signIn, signOut, user, isAuthenticated } = useSupabaseAuth();
  
  // Use signIn, signOut, etc.
}
```

### Server-Side Auth

```tsx
import { authServer } from "@/lib/auth/server";

export default async function ProtectedPage() {
  const { data: { session } } = await authServer.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }
  
  // Page content
}
```

## Testing the Migration

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test login with migrated users**:
   - Go to `/auth/login`
   - Use the email and temporary password from migration output
   - Reset password if needed

3. **Test new user registration**:
   - Go to `/auth/signup`
   - Create a new account
   - Verify email functionality

4. **Test protected routes**:
   - Try accessing `/admin` without authentication
   - Verify redirect to login page

## Cleanup

After verifying the migration works correctly:

1. **Remove old auth files**:
   - `app/actions/auth-actions.ts`
   - `contexts/auth-context.tsx`
   - `lib/db/create_users_table.sql`
   - `lib/db/create-user.js`

2. **Drop the old users table** (optional):
   ```sql
   DROP TABLE IF EXISTS users;
   ```

3. **Update any remaining references** to the old auth system

## Troubleshooting

### Common Issues

1. **"Invalid login credentials"**:
   - Check if user was migrated correctly
   - Verify email format
   - Try password reset

2. **Redirect loops**:
   - Check middleware configuration
   - Verify environment variables
   - Clear browser cookies

3. **Email not working**:
   - Configure SMTP in Supabase dashboard
   - Check email templates
   - Verify redirect URLs

### Migration Script Issues

If the migration script fails:

1. Check database connection
2. Verify Supabase credentials
3. Check if users table exists
4. Review console output for specific errors

## Support

For issues with the migration:

1. Check the console output from the migration script
2. Review Supabase Auth logs in the dashboard
3. Test with a fresh user account
4. Verify all environment variables are set correctly
