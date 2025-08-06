// Script to set up the database schema and initial users
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase URL or Service Key is missing. Please check your environment variables."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log("Setting up database...");

    // Read SQL file
    const sqlPath = path.join(__dirname, "create_users_table.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Execute SQL
    const { error } = await supabase.rpc("exec_sql", { sql });

    if (error) {
      throw error;
    }

    console.log("Database setup complete!");
    console.log("Username: admin");
    console.log("Password: admin");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

setupDatabase();
