"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { submitServicePointFeedback } from "@/app/actions/service-point-actions"

interface QuickFeedbackProps {
  servicePointId: number
  servicePointName: string
}

export function QuickFeedback({ servicePointId, servicePointName }: QuickFeedbackProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)
  const router = useRouter()

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    setSliderValue(value)

    // Map slider value (0-100) to rating (1-5)
    if (value <= 20) setRating(1)
    else if (value <= 40) setRating(2)
    else if (value <= 60) setRating(3)
    else if (value <= 80) setRating(4)
    else setRating(5)
  }

  const handleEmojiClick = (selectedRating: number) => {
    setRating(selectedRating)

    // Map rating (1-5) to slider value (0-100)
    setSliderValue((selectedRating - 1) * 25)
  }

  const handleSubmit = async () => {
    if (rating === null) return

    setIsSubmitting(true)
    try {
      const result = await submitServicePointFeedback(servicePointId, rating, comment)
      if (result.success) {
        router.push("/feedback/thank-you")
      } else {
        alert("Failed to submit feedback. Please try again.")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("An error occurred. Please try again.")
      setIsSubmitting(false)
    }
  }

  const getEmojiColor = (emojiRating: number) => {
    if (rating === null) return "text-gray-300"
    if (emojiRating === rating) {
      switch (emojiRating) {
        case 1:
          return "text-red-500"
        case 2:
          return "text-red-400"
        case 3:
          return "text-orange-400"
        case 4:
          return "text-yellow-400"
        case 5:
          return "text-green-500"
      }
    }
    return "text-gray-300"
  }

  const getSliderBackground = () => {
    const percent = sliderValue
    return `linear-gradient(to right, 
      #e53e3e 0%, #e53e3e ${percent >= 20 ? 20 : percent}%, 
      ${percent > 20 ? "#ed8936" : "#e2e8f0"} ${percent >= 20 ? 20 : percent}%, 
      #ed8936 ${percent >= 40 ? 40 : percent}%, 
      ${percent > 40 ? "#ecc94b" : "#e2e8f0"} ${percent >= 40 ? 40 : percent}%, 
      #ecc94b ${percent >= 60 ? 60 : percent}%, 
      ${percent > 60 ? "#48bb78" : "#e2e8f0"} ${percent >= 60 ? 60 : percent}%, 
      #48bb78 ${percent >= 80 ? 80 : percent}%, 
      ${percent > 80 ? "#38a169" : "#e2e8f0"} ${percent >= 80 ? 80 : percent}%, 
      #38a169 100%)`
  }

  const getEmojiForRating = (emojiRating: number) => {
    switch (emojiRating) {
      case 1:
        return "😡"
      case 2:
        return "🙁"
      case 3:
        return "😐"
      case 4:
        return "🙂"
      case 5:
        return "😄"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>How was your experience?</CardTitle>
        <CardDescription>{servicePointName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center px-4">
          {[1, 2, 3, 4, 5].map((emojiRating) => (
            <button
              key={emojiRating}
              onClick={() => handleEmojiClick(emojiRating)}
              className={`text-4xl transition-transform ${
                rating === emojiRating ? "transform scale-125" : ""
              } focus:outline-none`}
              aria-label={`Rate ${emojiRating} out of 5`}
            >
              <span className={getEmojiColor(emojiRating)}>{getEmojiForRating(emojiRating)}</span>
            </button>
          ))}
        </div>

        <div className="px-4">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{
              background: getSliderBackground(),
            }}
            aria-label="Satisfaction rating slider"
          />
        </div>

        <div className="pt-4">
          <Textarea
            placeholder="Any additional comments? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={rating === null || isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardFooter>
    </Card>
  )
}
