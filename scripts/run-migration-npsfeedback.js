/**
 * Script to run the npsFeedback migration
 * Adds the npsFeedback column to the Rating table
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Starting npsFeedback migration...\n');

    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'add_nps_feedback.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📝 Migration SQL:');
    console.log(migrationSQL);
    console.log('\n');

    // Execute the migration
    console.log('⏳ Executing migration...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // If exec_sql RPC doesn't exist, try direct query
      console.log('⚠️  exec_sql RPC not found, trying direct execution...');
      
      // Split SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error: stmtError } = await supabase.rpc('exec', { query: statement });
        if (stmtError) {
          console.error('❌ Error executing statement:', stmtError);
          throw stmtError;
        }
      }
    }

    console.log('✅ Migration completed successfully!');
    console.log('\n📊 Verifying column was added...');

    // Verify the column exists
    const { data: testData, error: testError } = await supabase
      .from('Rating')
      .select('npsFeedback')
      .limit(1);

    if (testError) {
      console.error('❌ Verification failed:', testError);
      console.log('\n⚠️  The migration SQL needs to be run manually in Supabase SQL Editor');
      console.log('👉 Go to: https://supabase.com/dashboard/project/ykdnsarqpyinsbfjrytb/sql');
      console.log('\n📋 Copy and paste this SQL:\n');
      console.log(migrationSQL);
    } else {
      console.log('✅ Column verified successfully!');
      console.log('✨ The npsFeedback field is now available in the Rating table');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n⚠️  Please run the migration manually in Supabase SQL Editor');
    console.log('👉 Go to: https://supabase.com/dashboard/project/ykdnsarqpyinsbfjrytb/sql');
    console.log('\n📋 Copy and paste this SQL:\n');
    
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'add_nps_feedback.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    console.log(migrationSQL);
    
    process.exit(1);
  }
}

runMigration();
