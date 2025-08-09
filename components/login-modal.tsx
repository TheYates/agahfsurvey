"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { Loader2, AlertCircle } from "lucide-react";
import { rateLimiter, formatTimeRemaining, isRateLimitError } from "@/lib/utils/rate-limit";
import { RateLimitHelp } from "@/components/auth/rate-limit-help";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<number>(0);
  const { signIn } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limiting
    if (rateLimiter.isRateLimited('login')) {
      const timeRemaining = rateLimiter.getTimeUntilReset('login');
      setError(`Too many login attempts. Please wait ${formatTimeRemaining(timeRemaining)} before trying again.`);
      return;
    }

    // Prevent rapid successive attempts (debounce)
    const now = Date.now();
    if (now - lastAttempt < 2000) { // 2 second cooldown
      setError("Please wait a moment before trying again.");
      return;
    }
    setLastAttempt(now);

    setError("");
    setIsLoading(true);

    try {
      // Try to login with the provided credentials
      const { error } = await signIn(email, password);

      if (error) {
        // Handle specific rate limit error
        if (isRateLimitError(error)) {
          const timeRemaining = rateLimiter.getTimeUntilReset('login');
          setError(`Too many login attempts. Please wait ${formatTimeRemaining(timeRemaining)} before trying again.`);
        } else {
          setError(error.message);
        }
      } else {
        // Success - clear rate limit
        rateLimiter.clear('login');
        setEmail("");
        setPassword("");
        onSuccess();
      }
    } catch (err: any) {
      // Handle rate limit and other errors
      if (isRateLimitError(err)) {
        const timeRemaining = rateLimiter.getTimeUntilReset('login');
        setError(`Too many login attempts. Please wait ${formatTimeRemaining(timeRemaining)} before trying again.`);
      } else {
        setError("An error occurred during login");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            Enter admin credentials to access the reports
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospital-survey.local"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              disabled={isLoading}
              required
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </DialogFooter>
        </form>

        <RateLimitHelp />
      </DialogContent>
    </Dialog>
  );
}
