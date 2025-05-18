"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { fetchServicePoints } from "@/app/actions/service-point-actions"
import { Plus, Edit, Trash2 } from "lucide-react"

export default function ServicePointsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [servicePoints, setServicePoints] = useState<{ id: number; name: string; location_type?: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [newServicePoint, setNewServicePoint] = useState({ name: "", location_type: "consulting_room" })
  const [editServicePoint, setEditServicePoint] = useState<{ id: number; name: string; location_type: string } | null>(
    null,
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    setIsAuthChecked(true)
  }, [])

  useEffect(() => {
    if (isAuthChecked && !isAuthenticated) {
      router.push("/")
    } else if (isAuthenticated) {
      loadServicePoints()
    }
  }, [isAuthenticated, router, isAuthChecked])

  const loadServicePoints = async () => {
    try {
      setLoading(true)
      const points = await fetchServicePoints()
      setServicePoints(points)
      setLoading(false)
    } catch (error) {
      console.error("Error loading service points:", error)
      setLoading(false)
    }
  }

  const handleAddServicePoint = async () => {
    try {
      // This would typically call an API to add a service point
      // For now, we'll just show a success message
      alert(`Service point "${newServicePoint.name}" would be added here`)
      setNewServicePoint({ name: "", location_type: "consulting_room" })
      setIsDialogOpen(false)
      // In a real implementation, you would reload the service points after adding
    } catch (error) {
      console.error("Error adding service point:", error)
      alert("Failed to add service point")
    }
  }

  const handleEditServicePoint = (servicePoint: { id: number; name: string; location_type?: string }) => {
    setEditServicePoint({
      id: servicePoint.id,
      name: servicePoint.name,
      location_type: servicePoint.location_type || "consulting_room",
    })
    setIsDialogOpen(true)
  }

  const handleUpdateServicePoint = async () => {
    if (!editServicePoint) return

    try {
      // This would typically call an API to update a service point
      // For now, we'll just show a success message
      alert(`Service point "${editServicePoint.name}" would be updated here`)
      setEditServicePoint(null)
      setIsDialogOpen(false)
      // In a real implementation, you would reload the service points after updating
    } catch (error) {
      console.error("Error updating service point:", error)
      alert("Failed to update service point")
    }
  }

  const handleDeleteServicePoint = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service point?")) return

    try {
      // This would typically call an API to delete a service point
      // For now, we'll just show a success message
      alert(`Service point with ID ${id} would be deleted here`)
      // In a real implementation, you would reload the service points after deleting
    } catch (error) {
      console.error("Error deleting service point:", error)
      alert("Failed to delete service point")
    }
  }

  if (!isAuthenticated && isAuthChecked) {
    return null
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Service Points</h1>
            <p className="text-muted-foreground">Manage service points for feedback collection</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service Point
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editServicePoint ? "Edit Service Point" : "Add Service Point"}</DialogTitle>
                <DialogDescription>
                  {editServicePoint
                    ? "Update the details of this service point"
                    : "Add a new service point to collect feedback"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter service point name"
                    value={editServicePoint ? editServicePoint.name : newServicePoint.name}
                    onChange={(e) => {
                      if (editServicePoint) {
                        setEditServicePoint({ ...editServicePoint, name: e.target.value })
                      } else {
                        setNewServicePoint({ ...newServicePoint, name: e.target.value })
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location-type">Location Type</Label>
                  <Select
                    value={editServicePoint ? editServicePoint.location_type : newServicePoint.location_type}
                    onValueChange={(value) => {
                      if (editServicePoint) {
                        setEditServicePoint({ ...editServicePoint, location_type: value })
                      } else {
                        setNewServicePoint({ ...newServicePoint, location_type: value })
                      }
                    }}
                  >
                    <SelectTrigger id="location-type">
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consulting_room">Consulting Room</SelectItem>
                      <SelectItem value="emergency">Emergency Unit</SelectItem>
                      <SelectItem value="laboratory">Laboratory</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                      <SelectItem value="radiology">Radiology</SelectItem>
                      <SelectItem value="reception">Reception</SelectItem>
                      <SelectItem value="ward">Ward</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editServicePoint ? handleUpdateServicePoint : handleAddServicePoint}>
                  {editServicePoint ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Points</CardTitle>
            <CardDescription>List of all service points available for feedback</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading service points...</div>
            ) : servicePoints.length === 0 ? (
              <div className="text-center py-4">No service points found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicePoints.map((sp) => (
                    <TableRow key={sp.id}>
                      <TableCell>{sp.id}</TableCell>
                      <TableCell>{sp.name}</TableCell>
                      <TableCell>{sp.location_type || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditServicePoint(sp)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteServicePoint(sp.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
