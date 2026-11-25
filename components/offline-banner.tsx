"use client";

import React from "react";
import { useOffline } from "@/lib/offline/offline-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WifiOff, AlertTriangle, RefreshCw, Cloud, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";

const formatLastOnline = (timestamp: number | null) => {
  if (!timestamp) return null;
  try {
    return new Date(timestamp).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return null;
  }
};

export const OfflineBanner: React.FC = () => {
  const {
    isOnline,
    pendingCount,
    failedCount,
    isSyncing,
    lastOnlineAt,
    syncPendingSubmissions,
    retryFailedSubmissions,
  } = useOffline();

  // Nothing to report
  if (isOnline && pendingCount === 0 && failedCount === 0) {
    return null;
  }

  const needsAttention = failedCount > 0;
  const lastOnline = formatLastOnline(lastOnlineAt);

  return (
    <Alert
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl shadow-lg border-2 transition-all",
        needsAttention
          ? "bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-700"
          : isOnline
            ? "bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700"
            : "bg-amber-50 border-amber-300 dark:bg-amber-950 dark:border-amber-700"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {needsAttention ? (
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          ) : isOnline ? (
            <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          ) : (
            <CloudOff className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          )}

          <AlertDescription className="flex-1">
            {needsAttention ? (
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">
                  {failedCount} {failedCount === 1 ? "response" : "responses"}{" "}
                  couldn&apos;t be uploaded
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Automatic retries have stopped. Your responses are still
                  saved on this device.
                  {lastOnline ? ` Last online: ${lastOnline}.` : ""}
                </p>
              </div>
            ) : !isOnline ? (
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  You&apos;re currently offline
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {pendingCount > 0
                    ? `${pendingCount} ${pendingCount === 1 ? "response" : "responses"} waiting to sync`
                    : "Your responses will be saved locally and synced when you're back online"}
                  {lastOnline ? ` · Last online: ${lastOnline}` : ""}
                </p>
              </div>
            ) : pendingCount > 0 ? (
              <div>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {isSyncing ? "Syncing responses..." : "Pending sync"}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {isSyncing
                    ? `Uploading ${pendingCount} ${pendingCount === 1 ? "response" : "responses"}...`
                    : `${pendingCount} ${pendingCount === 1 ? "response" : "responses"} ready to sync`}
                </p>
              </div>
            ) : null}
          </AlertDescription>
        </div>

        {needsAttention ? (
          <Button
            size="sm"
            variant="default"
            onClick={retryFailedSubmissions}
            disabled={isSyncing || !isOnline}
            className="shrink-0"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <WifiOff className="mr-2 h-4 w-4" />
                Retry now
              </>
            )}
          </Button>
        ) : (
          isOnline &&
          pendingCount > 0 && (
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
          )
        )}
      </div>
    </Alert>
  );
};
