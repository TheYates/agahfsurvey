"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download, Share, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  dismissInstallPrompt,
  isInstallDismissalActive,
  isPwaStandalone,
  usePwaInstall,
} from "./use-pwa-install";

/**
 * In-app PWA install prompt. Shows only when installation is possible and
 * useful: not already installed, not recently dismissed, and either
 * beforeinstallprompt was captured (Android/Chrome) or iOS Safari. Renders
 * nothing on unsupported desktops/kiosk browsers.
 */
export const InstallPrompt: React.FC = () => {
  const { installed, isIos, installing, canInstall, install } =
    usePwaInstall();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (isPwaStandalone() || isInstallDismissalActive()) {
      setDismissed(true);
    } else {
      setDismissed(false);
    }
  }, [installed]);

  const handleDismiss = () => {
    dismissInstallPrompt();
    setDismissed(true);
  };

  const handleInstall = async () => {
    const accepted = await install();
    if (!accepted) {
      handleDismiss();
    }
  };

  if (dismissed || installed || !canInstall) return null;

  return (
    <Alert
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl shadow-lg border-2 transition-all",
        "bg-primary/5 border-primary/30 dark:bg-primary/10"
      )}
      role="region"
      aria-label="Install app"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          {isIos ? (
            <Share className="h-5 w-5 text-primary shrink-0" />
          ) : (
            <Download className="h-5 w-5 text-primary shrink-0" />
          )}
          <AlertDescription className="flex-1">
            <p className="font-semibold">Install the AGAHF Survey app</p>
            {isIos ? (
              <p className="text-sm text-muted-foreground">
                On iPhone or iPad, tap <strong>Share</strong> then{" "}
                <strong>Add to Home Screen</strong> to install.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Install for quick access on this tablet — it also works
                offline.
              </p>
            )}
          </AlertDescription>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isIos && (
            <Button size="sm" onClick={handleInstall} disabled={installing}>
              {installing ? "Installing…" : "Install"}
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};
