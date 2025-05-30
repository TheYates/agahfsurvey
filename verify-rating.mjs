// Script to verify ratings directly from Supabase
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import fs from "fs";

// Load environment variables from .env file
dotenv.config();

// Find .env or .env.local file
let envFile = ".env";
if (fs.existsSync(".env.local")) {
  envFile = ".env.local";
}
console.log(`Using environment variables from ${envFile}`);

// Extract Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials not found in environment variables");
  console.log(
    "Available env vars:",
    Object.keys(process.env).filter((k) => k.includes("SUPABASE"))
  );
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

const submissionId = "754c822e-8634-476b-ae1e-84ff4b915afc";

async function verifyRatings() {
  console.log(`Fetching ratings for submission: ${submissionId}`);

  // Fetch ratings directly from Rating table
  const { data: ratingData, error: ratingError } = await supabase
    .from("Rating")
    .select("*")
    .eq("submissionId", submissionId);

  if (ratingError) {
    console.error("Error fetching ratings:", ratingError);
    return;
  }

  console.log("Rating data directly from database:");
  console.log(JSON.stringify(ratingData, null, 2));

  // Also fetch the processed submission data to compare
  const { data: submissionData, error: submissionError } = await supabase
    .from("SurveySubmission")
    .select(
      `
      id,
      submittedAt,
      Rating (
        id,
        submissionId,
        locationId,
        reception,
        professionalism,
        understanding,
        promptnessCare,
        promptnessFeedback,
        overall,
        comment
      )
    `
    )
    .eq("id", submissionId)
    .single();

  if (submissionError) {
    console.error("Error fetching submission:", submissionError);
    return;
  }

  console.log("\nFull submission with ratings:");
  console.log(JSON.stringify(submissionData, null, 2));

  // Get the location details
  if (ratingData && ratingData.length > 0 && ratingData[0].locationId) {
    console.log("\nFetching location details:");
    const { data: locationData, error: locationError } = await supabase
      .from("Location")
      .select("*")
      .eq("id", ratingData[0].locationId)
      .single();

    if (locationError) {
      console.error("Error fetching location:", locationError);
    } else {
      console.log(JSON.stringify(locationData, null, 2));
    }
  }
}

// Run the verification
verifyRatings()
  .catch((error) => {
    console.error("Unexpected error:", error);
  })
  .finally(() => {
    console.log("Verification complete");
  });
