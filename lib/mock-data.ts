import type {
  DepartmentRating,
  LocationVisit,
  SurveyData,
  WardRating,
  CanteenRating,
  OccupationalHealthRating,
  DepartmentConcern,
  ServicePointFeedback,
} from "@/types"

// Mock data for development and testing
export const mockDataService = {
  getSurveyData: (): SurveyData[] => [
    {
      id: 1,
      created_at: new Date().toISOString(),
      patient_type: "Inpatient",
      visit_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      overall_rating: 4,
      recommendation_rating: 8,
      comments: "Overall good experience, but waiting times could be improved.",
      email: "patient1@example.com",
      locations_visited: ["Emergency", "Radiology", "Ward 3B"],
    },
    {
      id: 2,
      created_at: new Date().toISOString(),
      patient_type: "Outpatient",
      visit_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      overall_rating: 3,
      recommendation_rating: 6,
      comments: "Staff were friendly but facilities need updating.",
      email: "patient2@example.com",
      locations_visited: ["Outpatient Clinic", "Pharmacy"],
    },
    {
      id: 3,
      created_at: new Date().toISOString(),
      patient_type: "Visitor",
      visit_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      overall_rating: 5,
      recommendation_rating: 9,
      comments: "Excellent care provided to my family member.",
      email: "visitor1@example.com",
      locations_visited: ["Ward 5A", "Cafeteria"],
    },
  ],

  getDepartmentRatings: (): DepartmentRating[] => [
    {
      id: 1,
      survey_id: 1,
      department: "Emergency",
      cleanliness_rating: 4,
      staff_friendliness_rating: 5,
      waiting_time_rating: 3,
      treatment_explanation_rating: 4,
      overall_rating: 4,
      comments: "Quick response but long wait for test results.",
    },
    {
      id: 2,
      survey_id: 1,
      department: "Radiology",
      cleanliness_rating: 5,
      staff_friendliness_rating: 4,
      waiting_time_rating: 3,
      treatment_explanation_rating: 5,
      overall_rating: 4,
      comments: "Very clean, staff explained procedure well.",
    },
    {
      id: 3,
      survey_id: 2,
      department: "Outpatient Clinic",
      cleanliness_rating: 3,
      staff_friendliness_rating: 4,
      waiting_time_rating: 2,
      treatment_explanation_rating: 4,
      overall_rating: 3,
      comments: "Long waiting times, but good consultation.",
    },
  ],

  getWardRatings: (): WardRating[] => [
    {
      id: 1,
      survey_id: 1,
      ward: "Ward 3B",
      cleanliness_rating: 4,
      noise_level_rating: 3,
      food_quality_rating: 3,
      staff_responsiveness_rating: 5,
      visitor_accommodation_rating: 4,
      overall_rating: 4,
      comments: "Nurses were excellent, but ward was noisy at night.",
    },
    {
      id: 2,
      survey_id: 3,
      ward: "Ward 5A",
      cleanliness_rating: 5,
      noise_level_rating: 4,
      food_quality_rating: 4,
      staff_responsiveness_rating: 5,
      visitor_accommodation_rating: 5,
      overall_rating: 5,
      comments: "Excellent care all around. Very attentive staff.",
    },
  ],

  getCanteenRatings: (): CanteenRating[] => [
    {
      id: 1,
      survey_id: 3,
      cleanliness_rating: 4,
      food_quality_rating: 3,
      value_for_money_rating: 3,
      staff_friendliness_rating: 4,
      overall_rating: 3,
      comments: "Good variety but a bit expensive.",
    },
  ],

  getOccupationalHealthRatings: (): OccupationalHealthRating[] => [
    {
      id: 1,
      survey_id: 2,
      waiting_time_rating: 3,
      staff_knowledge_rating: 4,
      treatment_effectiveness_rating: 4,
      follow_up_care_rating: 3,
      overall_rating: 4,
      comments: "Good service but follow-up could be improved.",
    },
  ],

  getDepartmentConcerns: (): DepartmentConcern[] => [
    {
      id: 1,
      survey_id: 1,
      department: "Emergency",
      concern: "Waiting times are too long, especially for elderly patients.",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      survey_id: 2,
      department: "Outpatient Clinic",
      concern: "The scheduling system needs improvement. Had to wait despite having an appointment.",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      survey_id: 3,
      department: "Pharmacy",
      concern: "Not enough staff during peak hours, resulting in long queues.",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],

  getServicePointFeedback: (): ServicePointFeedback[] => [
    {
      id: 1,
      service_point_id: "reception-main",
      rating: 4,
      comment: "Quick and helpful service",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      service_point_id: "pharmacy-1",
      rating: 3,
      comment: "Long wait but friendly staff",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      service_point_id: "cafeteria",
      rating: 5,
      comment: "Great food and service",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],

  getLocationVisits: (): LocationVisit[] => [
    {
      location: "Emergency",
      visit_count: 45,
      average_rating: 3.8,
    },
    {
      location: "Radiology",
      visit_count: 32,
      average_rating: 4.2,
    },
    {
      location: "Outpatient Clinic",
      visit_count: 78,
      average_rating: 3.9,
    },
    {
      location: "Pharmacy",
      visit_count: 56,
      average_rating: 3.5,
    },
    {
      location: "Ward 3B",
      visit_count: 23,
      average_rating: 4.1,
    },
    {
      location: "Ward 5A",
      visit_count: 19,
      average_rating: 4.4,
    },
    {
      location: "Cafeteria",
      visit_count: 67,
      average_rating: 3.7,
    },
  ],

  getOverallSatisfactionTrend: () => [
    { month: "Jan", rating: 3.8 },
    { month: "Feb", rating: 3.9 },
    { month: "Mar", rating: 4.0 },
    { month: "Apr", rating: 3.7 },
    { month: "May", rating: 3.9 },
    { month: "Jun", rating: 4.1 },
    { month: "Jul", rating: 4.2 },
    { month: "Aug", rating: 4.3 },
    { month: "Sep", rating: 4.1 },
    { month: "Oct", rating: 4.0 },
    { month: "Nov", rating: 4.2 },
    { month: "Dec", rating: 4.4 },
  ],

  getPatientTypeDistribution: () => [
    { type: "Inpatient", count: 245 },
    { type: "Outpatient", count: 412 },
    { type: "Visitor", count: 178 },
  ],

  getRecommendationScores: () => [
    { score: 1, count: 12 },
    { score: 2, count: 18 },
    { score: 3, count: 25 },
    { score: 4, count: 32 },
    { score: 5, count: 45 },
    { score: 6, count: 58 },
    { score: 7, count: 87 },
    { score: 8, count: 124 },
    { score: 9, count: 156 },
    { score: 10, count: 178 },
  ],

  getDepartmentPerformance: () => [
    {
      department: "Emergency",
      metrics: {
        cleanliness: 4.1,
        staff_friendliness: 4.3,
        waiting_time: 3.2,
        treatment_explanation: 4.0,
        overall: 3.9,
      },
    },
    {
      department: "Radiology",
      metrics: {
        cleanliness: 4.5,
        staff_friendliness: 4.2,
        waiting_time: 3.7,
        treatment_explanation: 4.4,
        overall: 4.2,
      },
    },
    {
      department: "Outpatient Clinic",
      metrics: {
        cleanliness: 4.3,
        staff_friendliness: 4.1,
        waiting_time: 3.0,
        treatment_explanation: 4.2,
        overall: 3.9,
      },
    },
    {
      department: "Pharmacy",
      metrics: {
        cleanliness: 4.4,
        staff_friendliness: 3.9,
        waiting_time: 2.8,
        treatment_explanation: 4.0,
        overall: 3.8,
      },
    },
  ],

  getWardPerformance: () => [
    {
      ward: "Ward 3B",
      metrics: {
        cleanliness: 4.2,
        noise_level: 3.5,
        food_quality: 3.7,
        staff_responsiveness: 4.5,
        visitor_accommodation: 4.0,
        overall: 4.0,
      },
    },
    {
      ward: "Ward 5A",
      metrics: {
        cleanliness: 4.6,
        noise_level: 4.0,
        food_quality: 3.9,
        staff_responsiveness: 4.7,
        visitor_accommodation: 4.3,
        overall: 4.3,
      },
    },
    {
      ward: "Ward 2C",
      metrics: {
        cleanliness: 4.1,
        noise_level: 3.3,
        food_quality: 3.5,
        staff_responsiveness: 4.2,
        visitor_accommodation: 3.8,
        overall: 3.8,
      },
    },
  ],

  getCommentSentiment: () => [
    { sentiment: "Positive", count: 425 },
    { sentiment: "Neutral", count: 187 },
    { sentiment: "Negative", count: 123 },
  ],

  getTopConcerns: () => [
    { concern: "Waiting Times", count: 87 },
    { concern: "Communication", count: 54 },
    { concern: "Facilities", count: 42 },
    { concern: "Staff Shortage", count: 38 },
    { concern: "Food Quality", count: 29 },
  ],

  getRecentSurveys: () => [
    {
      id: 101,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      patient_type: "Inpatient",
      overall_rating: 4,
      recommendation: 8,
    },
    {
      id: 102,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      patient_type: "Outpatient",
      overall_rating: 5,
      recommendation: 9,
    },
    {
      id: 103,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      patient_type: "Visitor",
      overall_rating: 3,
      recommendation: 6,
    },
    {
      id: 104,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      patient_type: "Inpatient",
      overall_rating: 4,
      recommendation: 7,
    },
    {
      id: 105,
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      patient_type: "Outpatient",
      overall_rating: 2,
      recommendation: 4,
    },
  ],
}
