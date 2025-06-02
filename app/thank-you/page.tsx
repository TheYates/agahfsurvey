"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

// Component that uses search params
function ThankYouContent() {
  const searchParams = useSearchParams();
  const rating = searchParams.get("rating");
  const label = searchParams.get("label");
  const imagePath = searchParams.get("image");

  // Determine if we should show confetti based on rating or label
  const shouldShowConfetti = () => {
    // Check numeric rating (most reliable method)
    if (rating) {
      const numericRating = parseInt(rating);
      // Only ratings 4 (Satisfied) and 5 (Very satisfied) should trigger confetti
      if (!isNaN(numericRating) && numericRating >= 4) {
        return true;
      }
    }

    // Fallback to exact label match if needed
    const positiveRatings = ["Satisfied", "Very satisfied"];

    if (label && positiveRatings.some((term) => label === term)) {
      return true;
    }

    return false;
  };

  // Trigger confetti effect when the page loads, but only for positive ratings
  useEffect(() => {
    // Only show confetti for positive ratings
    if (!shouldShowConfetti()) return;

    const duration = 2 * 1000;
    const end = Date.now() + duration;

    // Create a confetti burst
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4caf50", "#22c5bf", "#e84e3c"],
      });
    };

    // Initial burst
    triggerConfetti();

    // Smaller follow-up bursts
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 50,
        angle: Math.random() * 60 + 60,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ["#4caf50", "#22c5bf", "#e84e3c"],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex justify-center mb-6">
        <Image
          src="/agahflogo white.svg"
          alt="AGA Health Foundation Logo"
          width={80}
          height={80}
        />
      </div>

      <Card className="w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your feedback has been submitted successfully. We appreciate your
            input as it helps us improve our services.
          </p>

          {rating && (
            <div className="flex flex-col items-center my-6">
              <p className="text-sm text-muted-foreground mb-2">Your rating:</p>
              {imagePath && (
                <div className="w-14 h-14 mb-1 relative">
                  <Image
                    src={imagePath}
                    alt={label || "Selected rating"}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {label && <p className="text-sm font-medium">{label}</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">{/* <Button>Return Home</Button> */}</Link>
        </CardFooter>
      </Card>
    </>
  );
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="container max-w-md mx-auto">
        <Suspense
          fallback={
            <div className="flex justify-center items-center">
              <p>Loading...</p>
            </div>
          }
        >
          <ThankYouContent />
        </Suspense>
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AGA Health Foundation</p>
      </footer>
    </div>
  );
}
