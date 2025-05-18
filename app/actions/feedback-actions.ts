"use server"

import { createClient } from "@supabase/supabase-js"
import { revalidatePath } from "next/cache"

// Create a Supabase client for server actions
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export type QuickFeedbackData = {
  servicePointId: number
  rating: number
  comment?: string
}

export async function submitQuickFeedback(data: QuickFeedbackData) {
  try {
    // Insert the feedback into the database
    const { error } = await supabase.from("service_point_feedback").insert({
      service_point_id: data.servicePointId,
      rating: data.rating,
      comment: data.comment || null,
    })

    if (error) throw error

    // Revalidate the reports page to reflect new data
    revalidatePath("/reports")
    revalidatePath("/admin/service-points")

    return { success: true }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return { success: false, error: "Failed to submit feedback" }
  }
}

export async function getServicePoints() {
  const { data, error } = await supabase.from("service_points").select("*").order("name")

  if (error) {
    console.error("Error fetching service points:", error)
    return []
  }

  return data
}
