const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function addRecommendationColumn() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in environment variables');
    console.log('\nPlease ensure you have:');
    console.log('  - NEXT_PUBLIC_SUPABASE_URL');
    console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
    process.exit(1);
  }

  console.log('🔄 Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('\n📝 Checking if wouldRecommend column already exists...');

    // Test if column exists by trying to query it
    const { error: testError } = await supabase
      .from('Rating')
      .select('wouldRecommend')
      .limit(1);

    if (!testError) {
      console.log('✅ Column already exists! No migration needed.');
      return;
    }

    console.log('\n⚠️  Column does not exist. Manual migration required.');
    console.log('\n📋 Please run the following SQL in your Supabase SQL Editor:');
    console.log('   (Dashboard → SQL Editor → New Query)\n');
    console.log('━'.repeat(60));
    console.log(`
-- Add location-specific recommendation to Rating table
ALTER TABLE "Rating"
ADD COLUMN IF NOT EXISTS "wouldRecommend" BOOLEAN;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_rating_would_recommend ON "Rating"("wouldRecommend");

-- Add comment to explain the column
COMMENT ON COLUMN "Rating"."wouldRecommend" IS 'Whether the user would recommend this specific location/department/ward to others';
    `.trim());
    console.log('━'.repeat(60));
    console.log('\n🔗 Or visit your Supabase dashboard:');
    console.log(`   ${supabaseUrl.replace('/rest/v1', '')}/project/_/sql/new`);
    console.log('\n💡 After running the SQL, restart your development server.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addRecommendationColumn();
