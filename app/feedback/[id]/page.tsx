"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { QuickFeedback } from "@/components/quick-feedback";
import { Loader2 } from "lucide-react";
import { getServicePointDirectly } from "@/app/actions/service-point-db-actions";

interface DebugInfo {
  id?: number;
  servicePointResult?: any;
  error?: string;
  serverActionCalled?: boolean;
  serverActionCompleted?: boolean;
}

export default function FeedbackPage({ params }: { params: { id: string } }) {
  const [servicePoint, setServicePoint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  useEffect(() => {
    async function loadServicePoint() {
      try {
        const id = parseInt(params.id, 10);
        setDebugInfo((prev) => ({ ...prev, id }));

        if (isNaN(id)) {
          setError("Invalid service point ID");
          setLoading(false);
          return;
        }

        console.log("[CLIENT] Calling server action for ID:", id);
        setDebugInfo((prev) => ({ ...prev, serverActionCalled: true }));

        // Use the server action to fetch the service point directly
        const result = await getServicePointDirectly(id);

        console.log("[CLIENT] Server action result:", result);
        setDebugInfo((prev) => ({
          ...prev,
          serverActionCompleted: true,
          servicePointResult: result,
        }));

        if (!result) {
          console.error(`[CLIENT] Service point with ID ${id} not found`);
          setError(`Service point with ID ${id} not found`);
          setLoading(false);
          return;
        }

        setServicePoint(result);
        setLoading(false);
      } catch (err) {
        console.error("[CLIENT] Error in loadServicePoint:", err);
        setError(
          `Failed to load service point: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setDebugInfo((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : String(err),
        }));
        setLoading(false);
      }
    }

    loadServicePoint();
  }, [params.id]);

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

  // Show debug info instead of 404 to help diagnose the issue
  if (error || !servicePoint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-red-800 p-6 rounded-lg max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-4">
            Error Loading Service Point
          </h1>
          {error && <p className="mb-4">{error}</p>}
          <div className="bg-black p-4 rounded overflow-auto max-h-80 text-green-400 font-mono text-sm">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Reload Page
            </button>
            <a
              href="/api/debug/direct-sql"
              target="_blank"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Debug Data
            </a>
          </div>
        </div>
      </div>
    );
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
          showRecommendQuestion={servicePoint.showRecommendQuestion || false}
          showCommentsBox={servicePoint.showCommentsBox || false}
        />

        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>Thank you for your feedback!</p>
          <p>Your input helps us improve our services.</p>
        </div>
      </div>
    </main>
  );
}
