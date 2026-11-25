"use client";

import { useCallback, useEffect, useState } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const INSTALL_DISMISS_KEY = "agahf:pwa-install-dismissed";
export const INSTALL_DISMISS_DAYS = 30;

export const isPwaStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true);

export const isIosSafari = () =>
  typeof window !== "undefined" &&
  /iPad|iPhone|iPod/.test(window.navigator.userAgent) &&
  !(window as unknown as { MSStream?: unknown }).MSStream;

export const isInstallDismissalActive = () => {
  try {
    const raw = localStorage.getItem(INSTALL_DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < INSTALL_DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

export const dismissInstallPrompt = () => {
  try {
    localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
  } catch {
    // ignore
  }
};

/**
 * Shared installability state: captures beforeinstallprompt once and shares
 * it between the banner and the /settings entry.
 */
export const usePwaInstall = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setInstalled(isPwaStandalone());
    setIsIos(isIosSafari());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.removeItem(INSTALL_DISMISS_KEY);
      } catch {
        // ignore
      }
    };

    const onDisplayModeChange = (event: MediaQueryListEvent) => {
      if (event.matches) setInstalled(true);
    };
    const media = window.matchMedia("(display-mode: standalone)");
    media.addEventListener("change", onDisplayModeChange);

    window.addEventListener(
      "beforeinstallprompt",
      onBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        onBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", onAppInstalled);
      media.removeEventListener("change", onDisplayModeChange);
    };
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setInstalling(false);
    }
  }, [deferredPrompt]);

  // Install UI is actionable on Android/Chrome (prompt captured) or iOS
  // Safari (manual steps). Everywhere else we show an "unsupported" note.
  const canInstall = !installed && (!!deferredPrompt || isIos);

  return {
    installed,
    isIos,
    installing,
    canInstall,
    install,
  };
};
