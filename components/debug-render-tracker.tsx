"use client";

import { useEffect, useRef } from "react";

export function DebugRenderTracker({ name }: { name: string }) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const elapsed = Date.now() - startTime.current;

    console.log(`[RENDER] ${name} - Render #${renderCount.current} at ${elapsed}ms`);

    // Alert if component renders more than 10 times in 2 seconds
    if (renderCount.current > 10 && elapsed < 2000) {
      console.error(`⚠️ INFINITE LOOP DETECTED in ${name}! ${renderCount.current} renders in ${elapsed}ms`);
      debugger; // This will pause execution if dev tools are open
    }
  });

  return null;
}
