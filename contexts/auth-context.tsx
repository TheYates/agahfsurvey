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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

          setIsAuthenticated(true);
          setUser(authUser);
        } else {
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("user");

          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth verification error:", error);

        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("user");

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

      if (storedAuth === "true" && storedUser) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
        } catch (e) {
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("user");
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

  const login = async (username: string, password: string) => {
    try {
      const result = await loginUser(username, password);

      if (result.success) {
        // Store in sessionStorage (tab-specific)
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("user", JSON.stringify(result.user));

        setIsAuthenticated(true);
        setUser(result.user);
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

        setIsAuthenticated(false);
        setUser(null);
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
