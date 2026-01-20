// Test pagination approach
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

async function testPagination() {
  console.log("🔍 Testing pagination approach...\n");

  // Get department locations
  const { data: locations } = await supabase
    .from("Location")
    .select("id")
    .eq("locationType", "department");

  const locationIds = locations?.map((loc) => loc.id) || [];
  console.log(`Department location IDs: ${locationIds.length}`);

  // Fetch with pagination
  const BATCH_SIZE = 1000;
  let allRatings: any[] = [];
  let hasMore = true;
  let offset = 0;
  let batchNum = 1;

  while (hasMore) {
    console.log(`\n📦 Fetching batch ${batchNum} (offset: ${offset})...`);

    const { data: batchRatings, error } = await supabase
      .from("Rating")
      .select(`locationId, overall`)
      .in("locationId", locationIds)
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) {
      console.error("Error:", error);
      break;
    }

    console.log(`   Received: ${batchRatings?.length || 0} rows`);

    if (batchRatings && batchRatings.length > 0) {
      allRatings = [...allRatings, ...batchRatings];
      offset += BATCH_SIZE;
      hasMore = batchRatings.length === BATCH_SIZE;
      batchNum++;
    } else {
      hasMore = false;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Total fetched with pagination: ${allRatings.length} rows`);
}

testPagination().catch(console.error);
