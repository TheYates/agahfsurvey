"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SW_UPDATE_AVAILABLE_EVENT,
  applyServiceWorkerUpdate,
} from "@/lib/offline/register-sw";

/**
 * Non-blocking service worker update notice. Listens for the
 * SW_UPDATE_AVAILABLE_EVENT broadcast by registerServiceWorker and offers a
 * Reload action. Dismissing keeps the current version until the next reload;
 * it never steals focus or blocks form input.
 */
export const UpdateToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    const onUpdate = () => setVisible(true);
    window.addEventListener(SW_UPDATE_AVAILABLE_EVENT, onUpdate);
    return () => {
      window.removeEventListener(SW_UPDATE_AVAILABLE_EVENT, onUpdate);
    };
  }, []);

  const handleReload = useCallback(async () => {
    setReloading(true);
    try {
      await applyServiceWorkerUpdate();
    } catch {
      window.location.reload();
    }
  }, []);

  if (!visible) return null;

  return (
    <Alert
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl shadow-lg border-2 transition-all",
        "bg-emerald-50 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-700"
      )}
      role="status"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <RefreshCw className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <AlertDescription className="flex-1">
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
              A new version is available
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Reload to get the latest version.
            </p>
          </AlertDescription>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={handleReload} disabled={reloading}>
            {reloading ? "Reloading…" : "Reload"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setVisible(false)}
            aria-label="Dismiss update notice"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
