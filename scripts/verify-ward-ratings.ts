/**
 * Script to verify ward ratings calculations directly from the database
 * Run with: npx tsx scripts/verify-ward-ratings.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables from .env.local
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Convert text rating to numeric value
const ratingToValue = (rating: string | null): number => {
  switch (rating) {
    case "Excellent":
      return 5;
    case "Very Good":
      return 4;
    case "Good":
      return 3;
    case "Fair":
      return 2;
    case "Poor":
      return 1;
    default:
      return 0;
  }
};

// Calculate Bayesian weighted average
const calculateWeightedAverage = (
  visitCount: number,
  rawSatisfaction: number,
  globalAverage: number,
  minimumThreshold: number = 5
): number => {
  if (visitCount === 0) return 0;
  const v = visitCount;
  const m = minimumThreshold;
  const R = rawSatisfaction;
  const C = globalAverage;
  const weightedScore = (v / (v + m)) * R + (m / (v + m)) * C;
  return Number(weightedScore.toFixed(2));
};

async function verifyWardRatings() {
  console.log("=".repeat(80));
  console.log("WARD RATINGS VERIFICATION");
  console.log("=".repeat(80));

  // Step 1: Get all ward locations
  const { data: wards, error: wardsError } = await supabase
    .from("Location")
    .select("id, name")
    .eq("locationType", "ward");

  if (wardsError || !wards) {
    console.error("Error fetching wards:", wardsError);
    return;
  }

  console.log(`\nFound ${wards.length} wards\n`);

  // Step 2: Get all ratings for these wards
  const wardIds = wards.map((w) => w.id);
  const { data: ratings, error: ratingsError } = await supabase
    .from("Rating")
    .select("*")
    .in("locationId", wardIds);

  if (ratingsError) {
    console.error("Error fetching ratings:", ratingsError);
    return;
  }

  console.log(`Total ratings found: ${ratings?.length || 0}\n`);
  console.log("-".repeat(80));

  // Step 3: Calculate raw stats for each ward
  const wardStats: Array<{
    id: number;
    name: string;
    visitCount: number;
    recommendCount: number;
    recommendRate: number;
    rawSatisfaction: number;
    ratings: Record<string, { sum: number; count: number; avg: number }>;
  }> = [];

  for (const ward of wards) {
    const wardRatings = ratings?.filter((r) => r.locationId === ward.id) || [];
    const visitCount = wardRatings.length;

    // Count recommendations
    const recommendCount = wardRatings.filter(
      (r) => r.wouldRecommend === true
    ).length;
    const recommendRate =
      visitCount > 0 ? Math.round((recommendCount / visitCount) * 100) : 0;

    // Calculate ratings by category
    const categories = [
      "admission",
      "nurseProfessionalism",
      "doctorProfessionalism",
      "foodQuality",
      "discharge",
      "reception",
      "professionalism",
      "understanding",
      "promptnessCare",
      "promptnessFeedback",
      "overall",
    ];

    const categoryStats: Record<
      string,
      { sum: number; count: number; avg: number }
    > = {};

    for (const cat of categories) {
      let sum = 0,
        count = 0;
      for (const rating of wardRatings) {
        const value = ratingToValue(rating[cat]);
        if (value > 0) {
          sum += value;
          count++;
        }
      }
      categoryStats[cat] = {
        sum,
        count,
        avg: count > 0 ? Number((sum / count).toFixed(2)) : 0,
      };
    }

    // Calculate raw satisfaction (average of all category averages)
    const avgValues = Object.values(categoryStats)
      .filter((c) => c.avg > 0)
      .map((c) => c.avg);
    const rawSatisfaction =
      avgValues.length > 0
        ? avgValues.reduce((a, b) => a + b, 0) / avgValues.length
        : 0;

    wardStats.push({
      id: ward.id,
      name: ward.name,
      visitCount,
      recommendCount,
      recommendRate,
      rawSatisfaction,
      ratings: categoryStats,
    });
  }

  // Step 4: Calculate global average for Bayesian weighting
  const wardsWithData = wardStats.filter((w) => w.visitCount > 0);
  const globalAverage =
    wardsWithData.length > 0
      ? wardsWithData.reduce((sum, w) => sum + w.rawSatisfaction, 0) /
        wardsWithData.length
      : 3.0;

  console.log(`Global Average Satisfaction: ${globalAverage.toFixed(2)}`);
  console.log(`Minimum Threshold (m): 5`);
  console.log("-".repeat(80));

  // Step 5: Apply Bayesian weighting and display results
  console.log("\nWARD RANKINGS (with Bayesian weighted satisfaction):\n");

  const results = wardStats
    .map((w) => ({
      ...w,
      weightedSatisfaction: calculateWeightedAverage(
        w.visitCount,
        w.rawSatisfaction,
        globalAverage
      ),
    }))
    .sort((a, b) => b.weightedSatisfaction - a.weightedSatisfaction);

  results.forEach((w, index) => {
    console.log(`${index + 1}. ${w.name}`);
    console.log(`   Responses: ${w.visitCount}`);
    console.log(`   Raw Satisfaction: ${w.rawSatisfaction.toFixed(2)}`);
    console.log(`   Weighted Satisfaction: ${w.weightedSatisfaction}`);
    console.log(
      `   Recommend Rate: ${w.recommendRate}% (${w.recommendCount}/${w.visitCount})`
    );

    // Show top/lowest categories
    const catEntries = Object.entries(w.ratings).filter(([, v]) => v.avg > 0);
    if (catEntries.length > 0) {
      const top = catEntries.reduce((a, b) => (a[1].avg > b[1].avg ? a : b));
      const low = catEntries.reduce((a, b) => (a[1].avg < b[1].avg ? a : b));
      console.log(`   Top Rating: ${top[0]} (${top[1].avg})`);
      console.log(`   Lowest Rating: ${low[0]} (${low[1].avg})`);
    }
    console.log();
  });
}

verifyWardRatings().catch(console.error);
