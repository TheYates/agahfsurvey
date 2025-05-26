"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { QuickFeedback } from "@/components/quick-feedback"

export default function FeedbackPage() {
  const searchParams = useSearchParams()
  const servicePointId = searchParams.get("id")
  const [servicePointName, setServicePointName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServicePoint = async () => {
      if (!servicePointId) {
        setError("No service point specified")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/service-points/${servicePointId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch service point")
        }

        const data = await response.json()
        setServicePointName(data.name)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching service point:", err)
        setError("Failed to load service point information")
        setLoading(false)
      }
    }

    fetchServicePoint()
  }, [servicePointId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error || !servicePointId || !servicePointName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || "Invalid service point"}</p>
          <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Return Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <QuickFeedback servicePointId={Number.parseInt(servicePointId)} servicePointName={servicePointName} />
    </div>
  )
}
