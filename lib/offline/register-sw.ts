/**
 * Service Worker registration utilities
 */

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

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // Check every hour

      // Listen for service worker updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New service worker is available
              console.log("New service worker available");

              // You could show a notification to the user here
              if (
                window.confirm("A new version is available. Reload to update?")
              ) {
                window.location.reload();
              }
            }
          });
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
