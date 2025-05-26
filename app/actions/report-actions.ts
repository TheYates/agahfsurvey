"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { mockDataService } from "@/lib/mock-data"
import type {
  DepartmentRating,
  LocationVisit,
  SurveyData,
  WardRating,
  CanteenRating,
  OccupationalHealthRating,
  DepartmentConcern,
} from "@/types"
import {
  getDepartmentRatingsQuery,
  getWardRatingsQuery,
  getCanteenRatingsQuery,
  getOccupationalHealthRatingsQuery,
  getSurveyDataQuery,
  getLocationVisitsQuery,
  getDepartmentConcernsQuery,
  getOverallSatisfactionTrendQuery,
  getPatientTypeDistributionQuery,
  getRecommendationScoresQuery,
  getDepartmentPerformanceQuery,
  getWardPerformanceQuery,
  getCommentSentimentQuery,
  getTopConcernsQuery,
  getRecentSurveysQuery,
} from "@/lib/supabase/queries"

// Helper function to create Supabase client
const getSupabase = () => {
  const cookieStore = cookies()
  return createServerClient(cookieStore)
}

// Get all survey data
export async function getSurveyData(): Promise<SurveyData[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await getSurveyDataQuery(supabase)

    if (error) {
      console.error("Error fetching survey data:", error)
      return mockDataService.getSurveyData()
    }

    return data as SurveyData[]
  } catch (error) {
    console.error("Error in getSurveyData:", error)
    return mockDataService.getSurveyData()
  }
}

// Get department ratings
export async function getDepartmentRatings(): Promise<DepartmentRating[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await getDepartmentRatingsQuery(supabase)

    if (error) {
      console.error("Error fetching department ratings:", error)
      return mockDataService.getDepartmentRatings()
    }

    return data as DepartmentRating[]
  } catch (error) {
    console.error("Error in getDepartmentRatings:", error)
    return mockDataService.getDepartmentRatings()
  }
}

// Get ward ratings
export async function getWardRatings(): Promise<WardRating[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await getWardRatingsQuery(supabase)

    if (error) {
      console.error("Error fetching ward ratings:", error)
      return mockDataService.getWardRatings()
    }

    return data as WardRating[]
  } catch (error) {
    console.error("Error in getWardRatings:", error)
    return mockDataService.getWardRatings()
  }
}

// Get canteen ratings
export async function getCanteenRatings(): Promise<CanteenRating[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await getCanteenRatingsQuery(supabase)

    if (error) {
      console.error("Error fetching canteen ratings:", error)
      return mockDataService.getCanteenRatings()
    }

    return data as CanteenRating[]
  } catch (error) {
    console.error("Error in getCanteenRatings:", error)
    return mockDataService.getCanteenRatings()
  }
}

// Get occupational health ratings
export async function getOccupationalHealthRatings(): Promise<OccupationalHealthRating[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await getOccupationalHealthRatingsQuery(supabase)

    if (error) {
      console.error("Error fetching occupational health ratings:", error)
      return mockDataService.getOccupationalHealthRatings()
    }

    return data as OccupationalHealthRating[]
  } catch (error) {
    console.error("Error in getOccupationalHealthRatings:", error)
    return mockDataService.getOccupationalHealthRatings()
  }
}

// Get department concerns
export async function getDepartmentConcerns(): Promise<DepartmentConcern[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await getDepartmentConcernsQuery(supabase)

    if (error) {
      console.error("Error fetching department concerns:", error)
      return mockDataService.getDepartmentConcerns()
    }

    return data as DepartmentConcern[]
  } catch (error) {
    console.error("Error in getDepartmentConcerns:", error)
    return mockDataService.getDepartmentConcerns()
  }
}

// Get location visits
export async function getLocationVisits(): Promise<LocationVisit[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await getLocationVisitsQuery(supabase)

    if (error) {
      console.error("Error fetching location visits:", error)
      return mockDataService.getLocationVisits()
    }

    return data as LocationVisit[]
  } catch (error) {
    console.error("Error in getLocationVisits:", error)
    return mockDataService.getLocationVisits()
  }
}

// Get overall satisfaction trend
export async function getOverallSatisfactionTrend() {
  try {
    const supabase = getSupabase()
    const { data, error } = await getOverallSatisfactionTrendQuery(supabase)

    if (error) {
      console.error("Error fetching satisfaction trend:", error)
      return mockDataService.getOverallSatisfactionTrend()
    }

    return data
  } catch (error) {
    console.error("Error in getOverallSatisfactionTrend:", error)
    return mockDataService.getOverallSatisfactionTrend()
  }
}

// Get patient type distribution
export async function getPatientTypeDistribution() {
  try {
    const supabase = getSupabase()
    const { data, error } = await getPatientTypeDistributionQuery(supabase)

    if (error) {
      console.error("Error fetching patient type distribution:", error)
      return mockDataService.getPatientTypeDistribution()
    }

    return data
  } catch (error) {
    console.error("Error in getPatientTypeDistribution:", error)
    return mockDataService.getPatientTypeDistribution()
  }
}

// Get recommendation scores
export async function getRecommendationScores() {
  try {
    const supabase = getSupabase()
    const { data, error } = await getRecommendationScoresQuery(supabase)

    if (error) {
      console.error("Error fetching recommendation scores:", error)
      return mockDataService.getRecommendationScores()
    }

    return data
  } catch (error) {
    console.error("Error in getRecommendationScores:", error)
    return mockDataService.getRecommendationScores()
  }
}

// Get department performance
export async function getDepartmentPerformance() {
  try {
    const supabase = getSupabase()
    const { data, error } = await getDepartmentPerformanceQuery(supabase)

    if (error) {
      console.error("Error fetching department performance:", error)
      return mockDataService.getDepartmentPerformance()
    }

    return data
  } catch (error) {
    console.error("Error in getDepartmentPerformance:", error)
    return mockDataService.getDepartmentPerformance()
  }
}

// Get ward performance
export async function getWardPerformance() {
  try {
    const supabase = getSupabase()
    const { data, error } = await getWardPerformanceQuery(supabase)

    if (error) {
      console.error("Error fetching ward performance:", error)
      return mockDataService.getWardPerformance()
    }

    return data
  } catch (error) {
    console.error("Error in getWardPerformance:", error)
    return mockDataService.getWardPerformance()
  }
}

// Get comment sentiment
export async function getCommentSentiment() {
  try {
    const supabase = getSupabase()
    const { data, error } = await getCommentSentimentQuery(supabase)

    if (error) {
      console.error("Error fetching comment sentiment:", error)
      return mockDataService.getCommentSentiment()
    }

    return data
  } catch (error) {
    console.error("Error in getCommentSentiment:", error)
    return mockDataService.getCommentSentiment()
  }
}

// Get top concerns
export async function getTopConcerns() {
  try {
    const supabase = getSupabase()
    const { data, error } = await getTopConcernsQuery(supabase)

    if (error) {
      console.error("Error fetching top concerns:", error)
      return mockDataService.getTopConcerns()
    }

    return data
  } catch (error) {
    console.error("Error in getTopConcerns:", error)
    return mockDataService.getTopConcerns()
  }
}

// Get recent surveys
export async function getRecentSurveys() {
  try {
    const supabase = getSupabase()
    const { data, error } = await getRecentSurveysQuery(supabase)

    if (error) {
      console.error("Error fetching recent surveys:", error)
      return mockDataService.getRecentSurveys()
    }

    return data
  } catch (error) {
    console.error("Error in getRecentSurveys:", error)
    return mockDataService.getRecentSurveys()
  }
}
