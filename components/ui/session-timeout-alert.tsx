"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock } from "lucide-react";

// Warning time before session timeout (in milliseconds)
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function SessionTimeoutAlert() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    let warningTimer: NodeJS.Timeout | null = null;
    let countdownInterval: NodeJS.Timeout | null = null;

    const checkSessionTimeout = () => {
      const lastActivity = sessionStorage.getItem("lastActivity");
      if (!lastActivity) return;

      const lastActivityTime = parseInt(lastActivity, 10);
      const currentTime = Date.now();
      const timeElapsed = currentTime - lastActivityTime;

      // If approaching timeout, show warning
      if (timeElapsed > SESSION_TIMEOUT - WARNING_TIME) {
        setShowWarning(true);
        setTimeLeft(
          Math.max(0, Math.floor((SESSION_TIMEOUT - timeElapsed) / 1000))
        );

        // Start countdown timer
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
          const newLastActivity = sessionStorage.getItem("lastActivity");
          if (!newLastActivity) return;

          const newLastActivityTime = parseInt(newLastActivity, 10);
          const newCurrentTime = Date.now();
          const newTimeElapsed = newCurrentTime - newLastActivityTime;
          const newTimeLeft = Math.max(
            0,
            Math.floor((SESSION_TIMEOUT - newTimeElapsed) / 1000)
          );

          setTimeLeft(newTimeLeft);

          // If session has timed out, logout
          if (newTimeLeft <= 0) {
            if (countdownInterval) clearInterval(countdownInterval);
            logout();
          }
        }, 1000);
      } else {
        setShowWarning(false);
        if (countdownInterval) clearInterval(countdownInterval);
      }
    };

    // Check every minute
    warningTimer = setInterval(checkSessionTimeout, 60 * 1000);

    // Initial check
    checkSessionTimeout();

    return () => {
      if (warningTimer) clearInterval(warningTimer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [isAuthenticated, logout]);

  const handleStayLoggedIn = () => {
    // Update the last activity time
    const currentTime = Date.now();
    sessionStorage.setItem("lastActivity", currentTime.toString());
    setShowWarning(false);
  };

  if (!isAuthenticated || !showWarning) return null;

  // Format time left as minutes:seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Session Timeout Warning
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in {formattedTime}. Would you like to stay
            logged in?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleStayLoggedIn}>
            Stay Logged In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
