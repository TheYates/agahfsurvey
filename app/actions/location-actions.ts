"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { revalidatePath } from "next/cache";
import { surveyCache } from "@/lib/cache/survey-cache";

// Types for locations
export interface Location {
  id: number;
  name: string;
  locationType: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationCreate {
  name: string;
  locationType: string;
}

export interface LocationUpdate {
  name?: string;
  locationType?: string;
}

// Get all locations
export async function getLocations(): Promise<{
  data: Location[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("Location")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching locations:", error);
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Error in getLocations:", error);
    return { data: null, error: "Failed to fetch locations" };
  }
}

// Get a single location by ID
export async function getLocationById(id: number): Promise<{
  data: Location | null;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("Location")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching location ${id}:`, error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error(`Error in getLocationById ${id}:`, error);
    return { data: null, error: "Failed to fetch location" };
  }
}

// Fix the Location table sequence
export async function fixLocationSequence(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();

    // Run SQL to fix the sequence
    const { error } = await supabase.rpc("fix_location_sequence", {});

    if (error) {
      // If the RPC doesn't exist, try direct SQL
      const { error: sqlError } = await supabase.rpc("exec_sql", {
        sql: `SELECT setval(pg_get_serial_sequence('public."Location"', 'id'), COALESCE((SELECT MAX(id) FROM public."Location"), 0) + 1, false);`,
      });

      if (sqlError) {
        console.error("Error fixing sequence:", sqlError);
        return { success: false, error: sqlError.message };
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in fixLocationSequence:", error);
    return { success: false, error: "Failed to fix location sequence" };
  }
}

// Create a new location
export async function createLocation(location: LocationCreate): Promise<{
  data: Location | null;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();
    const now = new Date().toISOString();

    // First, try to insert
    let { data, error } = await supabase
      .from("Location")
      .insert([
        {
          ...location,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .select()
      .single();

    // If we get a duplicate key error, fix the sequence and retry
    if (error && error.code === "23505") {
      console.log("Duplicate key detected, fixing sequence...");

      // Get the max ID and manually increment
      const { data: maxData } = await supabase
        .from("Location")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      const nextId = (maxData?.id || 0) + 1;

      // Try again with explicit ID
      const result = await supabase
        .from("Location")
        .insert([
          {
            id: nextId,
            ...location,
            createdAt: now,
            updatedAt: now,
          },
        ])
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error("Error creating location:", error);
      return { data: null, error: error.message };
    }

    // Clear all caches when location is created
    surveyCache.clear();
    revalidatePath("/reports", "layout");
    revalidatePath("/submit");

    return { data, error: null };
  } catch (error) {
    console.error("Error in createLocation:", error);
    return { data: null, error: "Failed to create location" };
  }
}

// Update a location
export async function updateLocation(
  id: number,
  location: LocationUpdate
): Promise<{
  data: Location | null;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("Location")
      .update({
        ...location,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating location ${id}:`, error);
      return { data: null, error: error.message };
    }

    // Clear all caches when location is updated
    surveyCache.clear();
    revalidatePath("/reports", "layout");
    revalidatePath("/submit");

    return { data, error: null };
  } catch (error) {
    console.error(`Error in updateLocation ${id}:`, error);
    return { data: null, error: "Failed to update location" };
  }
}

// Delete a location
export async function deleteLocation(id: number): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();
    const { error } = await supabase.from("Location").delete().eq("id", id);

    if (error) {
      console.error(`Error deleting location ${id}:`, error);
      return { success: false, error: error.message };
    }

    // Clear all caches when location is deleted
    surveyCache.clear();
    revalidatePath("/reports", "layout");
    revalidatePath("/submit");

    return { success: true, error: null };
  } catch (error) {
    console.error(`Error in deleteLocation ${id}:`, error);
    return { success: false, error: "Failed to delete location" };
  }
}

// Get locations by type
export async function getLocationsByType(locationType: string): Promise<{
  data: Location[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("Location")
      .select("*")
      .eq("locationType", locationType)
      .order("name");

    if (error) {
      console.error(`Error fetching locations by type ${locationType}:`, error);
      return { data: null, error: error.message };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error(`Error in getLocationsByType ${locationType}:`, error);
    return { data: null, error: "Failed to fetch locations by type" };
  }
}

// Get location usage statistics
export async function getLocationUsageStats(id: number): Promise<{
  data: { totalSubmissions: number; totalRatings: number } | null;
  error: string | null;
}> {
  try {
    const supabase = await createServerClient();

    // Get submission count
    const { count: submissionCount, error: submissionError } = await supabase
      .from("SubmissionLocation")
      .select("*", { count: "exact", head: true })
      .eq("locationId", id);

    if (submissionError) {
      console.error(
        `Error fetching submission count for location ${id}:`,
        submissionError
      );
      return { data: null, error: submissionError.message };
    }

    // Get rating count
    const { count: ratingCount, error: ratingError } = await supabase
      .from("Rating")
      .select("*", { count: "exact", head: true })
      .eq("locationId", id);

    if (ratingError) {
      console.error(
        `Error fetching rating count for location ${id}:`,
        ratingError
      );
      return { data: null, error: ratingError.message };
    }

    return {
      data: {
        totalSubmissions: submissionCount || 0,
        totalRatings: ratingCount || 0,
      },
      error: null,
    };
  } catch (error) {
    console.error(`Error in getLocationUsageStats ${id}:`, error);
    return { data: null, error: "Failed to fetch location usage statistics" };
  }
}
