// scripts/add-occupational-health.js
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Create a Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

async function addOccupationalHealthLocation() {
  try {
    // Check if the location already exists
    const { data: existingLocation } = await supabase
      .from("Location")
      .select("*")
      .eq("name", "Occupational Health Unit (Medicals)")
      .single();

    if (existingLocation) {
      // Update the location type if it exists
      const { data, error } = await supabase
        .from("Location")
        .update({ locationType: "occupational_health" })
        .eq("name", "Occupational Health Unit (Medicals)")
        .select();

      if (error) throw error;
      console.log("Updated existing location:", data);
    } else {
      // Insert new location if it doesn't exist
      const { data, error } = await supabase
        .from("Location")
        .insert([
          {
            name: "Occupational Health Unit (Medicals)",
            locationType: "occupational_health",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      console.log("Added new location:", data);
    }

    console.log("Operation completed successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the function
addOccupationalHealthLocation();
