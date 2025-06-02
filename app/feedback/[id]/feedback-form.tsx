"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getServicePointById,
  submitServicePointFeedback,
  ServicePoint,
} from "@/app/actions/service_point-actions";

// Update the emoji mapping to use SVG files
const RATING_EMOJIS = [
  {
    image: "/service-points-emojis/Very Unsatisfied.svg",
    label: "Very Unsatisfied",
    value: 1,
  },
  {
    image: "/service-points-emojis/Unsatisfied.svg",
    label: "Unsatisfied",
    value: 2,
  },
  {
    image: "/service-points-emojis/Neutral.svg",
    label: "Neutral",
    value: 3,
  },
  {
    image: "/service-points-emojis/Satisfied.svg",
    label: "Satisfied",
    value: 4,
  },
  {
    image: "/service-points-emojis/Very Satisfied.svg",
    label: "Very satisfied",
    value: 5,
  },
];

interface FeedbackFormProps {
  id: string;
}

export function FeedbackForm({ id }: FeedbackFormProps) {
  const router = useRouter();

  const [servicePoint, setServicePoint] = useState<ServicePoint | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchServicePoint();
  }, [id]);

  const fetchServicePoint = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const numericId = parseInt(id);
      if (isNaN(numericId)) {
        setError("Invalid service point ID");
        return;
      }

      const data = await getServicePointById(numericId);

      if (!data) {
        setError("Service point not found");
        return;
      }

      if (!data.active) {
        setError("This feedback form is currently not active");
        return;
      }

      setServicePoint(data);
    } catch (error) {
      console.error("Error fetching service point:", error);
      setError("Failed to load feedback form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async () => {
    if (!servicePoint || selectedRating === null) return;

    setIsSubmitting(true);

    try {
      const commentToSubmit = servicePoint.show_comments ? comment : null;
      await submitServicePointFeedback(
        servicePoint.id,
        selectedRating,
        commentToSubmit
      );

      // Redirect to thank you page with rating information
      const selectedEmoji = RATING_EMOJIS.find(
        (e) => e.value === selectedRating
      );
      router.push(
        `/thank-you?rating=${selectedRating}&label=${encodeURIComponent(
          selectedEmoji?.label || ""
        )}&image=${encodeURIComponent(selectedEmoji?.image || "")}`
      );
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex flex-col">
        <div className="container max-w-2xl mx-auto flex-grow flex flex-col">
          <div className="flex justify-center mb-6">
            <Skeleton className="h-20 w-20" />
          </div>

          <Card className="w-full max-w-2xl">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Skeleton className="h-6 w-4/5 mx-auto mb-4" />

                <div className="grid grid-cols-5 gap-2 my-6">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <Skeleton className="h-12 w-12 rounded-full mb-2" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Return Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="container max-w-2xl mx-auto flex-grow flex flex-col">
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center">
            <Image
              src="/agahflogo white.svg"
              alt="AGA Health Foundation Logo"
              width={80}
              height={80}
            />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Service Point Survey
            </h1>
          </div>
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              {servicePoint?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg mb-4">
                {servicePoint?.custom_question ||
                  "How would you rate your experience?"}
              </p>

              <div className="grid grid-cols-5 gap-2 my-6">
                {RATING_EMOJIS.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleRatingSelect(item.value)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                      selectedRating === item.value
                        ? "bg-primary/10 scale-110 ring-2 ring-primary"
                        : selectedRating !== null
                        ? "hover:bg-gray-100 opacity-50"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="w-12 h-12 mb-2 relative">
                      <Image
                        src={item.image}
                        alt={item.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {servicePoint?.show_comments && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Additional Comments (Optional)
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Please share any additional comments or suggestions..."
                  className="resize-none min-h-[100px]"
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              disabled={selectedRating === null || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Thank you for your feedback!</p>
        <p className="mt-1">
          © {new Date().getFullYear()} AGA Health Foundation
        </p>
      </footer>
    </div>
  );
}
