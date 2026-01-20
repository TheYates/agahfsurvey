// Script to get department responses count by month for 2024 and 2026
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

async function getResponsesForYear(year: number, locationIds: number[]) {
  const months = [
    { name: "January", start: `${year}-01-01`, end: `${year}-01-31` },
    { name: "February", start: `${year}-02-01`, end: `${year}-02-29` },
    { name: "March", start: `${year}-03-01`, end: `${year}-03-31` },
    { name: "April", start: `${year}-04-01`, end: `${year}-04-30` },
    { name: "May", start: `${year}-05-01`, end: `${year}-05-31` },
    { name: "June", start: `${year}-06-01`, end: `${year}-06-30` },
    { name: "July", start: `${year}-07-01`, end: `${year}-07-31` },
    { name: "August", start: `${year}-08-01`, end: `${year}-08-31` },
    { name: "September", start: `${year}-09-01`, end: `${year}-09-30` },
    { name: "October", start: `${year}-10-01`, end: `${year}-10-31` },
    { name: "November", start: `${year}-11-01`, end: `${year}-11-30` },
    { name: "December", start: `${year}-12-01`, end: `${year}-12-31` },
  ];

  const results: { month: string; count: number }[] = [];
  let totalYear = 0;

  for (const month of months) {
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

  return { results, totalYear };
}

async function getDepartmentResponsesByMonth() {
  console.log("📊 Department Responses by Month\n");
  console.log("=".repeat(60));

  // Get department location IDs
  const { data: locations } = await supabase
    .from("Location")
    .select("id, name")
    .eq("locationType", "department");

  const locationIds = locations?.map((loc) => loc.id) || [];

  // Get data for 2024
  console.log("\n📅 2024 Monthly Breakdown:\n");
  const data2024 = await getResponsesForYear(2024, locationIds);

  console.log("Month           | Responses");
  console.log("-".repeat(40));
  data2024.results.forEach((r) => {
    const bar = "█".repeat(Math.ceil(r.count / 20));
    console.log(`${r.month.padEnd(15)} | ${r.count.toString().padStart(5)} ${bar}`);
  });
  console.log("-".repeat(40));
  console.log(`${"TOTAL 2024".padEnd(15)} | ${data2024.totalYear.toString().padStart(5)}`);

  // Get data for 2026
  console.log("\n\n📅 2026 Monthly Breakdown:\n");
  const data2026 = await getResponsesForYear(2026, locationIds);

  console.log("Month           | Responses");
  console.log("-".repeat(40));
  data2026.results.forEach((r) => {
    const bar = "█".repeat(Math.ceil(r.count / 20));
    console.log(`${r.month.padEnd(15)} | ${r.count.toString().padStart(5)} ${bar}`);
  });
  console.log("-".repeat(40));
  console.log(`${"TOTAL 2026".padEnd(15)} | ${data2026.totalYear.toString().padStart(5)}`);

  // Summary
  console.log("\n\n" + "=".repeat(60));
  console.log("📈 YEARLY SUMMARY:");
  console.log("-".repeat(40));
  console.log(`2024: ${data2024.totalYear} responses`);
  console.log(`2026: ${data2026.totalYear} responses`);
  console.log("=".repeat(60));
  console.log("\n✅ Done!");
}

getDepartmentResponsesByMonth().catch(console.error);
