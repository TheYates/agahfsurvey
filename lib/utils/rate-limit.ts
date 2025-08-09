/**
 * Simple client-side rate limiting utility
 * Helps prevent rapid successive API calls
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private attempts: Map<string, RateLimitEntry> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 5 * 60 * 1000) { // 5 attempts per 5 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if an action is rate limited
   * @param key - Unique identifier for the action (e.g., 'login', 'signup')
   * @returns true if rate limited, false if allowed
   */
  isRateLimited(key: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry) {
      // First attempt
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (now > entry.resetTime) {
      // Window has expired, reset
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return false;
    }

    if (entry.count >= this.maxAttempts) {
      // Rate limited
      return true;
    }

    // Increment count
    entry.count++;
    this.attempts.set(key, entry);
    return false;
  }

  /**
   * Get time remaining until rate limit resets
   * @param key - Unique identifier for the action
   * @returns milliseconds until reset, or 0 if not rate limited
   */
  getTimeUntilReset(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry) return 0;

    const now = Date.now();
    if (now > entry.resetTime) return 0;

    return entry.resetTime - now;
  }

  /**
   * Clear rate limit for a specific key
   * @param key - Unique identifier for the action
   */
  clear(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all rate limits
   */
  clearAll(): void {
    this.attempts.clear();
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Format time remaining in a human-readable format
 * @param ms - Milliseconds
 * @returns Formatted string like "2m 30s"
 */
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "0s";

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Check if an error is a rate limit error
 * @param error - Error object or message
 * @returns true if it's a rate limit error
 */
export function isRateLimitError(error: any): boolean {
  if (!error) return false;
  
  const message = typeof error === 'string' ? error : error.message || '';
  return message.toLowerCase().includes('rate limit') || 
         message.includes('429') ||
         message.toLowerCase().includes('too many requests');
}
