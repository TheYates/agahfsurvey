// Script to directly verify ratings from Supabase
import { createClient } from "@supabase/supabase-js";

// Use hardcoded credentials from .env.local for easy debugging
const supabaseUrl = "https://ykdnsarqpyinsbfjrytb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrZG5zYXJxcHlpbnNiZmpyeXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MjcyNzMsImV4cCI6MjA2MzUwMzI3M30.OyCQ97oiDZ4HEesAQ_cy7_YZRwbkC7NQ2oS-aDi62zQ";

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

  // Also fetch the submission with all joined data
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
        foodQuality
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

  // If rating has locationId, get the location details
  if (ratingData && ratingData.length > 0 && ratingData[0].locationId) {
    const locationId = ratingData[0].locationId;

    console.log(`\nFetching location details for ID: ${locationId}`);
    const { data: locationData, error: locationError } = await supabase
      .from("Location")
      .select("*")
      .eq("id", locationId)
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
