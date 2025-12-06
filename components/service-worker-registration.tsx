"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/offline/register-sw";

export const ServiceWorkerRegistration: React.FC = () => {
  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker();
  }, []);

  return null;
};
