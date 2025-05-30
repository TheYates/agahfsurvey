// Script to verify ratings directly from Supabase
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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

  console.log("Rating data from database:");
  console.log(JSON.stringify(ratingData, null, 2));

  // Also fetch the submission with all joined data to see how it's processed
  const { data: submissionData, error: submissionError } = await supabase
    .from("SurveySubmission")
    .select(
      `
      id,
      submittedAt,
      Rating (*)
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
}

// Run the verification
verifyRatings()
  .catch(console.error)
  .finally(() => process.exit());
