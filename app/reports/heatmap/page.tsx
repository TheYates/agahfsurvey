"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Download, Filter } from "lucide-react"
import mockDataService from "@/lib/mock-data"

// Helper function to convert text rating to numeric
const ratingToNumber = (rating: string): number => {
  switch (rating) {
    case "Excellent":
      return 5
    case "Very Good":
      return 4
    case "Good":
      return 3
    case "Fair":
      return 2
    case "Poor":
      return 1
    default:
      return 0
  }
}

// Helper function to get color based on score
const getColorForScore = (score: number): string => {
  if (score >= 4.5) return "#2a8d46" // Dark green
  if (score >= 4.0) return "#4caf50" // Medium green
  if (score >= 3.5) return "#8bc34a" // Light green
  if (score >= 3.0) return "#cddc39" // Yellow-green
  return "#ffeb3b" // Yellow
}

export default function HeatmapPage() {
  const [timeframe, setTimeframe] = useState("6-months")
  const [category, setCategory] = useState("all")
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [topDepartments, setTopDepartments] = useState<{ department: string; score: number }[]>([])
  const [bottomDepartments, setBottomDepartments] = useState<{ department: string; score: number }[]>([])

  useEffect(() => {
    // Get all submissions
    const allSubmissions = mockDataService.getAllSubmissions()

    // Extract all unique departments that have ratings
    const deptSet = new Set<string>()
    const catSet = new Set<string>()

    // Collect all departments and categories
    allSubmissions.forEach((submission) => {
      Object.keys(submission.departmentRatings).forEach((dept) => {
        deptSet.add(dept)
        Object.keys(submission.departmentRatings[dept]).forEach((cat) => {
          catSet.add(cat)
        })
      })
    })

    const allDepartments = Array.from(deptSet)
    const allCategories = Array.from(catSet)

    setDepartments(allDepartments)
    setCategories(allCategories)

    // Generate heatmap data
    const heatmap: any[] = []

    allDepartments.forEach((dept) => {
      allCategories.forEach((cat) => {
        // Skip categories that don't apply to certain departments
        if (
          cat === "food-quality" &&
          ![
            "Canteen Services",
            "Female's Ward",
            "Male's Ward",
            "Kids Ward",
            "Maternity Ward",
            "Intensive Care Unit (ICU)",
            "Neonatal Intensive Care Unit (NICU)",
            "Lying-In Ward",
          ].includes(dept)
        ) {
          return
        }

        if (
          (cat === "admission" ||
            cat === "discharge" ||
            cat === "nurse-professionalism" ||
            cat === "doctor-professionalism") &&
          ![
            "Female's Ward",
            "Male's Ward",
            "Kids Ward",
            "Maternity Ward",
            "Intensive Care Unit (ICU)",
            "Neonatal Intensive Care Unit (NICU)",
            "Lying-In Ward",
          ].includes(dept)
        ) {
          return
        }

        // Calculate average rating for this department and category
        let totalScore = 0
        let count = 0

        allSubmissions.forEach((submission) => {
          if (submission.departmentRatings[dept] && submission.departmentRatings[dept][cat]) {
            totalScore += ratingToNumber(submission.departmentRatings[dept][cat])
            count++
          }
        })

        if (count > 0) {
          const avgScore = totalScore / count
          heatmap.push({
            department: dept,
            category: cat,
            score: avgScore,
            color: getColorForScore(avgScore),
          })
        }
      })
    })

    setHeatmapData(heatmap)

    // Calculate top and bottom departments by overall satisfaction
    const deptScores: Record<string, { total: number; count: number }> = {}

    allDepartments.forEach((dept) => {
      deptScores[dept] = { total: 0, count: 0 }

      allSubmissions.forEach((submission) => {
        if (submission.departmentRatings[dept] && submission.departmentRatings[dept].overall) {
          deptScores[dept].total += ratingToNumber(submission.departmentRatings[dept].overall)
          deptScores[dept].count++
        }
      })
    })

    const deptAverages = Object.entries(deptScores)
      .filter(([_, data]) => data.count > 0)
      .map(([dept, data]) => ({
        department: dept,
        score: data.total / data.count,
      }))

    // Sort for top and bottom departments
    const sortedDepts = [...deptAverages].sort((a, b) => b.score - a.score)
    setTopDepartments(sortedDepts.slice(0, 5))
    setBottomDepartments([...sortedDepts].reverse().slice(0, 5))
  }, [])

  // Filter categories based on selection
  const filteredCategories = category === "all" ? categories : categories.filter((cat) => cat === category)

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image src="/logo.svg" alt="AGA Health Foundation Logo" width={50} height={50} />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Satisfaction Heatmap</h1>
            </div>
            <p className="text-muted-foreground">Visual representation of satisfaction ratings across departments</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/reports">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowLeft size={16} />
                <span className="hidden md:inline">Back to Reports</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="text-xl font-semibold">Department Satisfaction Heatmap</h2>
            <p className="text-sm text-muted-foreground">Average ratings by department and category</p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-months">Last 3 months</SelectItem>
                  <SelectItem value="6-months">Last 6 months</SelectItem>
                  <SelectItem value="1-year">Last year</SelectItem>
                  <SelectItem value="all-time">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Department Satisfaction Heatmap</CardTitle>
            <CardDescription>Average ratings by department and category (scale: 1-5)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left font-medium text-sm py-2 border-b">Department</th>
                    {filteredCategories.map((cat) => (
                      <th key={cat} className="p-2 text-center font-medium text-sm py-2 border-b">
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept} className="border-b">
                      <td className="p-2 font-medium">{dept}</td>
                      {filteredCategories.map((cat) => {
                        const cell = heatmapData.find((item) => item.department === dept && item.category === cat)
                        if (!cell) {
                          return (
                            <td key={`${dept}-${cat}`} className="p-2 text-center">
                              -
                            </td>
                          )
                        }
                        return (
                          <td
                            key={`${dept}-${cat}`}
                            className="p-2 text-center font-medium"
                            style={{
                              backgroundColor: cell.color,
                              color: "white",
                            }}
                          >
                            {cell.score.toFixed(1)}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#2a8d46" }}></div>
                <span className="text-sm">Excellent (4.5-5.0)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#4caf50" }}></div>
                <span className="text-sm">Very Good (4.0-4.4)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#8bc34a" }}></div>
                <span className="text-sm">Good (3.5-3.9)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#cddc39" }}></div>
                <span className="text-sm">Fair (3.0-3.4)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Departments</CardTitle>
              <CardDescription>Departments with highest overall satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topDepartments.map((item, index) => (
                  <div key={item.department} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <span>{item.department}</span>
                    </div>
                    <div className="font-medium">{item.score.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Areas for Improvement</CardTitle>
              <CardDescription>Departments with lowest overall satisfaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bottomDepartments.map((item, index) => (
                  <div key={item.department} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm">
                        {index + 1}
                      </div>
                      <span>{item.department}</span>
                    </div>
                    <div className="font-medium">{item.score.toFixed(1)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
