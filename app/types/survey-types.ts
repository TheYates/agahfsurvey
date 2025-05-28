export interface SurveyData {
  id: string | number;
  created_at: string;
  visit_purpose?: string;
  locations_visited?: string[];
  recommendation_rating: number;
  overall_rating: number;
  wouldRecommend?: boolean;
}

export interface LocationVisit {
  location: string;
  visit_count: number;
}

export interface DepartmentRating {
  locationName: string;
  category: string;
  rating: string;
  count: number;
}

export interface SatisfactionDistribution {
  name: string;
  value: number;
}
