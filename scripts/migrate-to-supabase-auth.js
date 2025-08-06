#!/usr/bin/env node

/**
 * Migration script to transition from custom auth to Supabase Auth
 * 
 * Usage:
 *   node scripts/migrate-to-supabase-auth.js
 * 
 * This script will:
 * 1. Read existing users from the custom users table
 * 2. Create corresponding Supabase Auth users
 * 3. Preserve user roles in metadata
 * 4. Generate password reset links for users
 */

require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

async function main() {
  console.log("🚀 Starting migration to Supabase Auth...\n");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    console.error("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  // Create admin client
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // 1. Check if users table exists and get existing users
    console.log("📋 Checking for existing users...");
    
    const { data: existingUsers, error: fetchError } = await supabase
      .from("users")
      .select("*");

    if (fetchError) {
      if (fetchError.code === "42P01") { // Table doesn't exist
        console.log("ℹ️  No custom users table found. Creating default admin user...");
        await createDefaultAdmin(supabase);
        return;
      }
      throw fetchError;
    }

    if (!existingUsers || existingUsers.length === 0) {
      console.log("ℹ️  No existing users found. Creating default admin user...");
      await createDefaultAdmin(supabase);
      return;
    }

    console.log(`📊 Found ${existingUsers.length} users to migrate\n`);

    // 2. Migrate each user
    const results = [];
    
    for (const user of existingUsers) {
      console.log(`🔄 Migrating user: ${user.username}`);
      
      try {
        // Convert username to email format
        const email = user.username.includes("@") 
          ? user.username 
          : `${user.username}@hospital-survey.local`;

        // Generate temporary password
        const tempPassword = generateTempPassword();
        
        // Create Supabase Auth user
        const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: tempPassword,
          user_metadata: {
            role: user.role,
            migrated_from_custom_auth: true,
            original_username: user.username,
            migration_date: new Date().toISOString(),
          },
          email_confirm: true,
        });

        if (createError) {
          console.log(`  ❌ Failed: ${createError.message}`);
          results.push({
            username: user.username,
            success: false,
            error: createError.message,
          });
          continue;
        }

        console.log(`  ✅ Created auth user: ${email}`);
        console.log(`  🔑 Temporary password: ${tempPassword}`);

        results.push({
          username: user.username,
          email,
          success: true,
          tempPassword,
          authUserId: authUser.user?.id,
        });

      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        results.push({
          username: user.username,
          success: false,
          error: error.message,
        });
      }
    }

    // 3. Print summary
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log("\n📈 Migration Summary:");
    console.log(`  Total users: ${existingUsers.length}`);
    console.log(`  Successful: ${successful.length}`);
    console.log(`  Failed: ${failed.length}\n`);

    if (successful.length > 0) {
      console.log("✅ Successfully migrated users:");
      successful.forEach(user => {
        console.log(`  • ${user.username} -> ${user.email}`);
        console.log(`    Password: ${user.tempPassword}`);
      });
    }

    if (failed.length > 0) {
      console.log("\n❌ Failed migrations:");
      failed.forEach(user => {
        console.log(`  • ${user.username}: ${user.error}`);
      });
    }

    console.log("\n🎉 Migration completed!");
    console.log("\n📝 Next steps:");
    console.log("1. Update your application to use Supabase Auth");
    console.log("2. Test login with the migrated users");
    console.log("3. Users should reset their passwords using the temp passwords above");
    console.log("4. Consider removing the old users table once migration is verified");

  } catch (error) {
    console.error("💥 Migration failed:", error.message);
    process.exit(1);
  }
}

async function createDefaultAdmin(supabase) {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@hospital-survey.local",
      password: "admin123",
      user_metadata: {
        role: "admin",
      },
      email_confirm: true,
    });

    if (error) {
      console.error("❌ Error creating admin user:", error.message);
      return;
    }

    console.log("✅ Default admin user created:");
    console.log("  Email: admin@hospital-survey.local");
    console.log("  Password: admin123");
    console.log("  ⚠️  Please change this password after first login!");

  } catch (error) {
    console.error("💥 Failed to create admin user:", error.message);
  }
}

function generateTempPassword() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Run the migration
main().catch(console.error);
