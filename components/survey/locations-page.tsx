"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationsPageProps {
  surveyData: any;
  updateSurveyData: (field: string, value: any) => void;
  onNext: () => void;
  onBack: () => void;
  departmentLocations?: string[];
  wardLocations?: string[];
  canteenLocations?: string[];
  occupationalHealthLocations?: string[];
}

export default function LocationsPage({
  surveyData,
  updateSurveyData,
  onNext,
  onBack,
  departmentLocations = [],
  wardLocations = [],
  canteenLocations = [],
  occupationalHealthLocations = [],
}: LocationsPageProps) {
  // Create location groups based on the data from the database
  const locationGroups = [
    {
      title: "Clinics & Departments",
      locations: departmentLocations,
    },
    {
      title: "Wards",
      locations: wardLocations,
    },
    {
      title: "Other Services",
      locations: [...canteenLocations, ...occupationalHealthLocations],
    },
  ].filter((group) => group.locations.length > 0);

  const handleLocationChange = (location: string, checked: boolean) => {
    const updatedLocations = checked
      ? [...surveyData.locations, location]
      : surveyData.locations.filter((loc: string) => loc !== location);

    updateSurveyData("locations", updatedLocations);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl font-bold">
            Where did you visit? <span className="text-red-500">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-6">
            {locationGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {group.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {group.locations.map((location) => (
                    <div
                      key={location}
                      className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
                        surveyData.locations.includes(location)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <Checkbox
                        id={location.toLowerCase().replace(/\s+/g, "-")}
                        checked={surveyData.locations.includes(location)}
                        onCheckedChange={(checked) =>
                          handleLocationChange(location, checked as boolean)
                        }
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <Label
                        htmlFor={location.toLowerCase().replace(/\s+/g, "-")}
                        className="w-full cursor-pointer"
                      >
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={surveyData.locations.length === 0}>
          Next
        </Button>
      </div>
    </div>
  );
}
