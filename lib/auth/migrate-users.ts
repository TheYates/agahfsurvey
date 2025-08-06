/**
 * Migration utility for transitioning from custom auth to Supabase Auth
 * 
 * This script helps migrate existing users from the custom users table
 * to Supabase Auth. Since we can't migrate passwords (they're hashed),
 * we'll need to:
 * 1. Create Supabase Auth users with temporary passwords
 * 2. Send password reset emails to all users
 * 3. Preserve user roles in user metadata
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// This should only be run server-side with service role key
export async function migrateUsersToSupabaseAuth() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase credentials");
  }

  // Create admin client
  const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // 1. Get all existing users from the custom users table
    const { data: existingUsers, error: fetchError } = await supabase
      .from("users")
      .select("*");

    if (fetchError) {
      console.error("Error fetching existing users:", fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!existingUsers || existingUsers.length === 0) {
      console.log("No existing users to migrate");
      return { success: true, message: "No users to migrate" };
    }

    console.log(`Found ${existingUsers.length} users to migrate`);

    const migrationResults = [];

    // 2. Create Supabase Auth users for each existing user
    for (const user of existingUsers) {
      try {
        // For migration, we'll use the username as email if it's not already an email
        const email = user.username.includes("@") 
          ? user.username 
          : `${user.username}@hospital-survey.local`; // Use a local domain for non-email usernames

        // Create user with a temporary password
        const tempPassword = generateTempPassword();
        
        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: tempPassword,
          user_metadata: {
            role: user.role,
            migrated_from_custom_auth: true,
            original_username: user.username,
            migration_date: new Date().toISOString(),
          },
          email_confirm: true, // Auto-confirm email for migration
        });

        if (createError) {
          console.error(`Error creating user ${user.username}:`, createError);
          migrationResults.push({
            username: user.username,
            success: false,
            error: createError.message,
          });
          continue;
        }

        // 3. Send password reset email
        const { error: resetError } = await supabase.auth.admin.generateLink({
          type: "recovery",
          email,
        });

        if (resetError) {
          console.warn(`Warning: Could not send reset email to ${email}:`, resetError);
        }

        migrationResults.push({
          username: user.username,
          email,
          success: true,
          authUserId: authUser.user?.id,
          tempPassword, // Store temporarily for manual setup if needed
        });

        console.log(`Successfully migrated user: ${user.username} -> ${email}`);

      } catch (error) {
        console.error(`Unexpected error migrating user ${user.username}:`, error);
        migrationResults.push({
          username: user.username,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // 4. Summary
    const successful = migrationResults.filter(r => r.success);
    const failed = migrationResults.filter(r => !r.success);

    console.log(`Migration complete: ${successful.length} successful, ${failed.length} failed`);

    return {
      success: true,
      results: migrationResults,
      summary: {
        total: existingUsers.length,
        successful: successful.length,
        failed: failed.length,
      },
    };

  } catch (error) {
    console.error("Migration failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Generate a temporary password for migration
function generateTempPassword(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Helper function to create a default admin user in Supabase Auth
export async function createDefaultAdminUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@hospital-survey.local",
      password: "admin123", // Change this to a secure password
      user_metadata: {
        role: "admin",
      },
      email_confirm: true,
    });

    if (error) {
      console.error("Error creating admin user:", error);
      return { success: false, error: error.message };
    }

    console.log("Default admin user created:", data.user?.email);
    return { success: true, user: data.user };

  } catch (error) {
    console.error("Failed to create admin user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
