"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { surveyCache, CacheKeys, CacheTTL } from "@/lib/cache/survey-cache"

type LocationGroups = {
  department: string[]
  ward: string[]
  canteen: string[]
  occupational_health: string[]
}

export function useLocations() {
  const [locationGroups, setLocationGroups] = useState<LocationGroups>({
    department: [],
    ward: [],
    canteen: [],
    occupational_health: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchLocations() {
      try {
        // Use cache for locations data
        const cachedData = surveyCache.get<LocationGroups>(CacheKeys.surveyLocations())
        if (cachedData) {
          setLocationGroups(cachedData)
          setLoading(false)
          return
        }

        console.time("fetchSurveyLocations")

        // Optimized query - only select needed fields and filter by location types
        const { data, error } = await supabase
          .from("Location")
          .select("name, locationType")
          .in("locationType", ["department", "ward", "canteen", "occupational_health"])
          .order("name")

        if (error) throw error

        const locations = data || []

        // If no locations found, provide fallback data
        if (locations.length === 0) {
          console.warn("No locations found in database. Using fallback data.")
          const fallbackGroups: LocationGroups = {
            department: [
              'Audiology Unit', 'Dental Clinic', 'Dressing Room', 'Emergency Unit',
              'Eye Clinic', 'Eric Asubonteng Clinic (Bruno Est.)', 'Injection Room',
              'Laboratory', 'Out-Patient Department (OPD)', 'Pharmacy',
              'Physiotherapy', 'RCH', 'Ultrasound Unit', 'X-Ray Unit'
            ],
            ward: [
              'Female\'s Ward', 'Intensive Care Unit (ICU)', 'Kids Ward',
              'Lying-In Ward', 'Male\'s Ward', 'Maternity Ward',
              'Neonatal Intensive Care Unit (NICU)'
            ],
            canteen: ['Canteen Services'],
            occupational_health: ['Occupational Health Unit (Medicals)']
          }

          setLocationGroups(fallbackGroups)
          console.timeEnd("fetchSurveyLocations")
          return
        }

        // Group locations efficiently
        const groups: LocationGroups = {
          department: [],
          ward: [],
          canteen: [],
          occupational_health: []
        }

        locations.forEach((loc) => {
          const type = loc.locationType as keyof LocationGroups
          if (groups[type]) {
            // Apply filters for specific exclusions
            if (type === "department" && loc.name === "Occupational Health Unit (Medicals)") {
              return // Skip this one
            }
            if (type === "occupational_health" &&
                (loc.name === "Occupational Health Unit (Medicals)" || loc.name === "Occupational Health")) {
              return // Skip these
            }
            groups[type].push(loc.name)
          }
        })

        // Cache the processed data for 15 minutes
        surveyCache.set(CacheKeys.surveyLocations(), groups, CacheTTL.LONG)

        setLocationGroups(groups)
        console.timeEnd("fetchSurveyLocations")
      } catch (err) {
        setError("Failed to load locations")
        console.error("Location fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  return {
    locationGroups,
    loading,
    error,
    // Legacy support - flatten for backward compatibility
    departmentLocations: locationGroups.department,
    wardLocations: locationGroups.ward,
    canteenLocations: locationGroups.canteen,
    occupationalHealthLocations: locationGroups.occupational_health,
  }
}
