"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface OccupationalHealthRatingProps {
  surveyData: any;
  updateSurveyData: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function OccupationalHealthRating({
  surveyData,
  updateSurveyData,
  onNext,
  onBack,
}: OccupationalHealthRatingProps) {
  const [location, setLocation] = useState(
    "Occupational Health Unit (Medicals)"
  );

  useEffect(() => {
    // Fetch the occupational health location from the database
    async function fetchOccupationalHealthLocation() {
      try {
        const { data, error } = await supabase
          .from("Location")
          .select("*")
          .eq("locationType", "occupational_health")
          .single();

        if (error) {
          console.error("Error fetching occupational health location:", error);
          return;
        }

        if (data) {
          console.log("Found occupational health location:", data);
          setLocation(data.name);

          // Automatically add this location to the survey data locations
          if (!surveyData.locations.includes(data.name)) {
            console.log(
              "Adding occupational health location to survey data locations"
            );
            const updatedLocations = [...surveyData.locations, data.name];
            updateSurveyData("locations", updatedLocations);
          }
        } else {
          console.warn("No occupational health location found in database");
        }
      } catch (error) {
        console.error("Error in fetchOccupationalHealthLocation:", error);
      }
    }

    fetchOccupationalHealthLocation();
  }, [surveyData.locations, updateSurveyData]);

  const ratingCategories = [
    { id: "reception", label: "Reception/Customer service" },
    { id: "professionalism", label: "Professionalism of personnel" },
    { id: "understanding", label: "Understanding of needs" },
    { id: "promptness-care", label: "Promptness of care" },
    {
      id: "promptness-feedback",
      label:
        "Promptness of feedback - communicating delays, explaining medication, procedure, changes etc.",
    },
    { id: "overall", label: "Overall impression" },
  ];

  const ratingOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

  const handleRatingChange = (category: string, value: string) => {
    // Create a new object for the current location's ratings
    const updatedRatings = {
      ...surveyData.departmentRatings,
      [location]: {
        ...(surveyData.departmentRatings[location] || {}),
        [category]: value,
      },
    };

    // Update the state with the new ratings
    updateSurveyData("departmentRatings", updatedRatings);

    // Log the update
  };

  const handleConcernsChange = (value: string) => {
    updateSurveyData("departmentConcerns", {
      ...surveyData.departmentConcerns,
      [location]: value,
    });
  };

  const isComplete = () => {
    // We'll still log the completion status but won't require all fields
    const ratings = surveyData.departmentRatings[location] || {};
    const complete = ratingCategories.some((category) => ratings[category.id]);

    // Return true to always enable the Next button, or require at least one rating
    return complete;
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold text-center text-primary">
            {location}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-sm py-2 w-1/3"></th>
                    {ratingOptions.map((option) => (
                      <th
                        key={option}
                        className="text-center font-medium text-sm py-2"
                      >
                        {option}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ratingCategories.map((category) => {
                    const currentRatings =
                      surveyData.departmentRatings[location] || {};
                    return (
                      <tr key={category.id} className="border-t">
                        <td className="py-3 text-sm">
                          {category.label}{" "}
                          <span className="text-red-500">*</span>
                        </td>
                        {ratingOptions.map((option) => (
                          <td key={option} className="text-center py-3">
                            <RadioGroup
                              key={`${location}-${category.id}`}
                              value={currentRatings[category.id] || ""}
                              onValueChange={(value) =>
                                handleRatingChange(category.id, value)
                              }
                              className="flex justify-center"
                            >
                              <RadioGroupItem
                                value={option}
                                id={`${location}-${category.id}-${option}`}
                                className="h-4 w-4 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                              />
                            </RadioGroup>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${location}-concerns`} className="text-base">
                Any Concerns or Recommendations Regarding This Unit?
              </Label>
              <Textarea
                id={`${location}-concerns`}
                value={surveyData.departmentConcerns[location] || ""}
                onChange={(e) => handleConcernsChange(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={() => {
            // Simply proceed to the next step without validation
            onNext();
          }}
          disabled={!isComplete()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
