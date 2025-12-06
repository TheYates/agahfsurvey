/**
 * Simple in-memory cache for survey data
 * In production, this could be replaced with Redis or another caching solution
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class SurveyCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default

  /**
   * Set data in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };
    this.cache.set(key, entry);

    // console.log(`Cache SET: ${key} (TTL: ${entry.ttl}ms)`);
  }

  /**
   * Get data from cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      // console.log(`Cache MISS: ${key}`);
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      // console.log(`Cache EXPIRED: ${key} (age: ${age}ms, ttl: ${entry.ttl}ms)`);
      this.cache.delete(key);
      return null;
    }

    // console.log(`Cache HIT: ${key} (age: ${age}ms)`);
    return entry.data as T;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      // console.log(`Cache DELETE: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    // console.log(`Cache CLEAR: ${size} entries removed`);
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    entries: Array<{
      key: string;
      age: number;
      ttl: number;
      expired: boolean;
    }>;
  } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => {
      const age = now - entry.timestamp;
      return {
        key,
        age,
        ttl: entry.ttl,
        expired: age > entry.ttl,
      };
    });

    return {
      size: this.cache.size,
      entries,
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      // console.log(`Cache CLEANUP: ${cleaned} expired entries removed`);
    }

    return cleaned;
  }

  /**
   * Get or set pattern - if key exists return it, otherwise compute and cache
   */
  async getOrSet<T>(
    key: string,
    computeFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // console.log(`Cache COMPUTE: ${key}`);
    const data = await computeFn();
    this.set(key, data, ttl);
    return data;
  }
}

// Create singleton instance
export const surveyCache = new SurveyCache();

// Cache key generators
export const CacheKeys = {
  wardData: (page?: number, limit?: number) =>
    `wards:${page || "all"}:${limit || "all"}`,

  wardConcerns: () => "ward-concerns",

  departmentData: () => "departments",

  departmentConcerns: () => "department-concerns",

  overviewData: () => "overview",

  overviewTabData: (dateRange?: string) =>
    dateRange ? `overview-tab-data-${dateRange}` : "overview-tab-data",

  surveyOverview: () => "survey-overview",

  demographicSatisfaction: () => "demographic-satisfaction",

  visitTimeAnalysis: () => "visit-time-analysis",

  improvementAreas: () => "improvement-areas",

  allSurveyData: () => "all-survey-data",

  // Canteen-specific cache keys
  canteenData: () => "canteen-data",

  canteenRatings: () => "canteen-ratings",

  canteenConcerns: () => "canteen-concerns",

  canteenSubmissionCount: () => "canteen-submission-count",

  // Survey locations for forms
  surveyLocations: () => "survey-locations",

  // Dynamic keys with parameters
  wardsByLocation: (locationId: string) => `wards:location:${locationId}`,

  ratingsByLocation: (locationId: string) => `ratings:location:${locationId}`,

  // Date-based keys for time-sensitive data
  dailyStats: (date: string) => `daily-stats:${date}`,

  weeklyStats: (week: string) => `weekly-stats:${week}`,

  monthlyStats: (month: string) => `monthly-stats:${month}`,
};

// Cache TTL constants (in milliseconds)
export const CacheTTL = {
  SHORT: 2 * 60 * 1000, // 2 minutes
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 15 * 60 * 1000, // 15 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
  DAILY: 24 * 60 * 60 * 1000, // 24 hours
};

// Auto cleanup every 10 minutes
setInterval(() => {
  surveyCache.cleanup();
}, 10 * 60 * 1000);

export default surveyCache;
