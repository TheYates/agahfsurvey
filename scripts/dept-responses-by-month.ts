// Script to get department responses count by month for 2025
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

async function getDepartmentResponsesByMonth() {
  console.log("📊 Department Responses by Month (2025)\n");
  console.log("=".repeat(50));

  // Get department location IDs
  const { data: locations } = await supabase
    .from("Location")
    .select("id, name")
    .eq("locationType", "department");

  const locationIds = locations?.map((loc) => loc.id) || [];

  const months = [
    { name: "January", start: "2025-01-01", end: "2025-01-31" },
    { name: "February", start: "2025-02-01", end: "2025-02-28" },
    { name: "March", start: "2025-03-01", end: "2025-03-31" },
    { name: "April", start: "2025-04-01", end: "2025-04-30" },
    { name: "May", start: "2025-05-01", end: "2025-05-31" },
    { name: "June", start: "2025-06-01", end: "2025-06-30" },
    { name: "July", start: "2025-07-01", end: "2025-07-31" },
    { name: "August", start: "2025-08-01", end: "2025-08-31" },
    { name: "September", start: "2025-09-01", end: "2025-09-30" },
    { name: "October", start: "2025-10-01", end: "2025-10-31" },
    { name: "November", start: "2025-11-01", end: "2025-11-30" },
    { name: "December", start: "2025-12-01", end: "2025-12-31" },
  ];

  const results: { month: string; count: number }[] = [];
  let totalYear = 0;

  for (const month of months) {
    // Use pagination to get accurate count
    const BATCH_SIZE = 1000;
    let totalCount = 0;
    let hasMore = true;
    let offset = 0;

    while (hasMore) {
      const { data, error } = await supabase
        .from("Rating")
        .select(`locationId, SurveySubmission!inner(submittedAt)`)
        .in("locationId", locationIds)
        .gte("SurveySubmission.submittedAt", month.start)
        .lte("SurveySubmission.submittedAt", month.end + "T23:59:59")
        .range(offset, offset + BATCH_SIZE - 1);

      if (error) {
        console.error(`Error for ${month.name}:`, error);
        break;
      }

      if (data && data.length > 0) {
        totalCount += data.length;
        offset += BATCH_SIZE;
        hasMore = data.length === BATCH_SIZE;
      } else {
        hasMore = false;
      }
    }

    results.push({ month: month.name, count: totalCount });
    totalYear += totalCount;
  }

  // Display results
  console.log("\n📅 Monthly Breakdown:\n");
  console.log("Month           | Responses");
  console.log("-".repeat(35));

  results.forEach((r) => {
    const bar = "█".repeat(Math.ceil(r.count / 50)); // Visual bar
    console.log(`${r.month.padEnd(15)} | ${r.count.toString().padStart(5)} ${bar}`);
  });

  console.log("-".repeat(35));
  console.log(`${"TOTAL 2025".padEnd(15)} | ${totalYear.toString().padStart(5)}`);
  console.log("\n✅ Done!");
}

getDepartmentResponsesByMonth().catch(console.error);
