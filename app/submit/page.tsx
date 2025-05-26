"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLocations } from "@/hooks/use-locations"
import { submitSurvey, type SurveyFormData } from "@/app/actions/survey-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

export default function SurveySubmissionPage() {
  const router = useRouter()
  const {
    departmentLocations,
    wardLocations,
    canteenLocations,
    occupationalHealthLocations,
    loading: locationsLoading,
  } = useLocations()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<SurveyFormData>>({
    visitTime: "less-than-month",
    visitPurpose: "General Practice",
    visitedOtherPlaces: false,
    wouldRecommend: true,
    userType: "AGAG Employee",
    patientType: "New Patient",
    departmentRatings: [],
    generalObservations: [
      { category: "cleanliness", rating: "Good" },
      { category: "facilities", rating: "Good" },
      { category: "security", rating: "Good" },
      { category: "overall", rating: "Good" },
    ],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.primaryLocation) {
      alert("Please select a primary location")
      return
    }

    setIsSubmitting(true)

    try {
      // This is a simplified version - in a real app, you'd need to collect all the required data
      const result = await submitSurvey(formData as SurveyFormData)

      if (result.success) {
        alert("Survey submitted successfully!")
        router.push("/thank-you")
      } else {
        alert(`Failed to submit survey: ${result.error}`)
      }
    } catch (error) {
      console.error("Error submitting survey:", error)
      alert("An error occurred while submitting the survey")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (locationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading survey form...</span>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Experience Survey</CardTitle>
          <CardDescription>Please share your feedback about your recent visit to our hospital</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Visit Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Visit Information</h3>

              <div>
                <Label htmlFor="visitTime">When did you visit?</Label>
                <RadioGroup
                  id="visitTime"
                  value={formData.visitTime}
                  onValueChange={(value) => setFormData({ ...formData, visitTime: value as any })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="less-than-month" id="less-than-month" />
                    <Label htmlFor="less-than-month">Less than a month ago</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-two-months" id="one-two-months" />
                    <Label htmlFor="one-two-months">1-2 months ago</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="three-six-months" id="three-six-months" />
                    <Label htmlFor="three-six-months">3-6 months ago</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="more-than-six-months" id="more-than-six-months" />
                    <Label htmlFor="more-than-six-months">More than 6 months ago</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="visitPurpose">Purpose of visit</Label>
                <RadioGroup
                  id="visitPurpose"
                  value={formData.visitPurpose}
                  onValueChange={(value) => setFormData({ ...formData, visitPurpose: value as any })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="General Practice" id="general-practice" />
                    <Label htmlFor="general-practice">General Practice</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medicals (Occupational Health)" id="occupational-health" />
                    <Label htmlFor="occupational-health">Medicals (Occupational Health)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="primaryLocation">Primary location visited</Label>
                <Select
                  value={formData.primaryLocation?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, primaryLocation: Number.parseInt(value) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select" disabled>
                      Select a location
                    </SelectItem>

                    {departmentLocations.length > 0 && (
                      <>
                        <SelectItem value="departments-header" disabled className="font-semibold">
                          Departments
                        </SelectItem>
                        {departmentLocations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    {wardLocations.length > 0 && (
                      <>
                        <SelectItem value="wards-header" disabled className="font-semibold">
                          Wards
                        </SelectItem>
                        {wardLocations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    {canteenLocations.length > 0 && (
                      <>
                        <SelectItem value="canteen-header" disabled className="font-semibold">
                          Canteen
                        </SelectItem>
                        {canteenLocations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </>
                    )}

                    {occupationalHealthLocations.length > 0 && (
                      <>
                        <SelectItem value="occupational-health-header" disabled className="font-semibold">
                          Occupational Health
                        </SelectItem>
                        {occupationalHealthLocations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="visitedOtherPlaces"
                  checked={formData.visitedOtherPlaces}
                  onCheckedChange={(checked) => setFormData({ ...formData, visitedOtherPlaces: !!checked })}
                />
                <Label htmlFor="visitedOtherPlaces">I visited other locations during my visit</Label>
              </div>
            </div>

            {/* Recommendation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recommendation</h3>

              <div>
                <Label htmlFor="wouldRecommend">Would you recommend our hospital to others?</Label>
                <RadioGroup
                  id="wouldRecommend"
                  value={formData.wouldRecommend ? "yes" : "no"}
                  onValueChange={(value) => setFormData({ ...formData, wouldRecommend: value === "yes" })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="recommend-yes" />
                    <Label htmlFor="recommend-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="recommend-no" />
                    <Label htmlFor="recommend-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.wouldRecommend === false && (
                <div>
                  <Label htmlFor="whyNotRecommend">Why would you not recommend us?</Label>
                  <Textarea
                    id="whyNotRecommend"
                    value={formData.whyNotRecommend || ""}
                    onChange={(e) => setFormData({ ...formData, whyNotRecommend: e.target.value })}
                    className="mt-2"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="recommendation">Do you have any recommendations for improvement?</Label>
                <Textarea
                  id="recommendation"
                  value={formData.recommendation || ""}
                  onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">About You</h3>

              <div>
                <Label htmlFor="userType">User Type</Label>
                <RadioGroup
                  id="userType"
                  value={formData.userType}
                  onValueChange={(value) => setFormData({ ...formData, userType: value as any })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AGAG Employee" id="agag-employee" />
                    <Label htmlFor="agag-employee">AGAG Employee</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="AGAG/Contractor Dependant" id="agag-dependant" />
                    <Label htmlFor="agag-dependant">AGAG/Contractor Dependant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other Corporate Employee" id="corporate-employee" />
                    <Label htmlFor="corporate-employee">Other Corporate Employee</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Contractor Employee" id="contractor-employee" />
                    <Label htmlFor="contractor-employee">Contractor Employee</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="patientType">Patient Type</Label>
                <RadioGroup
                  id="patientType"
                  value={formData.patientType}
                  onValueChange={(value) => setFormData({ ...formData, patientType: value as any })}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="New Patient" id="new-patient" />
                    <Label htmlFor="new-patient">New Patient</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Returning Patient" id="returning-patient" />
                    <Label htmlFor="returning-patient">Returning Patient</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Survey"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
