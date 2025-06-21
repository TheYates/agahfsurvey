"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { loginUser, logoutUser, checkAuth } from "@/app/actions/auth-actions";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  user: any | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [sessionTimeoutId, setSessionTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);

      try {
        const { authenticated, user: authUser } = await checkAuth();

        if (authenticated && authUser) {
          // Store in sessionStorage (tab-specific)
          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("user", JSON.stringify(authUser));
          sessionStorage.setItem("lastActivity", Date.now().toString());

          setIsAuthenticated(true);
          setUser(authUser);
          setLastActivity(Date.now());
        } else {
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("lastActivity");

          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth verification error:", error);

        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("lastActivity");

        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Check if auth data exists in sessionStorage (for tab-specific auth)
    const checkSessionStorage = () => {
      const storedAuth = sessionStorage.getItem("isAuthenticated");
      const storedUser = sessionStorage.getItem("user");
      const storedLastActivity = sessionStorage.getItem("lastActivity");

      if (storedAuth === "true" && storedUser) {
        try {
          // Check if session has expired
          if (storedLastActivity) {
            const lastActivityTime = parseInt(storedLastActivity, 10);
            const currentTime = Date.now();

            if (currentTime - lastActivityTime > SESSION_TIMEOUT) {
              // Session expired, clear data and verify auth
              sessionStorage.removeItem("isAuthenticated");
              sessionStorage.removeItem("user");
              sessionStorage.removeItem("lastActivity");
              verifyAuth();
              return;
            }
          }

          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
          setLastActivity(
            storedLastActivity ? parseInt(storedLastActivity, 10) : Date.now()
          );
          setIsLoading(false);
        } catch (e) {
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("lastActivity");
          verifyAuth();
        }
      } else {
        verifyAuth();
      }
    };

    checkSessionStorage();
  }, []);

  // Add a listener for tab visibility changes to handle tab closing
  useEffect(() => {
    // This will detect when the tab becomes hidden (including tab close)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // When tab is hidden or closed, clear authentication
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("lastActivity");
        // We don't set state here as this runs during tab close
      }
    };

    // Add the event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Set up activity monitoring for session timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    // Reset the session timeout whenever user activity is detected
    const resetTimeout = () => {
      const currentTime = Date.now();
      setLastActivity(currentTime);
      sessionStorage.setItem("lastActivity", currentTime.toString());
    };

    // Set up activity listeners
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    // Set up the session timeout checker
    const checkSessionTimeout = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > SESSION_TIMEOUT) {
        logout();
      }
    };

    // Check session timeout every minute
    const timeoutId = setInterval(checkSessionTimeout, 60 * 1000);
    setSessionTimeoutId(timeoutId);

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });
      if (sessionTimeoutId) {
        clearInterval(sessionTimeoutId);
      }
    };
  }, [isAuthenticated, lastActivity]);

  const login = async (username: string, password: string) => {
    try {
      const result = await loginUser(username, password);

      if (result.success) {
        const currentTime = Date.now();
        // Store in sessionStorage (tab-specific)
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("user", JSON.stringify(result.user));
        sessionStorage.setItem("lastActivity", currentTime.toString());

        setIsAuthenticated(true);
        setUser(result.user);
        setLastActivity(currentTime);
        return true;
      } else {
        console.error(result.message);
        return false;
      }
    } catch (error) {
      console.error("Login exception:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const result = await logoutUser();

      if (result.success) {
        // Clear sessionStorage
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("lastActivity");

        setIsAuthenticated(false);
        setUser(null);

        // Clear the session timeout interval
        if (sessionTimeoutId) {
          clearInterval(sessionTimeoutId);
          setSessionTimeoutId(null);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
