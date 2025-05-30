export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      locations: {
        Row: {
          id: number
          name: string
          location_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          location_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          location_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      survey_submissions: {
        Row: {
          id: string
          submitted_at: string
          visit_time: "less-than-month" | "one-two-months" | "three-six-months" | "more-than-six-months"
          visit_purpose: "General Practice" | "Medicals (Occupational Health)"
          visited_other_places: boolean
          would_recommend: boolean | null
          why_not_recommend: string | null
          recommendation: string | null
          user_type: "AGAG Employee" | "AGAG/Contractor Dependant" | "Other Corporate Employee" | "Contractor Employee"
          patient_type: "New Patient" | "Returning Patient"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          submitted_at?: string
          visit_time: "less-than-month" | "one-two-months" | "three-six-months" | "more-than-six-months"
          visit_purpose: "General Practice" | "Medicals (Occupational Health)"
          visited_other_places?: boolean
          would_recommend?: boolean | null
          why_not_recommend?: string | null
          recommendation?: string | null
          user_type: "AGAG Employee" | "AGAG/Contractor Dependant" | "Other Corporate Employee" | "Contractor Employee"
          patient_type: "New Patient" | "Returning Patient"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          submitted_at?: string
          visit_time?: "less-than-month" | "one-two-months" | "three-six-months" | "more-than-six-months"
          visit_purpose?: "General Practice" | "Medicals (Occupational Health)"
          visited_other_places?: boolean
          would_recommend?: boolean | null
          why_not_recommend?: string | null
          recommendation?: string | null
          user_type?: "AGAG Employee" | "AGAG/Contractor Dependant" | "Other Corporate Employee" | "Contractor Employee"
          patient_type?: "New Patient" | "Returning Patient"
          created_at?: string
          updated_at?: string
        }
      }
      submission_locations: {
        Row: {
          id: number
          submission_id: string
          location_id: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: number
          submission_id: string
          location_id: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          submission_id?: string
          location_id?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      department_ratings: {
        Row: {
          id: number
          submission_id: string
          location_id: number
          category: string
          rating: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor"
          created_at: string
        }
        Insert: {
          id?: number
          submission_id: string
          location_id: number
          category: string
          rating: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor"
          created_at?: string
        }
        Update: {
          id?: number
          submission_id?: string
          location_id?: number
          category?: string
          rating?: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor"
          created_at?: string
        }
      }
      department_concerns: {
        Row: {
          id: number
          submission_id: string
          location_id: number
          concern: string
          created_at: string
        }
        Insert: {
          id?: number
          submission_id: string
          location_id: number
          concern: string
          created_at?: string
        }
        Update: {
          id?: number
          submission_id?: string
          location_id?: number
          concern?: string
          created_at?: string
        }
      }
      general_observations: {
        Row: {
          id: number
          submission_id: string
          category: string
          rating: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor"
          created_at: string
        }
        Insert: {
          id?: number
          submission_id: string
          category: string
          rating: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor"
          created_at?: string
        }
        Update: {
          id?: number
          submission_id?: string
          category?: string
          rating?: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor"
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      visit_time_enum: "less-than-month" | "one-two-months" | "three-six-months" | "more-than-six-months"
      visit_purpose_enum: "General Practice" | "Medicals (Occupational Health)"
      user_type_enum: "AGAG Employee" | "AGAG/Contractor Dependant" | "Other Corporate Employee" | "Contractor Employee"
      patient_type_enum: "New Patient" | "Returning Patient"
      rating_enum: "Excellent" | "Very Good" | "Good" | "Fair" | "Poor"
    }
  }
}
