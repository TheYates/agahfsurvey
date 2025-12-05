export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      Location: {
        Row: {
          id: number;
          name: string;
          locationType: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: number;
          name: string;
          locationType: string;
          createdAt?: string;
          updatedAt: string;
        };
        Update: {
          id?: number;
          name?: string;
          locationType?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      SurveySubmission: {
        Row: {
          id: string;
          visitTime: string;
          visitPurpose: string;
          visitedOtherPlaces: boolean;
          wouldRecommend: boolean | null;
          whyNotRecommend: string | null;
          recommendation: string | null;
          userType: string;
          patientType: string;
          submittedAt: string;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          visitTime: string;
          visitPurpose: string;
          visitedOtherPlaces?: boolean;
          wouldRecommend?: boolean | null;
          whyNotRecommend?: string | null;
          recommendation?: string | null;
          userType: string;
          patientType: string;
          submittedAt?: string;
          createdAt?: string;
          updatedAt: string;
        };
        Update: {
          id?: string;
          visitTime?: string;
          visitPurpose?: string;
          visitedOtherPlaces?: boolean;
          wouldRecommend?: boolean | null;
          whyNotRecommend?: string | null;
          recommendation?: string | null;
          userType?: string;
          patientType?: string;
          submittedAt?: string;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      SubmissionLocation: {
        Row: {
          id: number;
          submissionId: string;
          locationId: number;
          isPrimary: boolean;
          createdAt: string;
        };
        Insert: {
          id?: number;
          submissionId: string;
          locationId: number;
          isPrimary?: boolean;
          createdAt?: string;
        };
        Update: {
          id?: number;
          submissionId?: string;
          locationId?: number;
          isPrimary?: boolean;
          createdAt?: string;
        };
      };
      DepartmentConcern: {
        Row: {
          id: number;
          submissionId: string;
          locationId: number;
          concern: string;
          createdAt: string;
        };
        Insert: {
          id?: number;
          submissionId: string;
          locationId: number;
          concern: string;
          createdAt?: string;
        };
        Update: {
          id?: number;
          submissionId?: string;
          locationId?: number;
          concern?: string;
          createdAt?: string;
        };
      };
      Rating: {
        Row: {
          id: number;
          submissionId: string;
          locationId: number;
          reception: string | null;
          professionalism: string | null;
          understanding: string | null;
          promptnessCare: string | null;
          promptnessFeedback: string | null;
          overall: string | null;
          admission: string | null;
          nurseProfessionalism: string | null;
          doctorProfessionalism: string | null;
          discharge: string | null;
          foodQuality: string | null;
          wouldRecommend: boolean | null;
          createdAt: string;
        };
        Insert: {
          id?: number;
          submissionId: string;
          locationId: number;
          reception?: string | null;
          professionalism?: string | null;
          understanding?: string | null;
          promptnessCare?: string | null;
          promptnessFeedback?: string | null;
          overall?: string | null;
          admission?: string | null;
          nurseProfessionalism?: string | null;
          doctorProfessionalism?: string | null;
          discharge?: string | null;
          foodQuality?: string | null;
          wouldRecommend?: boolean | null;
          createdAt?: string;
        };
        Update: {
          id?: number;
          submissionId?: string;
          locationId?: number;
          reception?: string | null;
          professionalism?: string | null;
          understanding?: string | null;
          promptnessCare?: string | null;
          promptnessFeedback?: string | null;
          overall?: string | null;
          admission?: string | null;
          nurseProfessionalism?: string | null;
          doctorProfessionalism?: string | null;
          discharge?: string | null;
          foodQuality?: string | null;
          wouldRecommend?: boolean | null;
          createdAt?: string;
        };
      };
      GeneralObservation: {
        Row: {
          id: number;
          submissionId: string;
          cleanliness: string | null;
          facilities: string | null;
          security: string | null;
          overall: string | null;
          createdAt: string;
        };
        Insert: {
          id?: number;
          submissionId: string;
          cleanliness?: string | null;
          facilities?: string | null;
          security?: string | null;
          overall?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: number;
          submissionId?: string;
          cleanliness?: string | null;
          facilities?: string | null;
          security?: string | null;
          overall?: string | null;
          createdAt?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {};
  };
};
