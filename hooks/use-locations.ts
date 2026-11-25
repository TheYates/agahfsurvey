"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { surveyCache, CacheKeys, CacheTTL } from "@/lib/cache/survey-cache";

type LocationGroups = {
  department: string[];
  ward: string[];
  canteen: string[];
  occupational_health: string[];
};

const FALLBACK_GROUPS: LocationGroups = {
  department: [
    "Audiology Unit",
    "Dental Clinic",
    "Dressing Room",
    "Emergency Unit",
    "Eye Clinic",
    "Eric Asubonteng Clinic (Bruno Est.)",
    "Injection Room",
    "Laboratory",
    "Out-Patient Department (OPD)",
    "Out-Patient Department (OPD) Records",
    "Out-Patient Department (OPD) Triage",
    "Pharmacy",
    "Physiotherapy",
    "RCH",
    "Ultrasound Unit",
    "X-Ray Unit",
  ],
  ward: [
    "Female's Ward",
    "Intensive Care Unit (ICU)",
    "Kids Ward",
    "Lying-In Ward",
    "Male's Ward",
    "Maternity Ward",
    "Neonatal Intensive Care Unit (NICU)",
  ],
  canteen: ["Canteen Services"],
  occupational_health: ["Occupational Health Unit (Medicals)"],
};

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  if (typeof err === "string") return err;
  return "Unknown error";
}

export function useLocations() {
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;
  const [locationGroups, setLocationGroups] = useState<LocationGroups>({
    department: [],
    ward: [],
    canteen: [],
    occupational_health: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cachedData = surveyCache.get<LocationGroups>(
        CacheKeys.surveyLocations()
      );
      if (cachedData) {
        setLocationGroups(cachedData);
        setUsingFallback(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Location")
        .select("name, locationType")
        .in("locationType", [
          "department",
          "ward",
          "canteen",
          "occupational_health",
        ])
        .order("name");

      if (error) throw error;

      const locations = data || [];

      if (locations.length === 0) {
        console.warn("No locations found in database. Using fallback data.");
        setLocationGroups(FALLBACK_GROUPS);
        setUsingFallback(true);
        setError("No locations found in database — showing default list.");
        return;
      }

      const groups: LocationGroups = {
        department: [],
        ward: [],
        canteen: [],
        occupational_health: [],
      };

      locations.forEach((loc) => {
        const type = loc.locationType as keyof LocationGroups;
        if (groups[type]) {
          groups[type].push(loc.name);
        }
      });

      surveyCache.set(CacheKeys.surveyLocations(), groups, CacheTTL.LONG);

      setLocationGroups(groups);
      setUsingFallback(false);
    } catch (err) {
      console.error("Location fetch error:", err);
      // Fall back to hardcoded list so the survey (step 2 for General Practice)
      // is never blocked by a network/RLS/Supabase outage.
      setLocationGroups(FALLBACK_GROUPS);
      setUsingFallback(true);
      setError(`Failed to load locations (${getErrorMessage(err)}) — showing default list.`);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const retry = useCallback(() => {
    surveyCache.delete(CacheKeys.surveyLocations());
    return fetchLocations();
  }, [fetchLocations]);

  return {
    locationGroups,
    loading,
    error,
    usingFallback,
    retry,
    departmentLocations: locationGroups.department,
    wardLocations: locationGroups.ward,
    canteenLocations: locationGroups.canteen,
    occupationalHealthLocations: locationGroups.occupational_health,
  };
}
