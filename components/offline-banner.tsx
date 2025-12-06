"use client";

import React from "react";
import { useOffline } from "@/lib/offline/offline-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WifiOff, Wifi, RefreshCw, Cloud, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingCount, isSyncing, syncPendingSubmissions } = useOffline();

  // Don't show banner if online and no pending submissions
  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <Alert
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl shadow-lg border-2 transition-all",
        isOnline
          ? "bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700"
          : "bg-amber-50 border-amber-300 dark:bg-amber-950 dark:border-amber-700"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {isOnline ? (
            <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <CloudOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          )}

          <AlertDescription className="flex-1">
            {!isOnline ? (
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  You're currently offline
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {pendingCount > 0
                    ? `${pendingCount} ${pendingCount === 1 ? 'response' : 'responses'} waiting to sync`
                    : "Your responses will be saved locally and synced when you're back online"}
                </p>
              </div>
            ) : pendingCount > 0 ? (
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {isSyncing ? "Syncing responses..." : "Pending sync"}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {isSyncing
                    ? `Uploading ${pendingCount} ${pendingCount === 1 ? 'response' : 'responses'}...`
                    : `${pendingCount} ${pendingCount === 1 ? 'response' : 'responses'} ready to sync`}
                </p>
              </div>
            ) : null}
          </AlertDescription>
        </div>

        {isOnline && pendingCount > 0 && (
          <Button
            size="sm"
            variant="default"
            onClick={syncPendingSubmissions}
            disabled={isSyncing}
            className="shrink-0"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Now
              </>
            )}
          </Button>
        )}
      </div>
    </Alert>
  );
};
