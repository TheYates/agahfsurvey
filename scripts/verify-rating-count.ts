// Script to verify the actual rating count in the database
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyRatingCount() {
  console.log("🔍 Verifying rating counts in database...\n");

  // 1. Get total count of ALL ratings
  const { count: totalRatings, error: totalError } = await supabase
    .from("Rating")
    .select("*", { count: "exact", head: true });

  if (totalError) {
    console.error("Error getting total ratings:", totalError);
  } else {
    console.log(`📊 Total ratings in database: ${totalRatings}`);
  }

  // 2. Get count of department locations
  const { data: deptLocations, error: deptLocError } = await supabase
    .from("Location")
    .select("id, name")
    .eq("locationType", "department");

  if (deptLocError) {
    console.error("Error getting department locations:", deptLocError);
  } else {
    console.log(`🏥 Number of departments: ${deptLocations?.length || 0}`);

    if (deptLocations && deptLocations.length > 0) {
      const locationIds = deptLocations.map(loc => loc.id);

      // 3. Get count of ratings for department locations
      const { count: deptRatings, error: deptRatingsError } = await supabase
        .from("Rating")
        .select("*", { count: "exact", head: true })
        .in("locationId", locationIds);

      if (deptRatingsError) {
        console.error("Error getting department ratings:", deptRatingsError);
      } else {
        console.log(`📈 Total department ratings: ${deptRatings}`);

        if (deptRatings && deptRatings > 1000) {
          console.log(`\n⚠️  You have ${deptRatings} department ratings, which exceeds the default Supabase limit of 1000!`);
        }
      }
    }
  }

  // 4. Get count of ward locations
  const { data: wardLocations, error: wardLocError } = await supabase
    .from("Location")
    .select("id, name")
    .eq("locationType", "ward");

  if (wardLocError) {
    console.error("Error getting ward locations:", wardLocError);
  } else {
    console.log(`🛏️  Number of wards: ${wardLocations?.length || 0}`);

    if (wardLocations && wardLocations.length > 0) {
      const wardIds = wardLocations.map(loc => loc.id);

      const { count: wardRatings, error: wardRatingsError } = await supabase
        .from("Rating")
        .select("*", { count: "exact", head: true })
        .in("locationId", wardIds);

      if (wardRatingsError) {
        console.error("Error getting ward ratings:", wardRatingsError);
      } else {
        console.log(`📈 Total ward ratings: ${wardRatings}`);
      }
    }
  }

  // 5. Get total survey submissions count
  const { count: totalSubmissions, error: subError } = await supabase
    .from("SurveySubmission")
    .select("*", { count: "exact", head: true });

  if (subError) {
    console.error("Error getting submissions:", subError);
  } else {
    console.log(`\n📝 Total survey submissions: ${totalSubmissions}`);
  }

  console.log("\n✅ Verification complete!");
}

verifyRatingCount().catch(console.error);
