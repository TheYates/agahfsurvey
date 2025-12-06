"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  saveOfflineSubmission,
  getPendingSubmissions,
  markAsSynced,
  updateSyncAttempt,
  cleanupOldSubmissions,
  OfflineSubmission,
} from "./db";

interface OfflineContextType {
  isOnline: boolean;
  pendingCount: number;
  isSyncing: boolean;
  saveSubmission: (surveyData: any) => Promise<string>;
  syncPendingSubmissions: () => Promise<void>;
  getPending: () => Promise<OfflineSubmission[]>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within OfflineProvider");
  }
  return context;
};

interface OfflineProviderProps {
  children: React.ReactNode;
}

export const OfflineProvider: React.FC<OfflineProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check if we're in browser environment
  const isBrowser = typeof window !== 'undefined';

  /**
   * Update pending count
   */
  const updatePendingCount = useCallback(async () => {
    if (!isBrowser) return;

    try {
      const pending = await getPendingSubmissions();
      setPendingCount(pending.length);
    } catch (error) {
      console.error("Failed to update pending count:", error);
    }
  }, [isBrowser]);

  /**
   * Handle online/offline status changes
   */
  useEffect(() => {
    if (!isBrowser) return;

    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: "Connection restored. Syncing pending submissions...",
      });
      // Auto-sync when coming back online
      syncPendingSubmissions();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Don't worry, your responses will be saved and synced when you're back online.",
        variant: "destructive",
      });
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isBrowser, toast]);

  /**
   * Update pending count on mount and when online status changes
   */
  useEffect(() => {
    updatePendingCount();

    // Cleanup old synced submissions every time component mounts
    if (isBrowser) {
      cleanupOldSubmissions(7).catch(console.error);
    }
  }, [updatePendingCount, isBrowser]);

  /**
   * Save submission (offline or online)
   */
  const saveSubmission = useCallback(async (surveyData: any): Promise<string> => {
    if (!isBrowser) {
      throw new Error("Cannot save submission: not in browser environment");
    }

    if (!isOnline) {
      // Save to IndexedDB when offline
      const id = await saveOfflineSubmission(surveyData);
      await updatePendingCount();

      toast({
        title: "Saved offline",
        description: "Your response has been saved and will be submitted when you're back online.",
      });

      return id;
    } else {
      // When online, try to submit directly
      try {
        const response = await fetch("/api/survey/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(surveyData),
        });

        if (!response.ok) {
          throw new Error("Failed to submit survey");
        }

        const data = await response.json();

        toast({
          title: "Survey submitted",
          description: "Thank you for your feedback!",
        });

        return data.id || "online-submission";
      } catch (error) {
        // If online submission fails, save offline as fallback
        console.error("Online submission failed, saving offline:", error);

        const id = await saveOfflineSubmission(surveyData);
        await updatePendingCount();

        toast({
          title: "Saved for later",
          description: "Couldn't submit right now. Your response will be submitted automatically.",
          variant: "destructive",
        });

        return id;
      }
    }
  }, [isOnline, updatePendingCount, toast, isBrowser]);

  /**
   * Sync pending submissions
   */
  const syncPendingSubmissions = useCallback(async () => {
    if (!isBrowser || !isOnline || isSyncing) return;

    setIsSyncing(true);

    try {
      const pending = await getPendingSubmissions();

      if (pending.length === 0) {
        setIsSyncing(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const submission of pending) {
        try {
          const response = await fetch("/api/survey/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submission.surveyData),
          });

          if (response.ok) {
            await markAsSynced(submission.id);
            successCount++;
          } else {
            await updateSyncAttempt(submission.id, `HTTP ${response.status}`);
            failCount++;
          }
        } catch (error) {
          await updateSyncAttempt(
            submission.id,
            error instanceof Error ? error.message : "Unknown error"
          );
          failCount++;
        }
      }

      await updatePendingCount();

      if (successCount > 0) {
        toast({
          title: "Sync complete",
          description: `Successfully synced ${successCount} ${successCount === 1 ? 'response' : 'responses'}.`,
        });
      }

      if (failCount > 0) {
        toast({
          title: "Sync incomplete",
          description: `Failed to sync ${failCount} ${failCount === 1 ? 'response' : 'responses'}. Will retry later.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sync failed:", error);
      toast({
        title: "Sync failed",
        description: "Couldn't sync pending responses. Will try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing, updatePendingCount, toast, isBrowser]);

  /**
   * Get pending submissions
   */
  const getPending = useCallback(async (): Promise<OfflineSubmission[]> => {
    if (!isBrowser) return [];
    return getPendingSubmissions();
  }, [isBrowser]);

  const value: OfflineContextType = {
    isOnline,
    pendingCount,
    isSyncing,
    saveSubmission,
    syncPendingSubmissions,
    getPending,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
