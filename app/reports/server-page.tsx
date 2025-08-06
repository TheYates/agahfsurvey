import { authServer } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { ReportsClient } from "./reports-client";
import {
  getSurveyData,
  getTotalSubmissionCount,
  getLocationVisits,
  getDepartmentRatings,
  fetchOverallSatisfactionDistribution,
  getRecommendationRate,
  getAverageSatisfaction,
  getSatisfactionByLocation,
} from "@/app/actions/page-actions";

// Server-side data fetching with parallel execution
async function getReportsData() {
  try {
    // Execute all data fetching operations in parallel
    const [
      surveyData,
      totalCount,
      locationVisits,
      departmentRatings,
      satisfactionDistribution,
      recommendationRate,
      averageSatisfaction,
      satisfactionByLocation,
    ] = await Promise.all([
      getSurveyData(),
      getTotalSubmissionCount(),
      getLocationVisits(),
      getDepartmentRatings(),
      fetchOverallSatisfactionDistribution(),
      getRecommendationRate(),
      getAverageSatisfaction(),
      getSatisfactionByLocation(),
    ]);

    // Process the data on the server
    const processedData = {
      submissions: surveyData?.slice(0, 5) || [],
      totalResponses: totalCount || 0,
      locationVisits: locationVisits || [],
      departmentRatings: departmentRatings || [],
      satisfactionData: satisfactionDistribution || [],
      recommendationRate: recommendationRate || 0,
      averageSatisfaction: averageSatisfaction || "N/A",
      satisfactionByLocation: satisfactionByLocation || [],
    };

    // Calculate weekly responses
    if (surveyData?.length > 0) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const responsesThisWeek = surveyData.filter((survey: any) => {
        const surveyDate = new Date(survey.created_at);
        return surveyDate >= oneWeekAgo;
      }).length;

      processedData.weeklyResponses = responsesThisWeek;
    } else {
      processedData.weeklyResponses = 0;
    }

    // Process location data
    if (locationVisits?.length > 0) {
      const sortedLocations = locationVisits
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 10);
      processedData.locationData = sortedLocations;
    } else {
      processedData.locationData = [];
    }

    return processedData;
  } catch (error) {
    console.error("Error fetching reports data:", error);
    return {
      submissions: [],
      totalResponses: 0,
      locationVisits: [],
      departmentRatings: [],
      satisfactionData: [],
      recommendationRate: 0,
      averageSatisfaction: "N/A",
      satisfactionByLocation: [],
      weeklyResponses: 0,
      locationData: [],
    };
  }
}

export default async function ReportsPage() {
  // Check authentication on the server
  const { data: { session } } = await authServer.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  // Fetch all data on the server in parallel
  const reportsData = await getReportsData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ReportsClient initialData={reportsData} />
      </div>
    </div>
  );
}
