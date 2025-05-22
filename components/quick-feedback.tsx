"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { submitServicePointFeedback } from "@/app/actions/service-point-actions";

interface QuickFeedbackProps {
  servicePointId: number;
  servicePointName: string;
  showRecommendQuestion?: boolean;
  showCommentsBox?: boolean;
}

export function QuickFeedback({
  servicePointId,
  servicePointName,
  showRecommendQuestion = true,
  showCommentsBox = true,
}: QuickFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleEmojiClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === null) return;

    setIsSubmitting(true);
    try {
      const result = await submitServicePointFeedback(
        servicePointId,
        rating,
        comment,
        recommend === null ? undefined : recommend
      );
      if (result.success) {
        router.push("/feedback/thank-you");
      } else {
        alert("Failed to submit feedback. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const getEmojiColor = (emojiRating: number) => {
    if (rating === null) return "text-gray-300";
    if (emojiRating === rating) {
      switch (emojiRating) {
        case 1:
          return "text-red-500";
        case 2:
          return "text-red-400";
        case 3:
          return "text-orange-400";
        case 4:
          return "text-yellow-400";
        case 5:
          return "text-green-500";
      }
    }
    return "text-gray-300 opacity-40";
  };

  const getEmojiForRating = (emojiRating: number) => {
    switch (emojiRating) {
      case 1:
        return "😡";
      case 2:
        return "🙁";
      case 3:
        return "😐";
      case 4:
        return "🙂";
      case 5:
        return "😄";
    }
  };

  const getEmojiLabel = (emojiRating: number) => {
    switch (emojiRating) {
      case 1:
        return "Very Unsatisfied";
      case 2:
        return "Unsatisfied";
      case 3:
        return "Neutral";
      case 4:
        return "Satisfied";
      case 5:
        return "Very Satisfied";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle>How was your experience?</CardTitle>
        <CardDescription>{servicePointName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center px-0 sm:px-2 gap-1 sm:gap-2 md:gap-4">
          {[1, 2, 3, 4, 5].map((emojiRating) => (
            <div
              key={emojiRating}
              className={`flex flex-col items-center transition-opacity duration-200 ${
                rating !== null && rating !== emojiRating ? "opacity-70" : ""
              }`}
            >
              <button
                onClick={() => handleEmojiClick(emojiRating)}
                className={`text-4xl sm:text-5xl md:text-6xl transition-transform ${
                  rating === emojiRating ? "transform scale-125" : ""
                } focus:outline-none mb-2 sm:mb-3`}
                aria-label={`Rate ${emojiRating} out of 5`}
              >
                <span className={getEmojiColor(emojiRating)}>
                  {getEmojiForRating(emojiRating)}
                </span>
              </button>
              <span
                className={`text-[10px] sm:text-xs md:text-sm text-center font-medium max-w-12 sm:max-w-16 ${
                  rating !== null && rating !== emojiRating
                    ? "text-gray-400"
                    : ""
                }`}
              >
                {getEmojiLabel(emojiRating)}
              </span>
            </div>
          ))}
        </div>

        {showRecommendQuestion && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">
              Would you recommend this service point?
            </p>
            <div className="flex gap-2 sm:gap-4">
              <Button
                variant={recommend === true ? "default" : "outline"}
                className="w-full text-xs sm:text-sm"
                onClick={() => setRecommend(true)}
              >
                Yes
              </Button>
              <Button
                variant={recommend === false ? "default" : "outline"}
                className="w-full text-xs sm:text-sm"
                onClick={() => setRecommend(false)}
              >
                No
              </Button>
            </div>
          </div>
        )}

        {showCommentsBox && (
          <div className="pt-4">
            <Textarea
              placeholder="Any additional comments? (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none text-xs sm:text-sm"
              rows={3}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={rating === null || isSubmitting}
          className="px-8 text-xs sm:text-sm md:text-base"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardFooter>
    </Card>
  );
}
