/**
 * Service Worker registration utilities.
 *
 * Update flow: when a new worker finishes installing, we broadcast a
 * window event (`agahf:sw-update-available`) and the app shows a
 * non-blocking update toast (components/pwa/update-toast.tsx). The toast's
 * Reload button calls applyServiceWorkerUpdate(), which activates the
 * waiting worker and reloads once it takes control.
 */

export const SW_UPDATE_AVAILABLE_EVENT = "agahf:sw-update-available";

export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      console.log("Service workers are not supported");
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      const announceUpdate = (worker: ServiceWorker | null) => {
        if (!worker) return;
        // Only announce when this page is already controlled (i.e. this is
        // an update, not the first install).
        if (navigator.serviceWorker.controller) {
          window.dispatchEvent(new CustomEvent(SW_UPDATE_AVAILABLE_EVENT));
        }
      };

      // An update may already be waiting (e.g. skipWaiting ran while the
      // tab was closed between deploys).
      if (registration.waiting && navigator.serviceWorker.controller) {
        window.dispatchEvent(new CustomEvent(SW_UPDATE_AVAILABLE_EVENT));
      }

      // Listen for service worker updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              announceUpdate(newWorker);
            }
          });
        }
      });

      // Check for updates periodically (tablets are often left open for days)
      const checkForUpdate = () => {
        registration.update().catch(() => {});
      };
      setInterval(checkForUpdate, 60 * 60 * 1000); // every hour
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          checkForUpdate();
        }
      });

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  };

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    console.log("Service Worker unregistered:", success);
    return success;
  } catch (error) {
    console.error("Service Worker unregistration failed:", error);
    return false;
  }
};

/**
 * Activate the waiting service worker, then reload once it takes control.
 * Used by the update toast's Reload button.
 */
export const applyServiceWorkerUpdate = async (): Promise<void> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    window.location.reload();
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  if (!registration.waiting) {
    window.location.reload();
    return;
  }

  await new Promise<void>((resolve) => {
    const onControllerChange = () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
      resolve();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    );
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    // Safety net: reload anyway if the worker never takes control.
    setTimeout(resolve, 5000);
  });

  window.location.reload();
};

/**
 * Purge cached private (authenticated) pages from the service worker.
 * Called on explicit sign-out only — never clears the offline survey queue.
 */
export const clearPrivateCaches = async (): Promise<void> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const worker = registration.active;
    if (!worker) return;

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(resolve, 2000);
      const onMessage = (event: MessageEvent) => {
        if (event.data?.type === "PRIVATE_CACHES_CLEARED") {
          clearTimeout(timeout);
          navigator.serviceWorker.removeEventListener("message", onMessage);
          resolve();
        }
      };
      navigator.serviceWorker.addEventListener("message", onMessage);
      worker.postMessage({ type: "CLEAR_PRIVATE_CACHES" });
    });
  } catch (error) {
    console.error("Failed to clear private caches:", error);
  }
};

/**
 * Request background sync
 */
export const requestBackgroundSync = async (
  tag: string = "sync-submissions"
): Promise<void> => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    if ("sync" in registration) {
      await (registration as any).sync.register(tag);
      console.log("Background sync registered:", tag);
    }
  } catch (error) {
    console.error("Background sync registration failed:", error);
  }
};
