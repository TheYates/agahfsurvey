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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Home,
  Save,
  Bell,
  Shield,
  Database,
  QrCode,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
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

export default function SettingsPage() {
  const { isAuthenticated } = useSupabaseAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Location management state
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
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
  const [activeTab, setActiveTab] = useState<string>("general");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sorting state
  const [sortColumn, setSortColumn] = useState<
    "id" | "name" | "locationType" | "createdAt"
  >("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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

  // Load locations when Locations tab is opened
  useEffect(() => {
    if (activeTab === "locations" && locations.length === 0) {
      loadLocations();
    }
  }, [activeTab]);

  const loadLocations = async () => {
    setLoadingLocations(true);
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
    setLoadingLocations(false);
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
      setCurrentPage(1); // Reset to first page
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

    const { data, error } = await updateLocation(
      selectedLocation.id,
      updateData
    );
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

      // If the current page becomes empty after deletion, go to the previous page
      const remainingItems = sortedLocations.length - 1;
      const maxPage = Math.ceil(remainingItems / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        setCurrentPage(maxPage);
      }

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

  const handleSort = (column: "id" | "name" | "locationType" | "createdAt") => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column with ascending default
      setSortColumn(column);
      setSortDirection("asc");
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  const getSortIcon = (
    column: "id" | "name" | "locationType" | "createdAt"
  ) => {
    if (sortColumn !== column) {
      return <ArrowUpDown size={14} className="ml-2 opacity-50" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp size={14} className="ml-2" />
    ) : (
      <ArrowDown size={14} className="ml-2" />
    );
  };

  // Filter locations
  const filteredLocations = locations.filter((location) => {
    const matchesType =
      filterType === "all" || location.locationType === filterType;
    const matchesSearch = location.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Sort locations
  const sortedLocations = [...filteredLocations].sort((a, b) => {
    let aValue: any = a[sortColumn];
    let bValue: any = b[sortColumn];

    // Handle different data types
    if (sortColumn === "createdAt") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate locations
  const totalPages = Math.ceil(sortedLocations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLocations = sortedLocations.slice(startIndex, endIndex);

  // If not authenticated, don't render the page content
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
                Settings
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your survey system settings
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Home size={16} />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8 w-full"
        >
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="general" className="w-full">
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="w-full">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="w-full">
              Security
            </TabsTrigger>
            <TabsTrigger value="locations" className="w-full">
              Locations
            </TabsTrigger>
            <TabsTrigger value="data" className="w-full">
              Data Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Manage your survey system preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospital-name">Hospital Name</Label>
                    <Input
                      id="hospital-name"
                      defaultValue="AGA Health Foundation"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Administrator Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      defaultValue="admin@agahealth.org"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="survey-title">Default Survey Title</Label>
                    <Input
                      id="survey-title"
                      defaultValue="Patient Satisfaction Survey"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable dark mode for the survey interface
                      </p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto-save Responses</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save survey progress as users complete it
                      </p>
                    </div>
                    <Switch id="auto-save" defaultChecked />
                  </div>
                </div>

                <Button className="flex items-center gap-2">
                  <Save size={16} />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for new survey submissions
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-summary">Weekly Summary</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a weekly summary of survey responses
                      </p>
                    </div>
                    <Switch id="weekly-summary" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="negative-feedback">
                        Negative Feedback Alerts
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Get immediate alerts for negative feedback (Poor/Fair
                        ratings)
                      </p>
                    </div>
                    <Switch id="negative-feedback" defaultChecked />
                  </div>
                </div>

                <Button className="flex items-center gap-2">
                  <Bell size={16} />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable two-factor authentication for added security
                      </p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </div>

                <Button className="flex items-center gap-2">
                  <Shield size={16} />
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Locations Management</CardTitle>
                    <CardDescription>
                      Add, edit, or remove locations used in surveys
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isAddDialogOpen}
                    onOpenChange={setIsAddDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="flex items-center gap-2"
                        onClick={() => {
                          setFormData({ name: "", locationType: "department" });
                        }}
                      >
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
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                    />
                  </div>
                  <div className="w-full md:w-48">
                    <Select
                      value={filterType}
                      onValueChange={(value) => {
                        setFilterType(value);
                        setCurrentPage(1); // Reset to first page on filter
                      }}
                    >
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

                {loadingLocations ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading locations...
                  </div>
                ) : filteredLocations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No locations found
                  </div>
                ) : (
                  <>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead
                              className="w-16 cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort("id")}
                            >
                              <div className="flex items-center">
                                #{getSortIcon("id")}
                              </div>
                            </TableHead>
                            <TableHead
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort("name")}
                            >
                              <div className="flex items-center">
                                Name
                                {getSortIcon("name")}
                              </div>
                            </TableHead>
                            <TableHead
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort("locationType")}
                            >
                              <div className="flex items-center">
                                Type
                                {getSortIcon("locationType")}
                              </div>
                            </TableHead>
                            <TableHead
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleSort("createdAt")}
                            >
                              <div className="flex items-center">
                                Created
                                {getSortIcon("createdAt")}
                              </div>
                            </TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedLocations.map((location, index) => (
                            <TableRow key={location.id}>
                              <TableCell className="font-medium text-muted-foreground">
                                {startIndex + index + 1}
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  {/* <MapPin size={16} className="text-primary" /> */}
                                  {location.name}
                                </div>
                              </TableCell>
                              <TableCell>
                                {
                                  LOCATION_TYPES.find(
                                    (t) => t.value === location.locationType
                                  )?.label
                                }
                              </TableCell>
                              <TableCell>
                                {new Date(location.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openEditDialog(location)}
                                  >
                                    <Pencil size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
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

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, sortedLocations.length)} of{" "}
                        {sortedLocations.length} location(s)
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft size={16} />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-9"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
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
            <Dialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Location</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to permanently delete &quot;
                    {selectedLocation?.name}&quot;?
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {usageStats && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg space-y-2">
                      <p className="text-sm font-medium text-destructive">
                        Warning: This location is in use
                      </p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          This location has {usageStats.totalSubmissions}{" "}
                          submission(s) and {usageStats.totalRatings}{" "}
                          rating(s).
                        </p>
                        <p className="text-destructive">
                          Deleting this location may affect existing data.
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    This action cannot be undone.
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDeleteDialogOpen(false);
                      setUsageStats(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteLocation}
                  >
                    Delete Location
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>
                  Manage your survey data and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border border-muted p-4 rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-start gap-3">
                        <Database size={24} className="text-primary mt-1" />
                        <div>
                          <h3 className="font-medium mb-1">
                            Survey Data Export
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Download your survey data for analysis
                          </p>
                          <Link href="/reports">
                            <Button variant="outline" size="sm">
                              Manage Reports
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>

                    <Card className="border border-muted p-4 rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-start gap-3">
                        <QrCode size={24} className="text-primary mt-1" />
                        <div>
                          <h3 className="font-medium mb-1">Service Points</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Manage service points and QR codes for quick
                            feedback
                          </p>
                          <Link href="/settings/service-points">
                            <Button variant="outline" size="sm">
                              Manage Service Points
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-cleanup">
                        Automated Data Cleanup
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically remove survey responses older than 2 years
                      </p>
                    </div>
                    <Switch id="data-cleanup" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-email">Backup Email</Label>
                    <Input
                      id="backup-email"
                      type="email"
                      placeholder="Enter email for data backups"
                    />
                    <p className="text-xs text-muted-foreground">
                      Receive weekly data backups at this email address
                    </p>
                  </div>
                </div>

                <Button className="flex items-center gap-2">
                  <Database size={16} />
                  Save Data Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
