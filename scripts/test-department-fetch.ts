// Test script to debug the department fetch issue
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  console.log("🔍 Testing department fetch with explicit limit...\n");

  // Get department locations
  const { data: locations, error: locationsError } = await supabase
    .from("Location")
    .select("id, name")
    .eq("locationType", "department");

  if (locationsError) {
    console.error("Error fetching locations:", locationsError);
    return;
  }

  console.log(`Found ${locations?.length} department locations`);
  const locationIds = locations?.map((loc) => loc.id) || [];

  // Test 1: Default query (no limit - should default to 1000)
  console.log("\n📊 Test 1: Query WITHOUT explicit limit:");
  const { data: defaultData, error: defaultError } = await supabase
    .from("Rating")
    .select(`locationId, overall, SurveySubmission!inner(submittedAt)`)
    .in("locationId", locationIds);

  if (defaultError) {
    console.error("Error:", defaultError);
  } else {
    console.log(`   Returned: ${defaultData?.length} rows`);
  }

  // Test 2: Query with limit(10000)
  console.log("\n📊 Test 2: Query WITH .limit(10000):");
  const { data: limitedData, error: limitedError } = await supabase
    .from("Rating")
    .select(`locationId, overall, SurveySubmission!inner(submittedAt)`)
    .in("locationId", locationIds)
    .limit(10000);

  if (limitedError) {
    console.error("Error:", limitedError);
  } else {
    console.log(`   Returned: ${limitedData?.length} rows`);
  }

  // Test 3: Query with count
  console.log("\n📊 Test 3: Query with { count: 'exact' }:");
  const { data: countData, count, error: countError } = await supabase
    .from("Rating")
    .select(`locationId`, { count: 'exact' })
    .in("locationId", locationIds)
    .limit(10000);

  if (countError) {
    console.error("Error:", countError);
  } else {
    console.log(`   Returned: ${countData?.length} rows`);
    console.log(`   Actual count: ${count}`);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("SUMMARY:");
  console.log(`   Without limit: ${defaultData?.length || 0} rows`);
  console.log(`   With limit(10000): ${limitedData?.length || 0} rows`);
  console.log(`   Database count: ${count || 0} rows`);

  if ((defaultData?.length || 0) === 1000 && (limitedData?.length || 0) > 1000) {
    console.log("\n✅ The .limit(10000) fix is working correctly!");
  } else if ((limitedData?.length || 0) === 1000) {
    console.log("\n⚠️  Still getting 1000 rows even with limit. Possible Supabase project setting issue.");
  }
}

testFetch().catch(console.error);
