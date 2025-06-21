"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IntroPageProps {
  surveyData: any;
  updateSurveyData: (field: string, value: any) => void;
  onNext: () => void;
}

export default function IntroPage({
  surveyData,
  updateSurveyData,
  onNext,
}: IntroPageProps) {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            How Can We Improve?
          </CardTitle>
          <CardDescription className="text-center text-base">
            Your feedback helps us deliver better healthcare services
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-primary">
              YOUR OPINIONS MAKE A DIFFERENCE
            </h2>

            <p className="text-sm">
              Committed to excellence, we are constantly looking to deliver to
              you the most cherished customer service experience. At AGA Health
              foundation, we aim to provide the highest standard of service for
              every client/patient/visitor.
            </p>

            <p className="text-sm">
              To help us measure our level of performance, we would be grateful
              if you would take a few minutes to complete this survey.
            </p>

            <div className="pt-2 border-t border-muted">
              <p className="text-sm font-semibold">#WeCherishYou</p>
              <p className="text-sm">Kwadwo Anim MD</p>
              <p className="text-sm">Executive Director</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="visitTime" className="text-base font-medium">
            When did you last visit the AGA Health Foundation?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={surveyData.visitTime}
            onValueChange={(value) => updateSurveyData("visitTime", value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="less-than-month" id="less-than-month" />
              <Label
                htmlFor="less-than-month"
                className="w-full cursor-pointer"
              >
                Less than a month ago
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="one-two-months" id="one-two-months" />
              <Label htmlFor="one-two-months" className="w-full cursor-pointer">
                One - Two months ago
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="three-six-months" id="three-six-months" />
              <Label
                htmlFor="three-six-months"
                className="w-full cursor-pointer"
              >
                Three - Six months ago
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem
                value="more-than-six-months"
                id="more-than-six-months"
              />
              <Label
                htmlFor="more-than-six-months"
                className="w-full cursor-pointer"
              >
                More than 6 months ago
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label htmlFor="visitPurpose" className="text-base font-medium">
            What was the main purpose of your visit?{" "}
            <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={surveyData.visitPurpose}
            onValueChange={(value) => updateSurveyData("visitPurpose", value)}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="General Practice" id="general-practice" />
              <Label
                htmlFor="general-practice"
                className="w-full cursor-pointer"
              >
                General Practice
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem
                value="Medicals (Occupational Health)"
                id="medicals"
              />
              <Label htmlFor="medicals" className="w-full cursor-pointer">
                Medical Surveillance{" "}
                <span className="text-xs">(Occupational Health)</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!surveyData.visitTime || !surveyData.visitPurpose}
          className="px-8"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
