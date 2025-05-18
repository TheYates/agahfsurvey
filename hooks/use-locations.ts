"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type Location = {
  id: number
  name: string
  location_type: string
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data, error } = await supabase.from("locations").select("*").order("name")

        if (error) throw error

        setLocations(data || [])
      } catch (err) {
        setError("Failed to load locations")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // Group locations by type
  const departmentLocations = locations.filter((loc) => loc.location_type === "department")
  const wardLocations = locations.filter((loc) => loc.location_type === "ward")
  const canteenLocations = locations.filter((loc) => loc.location_type === "canteen")
  const occupationalHealthLocations = locations.filter((loc) => loc.location_type === "occupational_health")

  return {
    locations,
    departmentLocations,
    wardLocations,
    canteenLocations,
    occupationalHealthLocations,
    loading,
    error,
  }
}
