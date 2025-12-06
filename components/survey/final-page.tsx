"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface FinalPageProps {
  surveyData: any;
  updateSurveyData: (field: string, value: any) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export default function FinalPage({
  surveyData,
  updateSurveyData,
  onBack,
  onSubmit,
  isSubmitting = false,
}: FinalPageProps) {
  const generalCategories = [
    { id: "cleanliness", label: "Cleanliness/serenity" },
    { id: "facilities", label: "Facilities" },
    { id: "security", label: "Security" },
    { id: "overall", label: "Overall impression" },
  ];

  const ratingOptions = ["Excellent", "Very Good", "Good", "Fair", "Poor"];

  const handleGeneralRatingChange = (category: string, value: string) => {
    updateSurveyData("generalObservation", {
      ...surveyData.generalObservation,
      [category]: value,
    });
  };

  const isComplete = () => {
    // Check if all general ratings are complete
    const generalComplete = generalCategories.every(
      (category) => surveyData.generalObservation[category.id]
    );

    // Check if recommendation is selected
    const recommendationComplete = surveyData.wouldRecommend !== "";

    // If "No" is selected for recommendation, check if reason is provided
    const reasonComplete =
      surveyData.wouldRecommend !== "No" ||
      (surveyData.wouldRecommend === "No" &&
        surveyData.whyNotRecommend.trim() !== "");

    // Check if user type is selected
    const userTypeComplete = surveyData.userType !== "";

    // Patient type is now automatically set in intro page, no need to check

    return (
      generalComplete &&
      recommendationComplete &&
      reasonComplete &&
      userTypeComplete
    );
  };

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold text-primary">
            General Observation
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
                  {generalCategories.map((category) => (
                    <tr key={category.id} className="border-t">
                      <td className="py-3 text-sm">
                        {category.label} <span className="text-red-500">*</span>
                      </td>
                      {ratingOptions.map((option) => (
                        <td key={option} className="text-center py-3">
                          <RadioGroup
                            value={
                              surveyData.generalObservation[category.id] || ""
                            }
                            onValueChange={(value) =>
                              handleGeneralRatingChange(category.id, value)
                            }
                            className="flex justify-center"
                          >
                            <RadioGroupItem
                              value={option}
                              id={`general-${category.id}-${option}`}
                              className="h-4 w-4 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                          </RadioGroup>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold text-primary">
            Conclusion/Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="recommend" className="text-base font-medium">
                Would You Recommend The Hospital To Others?{" "}
                <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={surveyData.wouldRecommend}
                onValueChange={(value) =>
                  updateSurveyData("wouldRecommend", value)
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Yes"
                    id="recommend-yes"
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label htmlFor="recommend-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="No"
                    id="recommend-no"
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label htmlFor="recommend-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {surveyData.wouldRecommend === "No" && (
              <div className="space-y-2 bg-muted/30 p-4 rounded-md">
                <Label
                  htmlFor="why-not-recommend"
                  className="text-base font-medium"
                >
                  If No, Please Tell Us Why:{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="why-not-recommend"
                  value={surveyData.whyNotRecommend}
                  onChange={(e) =>
                    updateSurveyData("whyNotRecommend", e.target.value)
                  }
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="recommendation" className="text-base font-medium">
                If You Have Any Recommendation To Help Us Improve The Services
                We Offer, Please Tell Us About It:
              </Label>
              <Textarea
                id="recommendation"
                value={surveyData.recommendation}
                onChange={(e) =>
                  updateSurveyData("recommendation", e.target.value)
                }
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold text-primary">
            Some Information About You
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">
                I am a/an: <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={surveyData.userType}
                onValueChange={(value) => updateSurveyData("userType", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem
                    value="AGAG Employee"
                    id="agag-employee"
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label
                    htmlFor="agag-employee"
                    className="w-full cursor-pointer"
                  >
                    AGAG Employee
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem
                    value="AGAG/Contractor Dependant"
                    id="agag-dependant"
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label
                    htmlFor="agag-dependant"
                    className="w-full cursor-pointer"
                  >
                    AGAG/Contractor Dependant
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem
                    value="Community"
                    id="community"
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label
                    htmlFor="community"
                    className="w-full cursor-pointer"
                  >
                    Community
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem
                    value="Contractor Employee"
                    id="contractor-employee"
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label
                    htmlFor="contractor-employee"
                    className="w-full cursor-pointer"
                  >
                    Contractor Employee
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
                  <RadioGroupItem
                    value="Other Corporate Employee"
                    id="corporate-employee"
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label
                    htmlFor="corporate-employee"
                    className="w-full cursor-pointer"
                  >
                    Other Corporate Employee
                  </Label>
                </div>

              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!isComplete() || isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
