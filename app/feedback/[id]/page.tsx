"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { QuickFeedback } from "@/components/quick-feedback";
import { getServicePoint } from "@/app/actions/service-point-actions";
import { ServicePoint } from "@/app/actions/service-point-actions";
import { Loader2 } from "lucide-react";

export default function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params at the top level of the component, outside of any try/catch
  const resolvedParams = use(params);

  const [servicePoint, setServicePoint] = useState<ServicePoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [servicePointId, setServicePointId] = useState<number | null>(null);

  // Extract the ID once when the component mounts
  useEffect(() => {
    if (resolvedParams?.id) {
      const id = parseInt(resolvedParams.id, 10);
      if (!isNaN(id)) {
        setServicePointId(id);
      } else {
        setError("Invalid service point ID");
        setLoading(false);
      }
    }
  }, [resolvedParams]);

  // Fetch the service point data when ID is available
  useEffect(() => {
    if (servicePointId === null) return;

    const fetchServicePoint = async () => {
      try {
        setLoading(true);
        const servicePointData = await getServicePoint(servicePointId);

        if (!servicePointData) {
          setError("Service point not found");
          setLoading(false);
          return;
        }

        setServicePoint(servicePointData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching service point:", err);
        setError("Failed to load service point");
        setLoading(false);
      }
    };

    fetchServicePoint();
  }, [servicePointId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="animate-spin text-primary mb-4" />
          <div className="text-xl font-medium">Loading...</div>
          <div className="text-sm text-muted-foreground">Please wait</div>
        </div>
      </div>
    );
  }

  if (error || !servicePoint) {
    return notFound();
  }

  return (
    <main className="min-h-screen px-2 sm:px-4 py-4 flex flex-col items-center bg-black text-white">
      <div className="w-full max-w-full sm:max-w-lg md:max-w-2xl mx-auto">
        <div className="mb-4 sm:mb-6 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Image
              src="/agahflogo svg.svg"
              alt="AGA Health Foundation Logo"
              width={100}
              height={100}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
            />
          </div>
          <h1 className="text-lg sm:text-4xl font-bold text-primary mb-1">
            AGA Health Foundation
          </h1>
          <div className="text-muted-foreground text-xs sm:text-sm mb-1 sm:mb-2">
            <span>Feedback Form</span>
          </div>
        </div>

        <QuickFeedback
          servicePointId={servicePoint.id}
          servicePointName={servicePoint.name}
          showRecommendQuestion={servicePoint.show_recommend_question}
          showCommentsBox={servicePoint.show_comments_box}
        />

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>Thank you for your feedback!</p>
          <p>Your input helps us improve our services.</p>
        </div>
      </div>
    </main>
  );
}
