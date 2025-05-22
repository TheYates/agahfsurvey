#!/usr/bin/env node

// This script helps deploy migrations to Supabase
// It can be run with: node scripts/deploy-migrations.js

const { execSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    const output = execSync(command, { stdio: "inherit" });
    return { success: true, output };
  } catch (error) {
    console.error(`Command failed: ${error.message}`);
    return { success: false, error };
  }
}

async function promptForEnvVars() {
  return new Promise((resolve) => {
    rl.question("Enter your Supabase Direct URL: ", (directUrl) => {
      if (!directUrl) {
        console.error("Error: Direct URL is required");
        process.exit(1);
      }

      const tempEnvFile = ".env.migration";
      fs.writeFileSync(tempEnvFile, `DATABASE_URL="${directUrl}"\n`);
      console.log(`Created temporary env file with DATABASE_URL`);

      resolve(tempEnvFile);
    });
  });
}

async function main() {
  console.log("🚀 AGA Health Foundation Survey - Migration Deployment Tool");

  // Get the database URL from the user
  const tempEnvFile = await promptForEnvVars();

  try {
    // Run migrations
    console.log("\n📦 Deploying migrations...");
    const migrationResult = await runCommand(
      `npx dotenv -e ${tempEnvFile} -- prisma migrate deploy`
    );

    if (!migrationResult.success) {
      console.error("❌ Migration failed");
      process.exit(1);
    }

    console.log("✅ Migrations deployed successfully");

    // Ask about seeding
    rl.question(
      "\nWould you like to seed the database? (y/n): ",
      async (answer) => {
        if (answer.toLowerCase() === "y") {
          console.log("\n🌱 Seeding database...");
          const seedResult = await runCommand(
            `npx dotenv -e ${tempEnvFile} -- prisma db seed`
          );

          if (seedResult.success) {
            console.log("✅ Database seeded successfully");
          } else {
            console.error("❌ Seeding failed");
          }
        }

        // Clean up
        fs.unlinkSync(tempEnvFile);
        console.log(`\n🧹 Cleaned up temporary files`);

        console.log("\n🎉 Deployment process completed!");
        rl.close();
      }
    );
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Clean up on error
    if (fs.existsSync(tempEnvFile)) {
      fs.unlinkSync(tempEnvFile);
    }
    process.exit(1);
  }
}

main();
