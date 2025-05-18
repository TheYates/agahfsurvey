"use server"

import { createClient } from "@supabase/supabase-js"
import { getServicePointFeedbackStats, getServicePointFeedbackItems, getServicePoints } from "@/lib/supabase/queries"

export async function submitServicePointFeedback(servicePointId: number, rating: number, comment?: string) {
  try {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabase.from("service_point_feedback").insert({
      service_point_id: servicePointId,
      rating,
      comment: comment || null,
    })

    if (error) {
      console.error("Error submitting feedback:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function fetchServicePointFeedbackStats(timeRange = "all", servicePointId = "all") {
  try {
    return await getServicePointFeedbackStats(timeRange, servicePointId)
  } catch (error) {
    console.error("Error fetching service point feedback stats:", error)
    return null
  }
}

export async function fetchServicePointFeedbackItems(timeRange = "all", servicePointId = "all", limit = 50) {
  try {
    return await getServicePointFeedbackItems(timeRange, servicePointId, limit)
  } catch (error) {
    console.error("Error fetching service point feedback items:", error)
    return []
  }
}

export async function fetchServicePoints() {
  try {
    return await getServicePoints()
  } catch (error) {
    console.error("Error fetching service points:", error)
    return []
  }
}

export async function generateServicePointQRCode(servicePointId: number) {
  try {
    // This would typically generate a QR code for the service point
    // For now, we'll just return the URL that the QR code would point to
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hospitalsurvey.vercel.app"
    return {
      success: true,
      url: `${baseUrl}/feedback?id=${servicePointId}`,
    }
  } catch (error) {
    console.error("Error generating QR code:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
