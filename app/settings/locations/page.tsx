"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Home, Plus, Pencil, Trash2, MapPin, Save } from "lucide-react";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationUsageStats,
  type Location,
  type LocationCreate,
  type LocationUpdate,
} from "@/app/actions/location-actions";
import { useToast } from "@/hooks/use-toast";

const LOCATION_TYPES = [
  { value: "department", label: "Department" },
  { value: "ward", label: "Ward" },
  { value: "canteen", label: "Canteen" },
  { value: "occupational_health", label: "Occupational Health" },
];

export default function LocationsManagementPage() {
  const { isAuthenticated } = useSupabaseAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [usageStats, setUsageStats] = useState<{
    totalSubmissions: number;
    totalRatings: number;
  } | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState<LocationCreate>({
    name: "",
    locationType: "department",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    const { data, error } = await getLocations();
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else if (data) {
      setLocations(data);
    }
    setLoading(false);
  };

  const handleAddLocation = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Location name is required",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await createLocation(formData);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Location created successfully",
      });
      setIsAddDialogOpen(false);
      setFormData({ name: "", locationType: "department" });
      loadLocations();
    }
  };

  const handleEditLocation = async () => {
    if (!selectedLocation) return;

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Location name is required",
        variant: "destructive",
      });
      return;
    }

    const updateData: LocationUpdate = {
      name: formData.name,
      locationType: formData.locationType,
    };

    const { data, error } = await updateLocation(selectedLocation.id, updateData);
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Location updated successfully",
      });
      setIsEditDialogOpen(false);
      setSelectedLocation(null);
      setFormData({ name: "", locationType: "department" });
      loadLocations();
    }
  };

  const handleDeleteLocation = async () => {
    if (!selectedLocation) return;

    const { success, error } = await deleteLocation(selectedLocation.id);
    if (!success) {
      toast({
        title: "Error",
        description: error || "Failed to delete location",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setSelectedLocation(null);
      loadLocations();
    }
  };

  const openEditDialog = async (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      locationType: location.locationType,
    });

    // Load usage stats
    const { data } = await getLocationUsageStats(location.id);
    setUsageStats(data);

    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = async (location: Location) => {
    setSelectedLocation(location);

    // Load usage stats
    const { data } = await getLocationUsageStats(location.id);
    setUsageStats(data);

    setIsDeleteDialogOpen(true);
  };

  const filteredLocations = locations.filter((location) => {
    const matchesType = filterType === "all" || location.locationType === filterType;
    const matchesSearch = location.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/agahflogo white.svg"
                alt="AGA Health Foundation Logo"
                width={50}
                height={50}
              />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Location Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage departments, wards, and other locations
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/settings">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Home size={16} />
                <span className="hidden md:inline">Back to Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Locations</CardTitle>
                <CardDescription>
                  Add, edit, or remove locations used in surveys
                </CardDescription>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Add Location
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Location</DialogTitle>
                    <DialogDescription>
                      Create a new location for your survey system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Location Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Emergency Unit"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Location Type</Label>
                      <Select
                        value={formData.locationType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, locationType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddLocation}>
                      <Save size={16} className="mr-2" />
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {LOCATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading locations...
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No locations found
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-primary" />
                            {location.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {
                              LOCATION_TYPES.find(
                                (t) => t.value === location.locationType
                              )?.label
                            }
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(location.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(location)}
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(location)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredLocations.length} of {locations.length}{" "}
              location(s)
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>
                Update the location details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {usageStats && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-medium">Usage Statistics</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Submissions: {usageStats.totalSubmissions}</p>
                    <p>Ratings: {usageStats.totalRatings}</p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Location Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Emergency Unit"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Location Type</Label>
                <Select
                  value={formData.locationType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, locationType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setUsageStats(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditLocation}>
                <Save size={16} className="mr-2" />
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the location &quot;
                {selectedLocation?.name}&quot;.
                {usageStats && (
                  <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      Warning: This location is in use
                    </p>
                    <div className="text-xs space-y-1">
                      <p>
                        This location has {usageStats.totalSubmissions}{" "}
                        submission(s) and {usageStats.totalRatings} rating(s).
                      </p>
                      <p className="text-destructive">
                        Deleting this location may affect existing data.
                      </p>
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setUsageStats(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteLocation}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
