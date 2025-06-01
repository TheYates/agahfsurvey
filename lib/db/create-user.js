// Script to create a new user with hashed password
require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: node create-user.js <username> <password> [role]");
  process.exit(1);
}

const username = args[0];
const password = args[1];
const role = args[2] || "user"; // Default role is 'user'

async function createUser() {
  try {
    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const { data, error } = await supabase.from("users").insert([
      {
        username,
        password_hash: passwordHash,
        role,
      },
    ]);

    if (error) throw error;

    console.log(`User '${username}' created successfully with role '${role}'`);
  } catch (error) {
    console.error("Error creating user:", error.message);
    process.exit(1);
  }
}

createUser();
