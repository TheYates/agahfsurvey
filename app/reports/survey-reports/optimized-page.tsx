import { authServer } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { fetchOptimizedSurveyData } from "@/app/actions/optimized-survey-actions";
import { OptimizedSurveyReportsClient } from "./optimized-client";

// Server-side data fetching with optimized queries
async function getOptimizedSurveyReportsData() {
  try {
    console.time("Server-side data fetch");
    
    // Single optimized query instead of multiple sequential calls
    const data = await fetchOptimizedSurveyData();
    
    console.timeEnd("Server-side data fetch");
    return data;
  } catch (error) {
    console.error("Error fetching optimized survey reports data:", error);
    return {
      overview: {
        totalResponses: 0,
        recommendRate: 0,
        avgSatisfaction: 0,
        purposeDistribution: [],
        satisfactionByDemographic: {
          byUserType: [],
          byPatientType: []
        },
        visitTimeAnalysis: [],
        improvementAreas: []
      },
      wards: [],
      departments: [],
      concerns: []
    };
  }
}

export default async function OptimizedSurveyReportsPage() {
  // Check authentication on the server
  const { data: { session } } = await authServer.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  // Fetch all data on the server in a single optimized call
  const surveyData = await getOptimizedSurveyReportsData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <OptimizedSurveyReportsClient initialData={surveyData} />
      </div>
    </div>
  );
}
