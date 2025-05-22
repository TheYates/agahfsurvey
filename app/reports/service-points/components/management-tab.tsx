"use client";

import { useState } from "react";
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
import { Trash2, Edit, QrCode, PlusCircle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicePoint } from "@/app/actions/service-point-actions";
import { Switch } from "@/components/ui/switch";

interface ManagementTabProps {
  servicePoints: ServicePoint[];
  filteredServicePoints: ServicePoint[];
  isLoading: boolean;
  handleDeleteServicePoint: (id: number) => void;
  handleViewQrCode: (servicePoint: ServicePoint) => void;
  loadData: () => void;
  createServicePoint: (data: {
    name: string;
    is_active: boolean;
    show_recommend_question: boolean;
    show_comments_box: boolean;
  }) => Promise<any>;
}

export default function ManagementTab({
  servicePoints,
  filteredServicePoints,
  isLoading,
  handleDeleteServicePoint,
  handleViewQrCode,
  loadData,
  createServicePoint,
}: ManagementTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newServicePoint, setNewServicePoint] = useState({
    name: "",
    is_active: true,
    show_recommend_question: true,
    show_comments_box: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingServicePoint, setEditingServicePoint] =
    useState<ServicePoint | null>(null);

  const handleAddServicePoint = async () => {
    if (!newServicePoint.name) return;

    setIsSubmitting(true);
    try {
      await createServicePoint({
        name: newServicePoint.name,
        is_active: newServicePoint.is_active,
        show_recommend_question: newServicePoint.show_recommend_question,
        show_comments_box: newServicePoint.show_comments_box,
      });

      setNewServicePoint({
        name: "",
        is_active: true,
        show_recommend_question: true,
        show_comments_box: true,
      });
      setIsAddDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Error creating service point:", error);
      alert("Failed to create service point. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (servicePoint: ServicePoint) => {
    setEditingServicePoint(servicePoint);
    setIsEditDialogOpen(true);
  };

  // In a full implementation, this would call an API to update the service point
  const handleEditServicePoint = async () => {
    if (!editingServicePoint) return;

    setIsSubmitting(true);
    try {
      // This would be an API call in a real implementation
      alert("Edit functionality would be implemented here");

      setIsEditDialogOpen(false);
      loadData();
    } catch (error) {
      console.error("Error updating service point:", error);
      alert("Failed to update service point. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Service Points</h2>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle size={16} />
              <span>Add Service Point</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service Point</DialogTitle>
              <DialogDescription>
                Create a new service point to collect quick feedback
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Service Point Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Reception"
                  value={newServicePoint.name}
                  onChange={(e) =>
                    setNewServicePoint({
                      ...newServicePoint,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newServicePoint.is_active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setNewServicePoint({
                      ...newServicePoint,
                      is_active: value === "active",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Feedback Options</Label>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="show-recommend"
                    className="text-sm font-normal"
                  >
                    Show "Would you recommend" question
                  </Label>
                  <Switch
                    id="show-recommend"
                    checked={newServicePoint.show_recommend_question}
                    onCheckedChange={(checked) =>
                      setNewServicePoint({
                        ...newServicePoint,
                        show_recommend_question: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="show-comments"
                    className="text-sm font-normal"
                  >
                    Show comments box
                  </Label>
                  <Switch
                    id="show-comments"
                    checked={newServicePoint.show_comments_box}
                    onCheckedChange={(checked) =>
                      setNewServicePoint({
                        ...newServicePoint,
                        show_comments_box: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleAddServicePoint} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Service Point"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServicePoints.length > 0 ? (
                  filteredServicePoints.map((servicePoint) => (
                    <TableRow key={servicePoint.id}>
                      <TableCell className="font-medium">
                        {servicePoint.name}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            servicePoint.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {servicePoint.is_active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(servicePoint.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="View QR code"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewQrCode(servicePoint);
                            }}
                          >
                            <QrCode size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            aria-label="Edit service point"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(servicePoint);
                            }}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            aria-label="Delete service point"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteServicePoint(servicePoint.id);
                            }}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No service points found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Service Point Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service Point</DialogTitle>
            <DialogDescription>
              Update the details of this service point
            </DialogDescription>
          </DialogHeader>
          {editingServicePoint && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Service Point Name</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., Main Reception"
                  value={editingServicePoint.name}
                  onChange={(e) =>
                    setEditingServicePoint({
                      ...editingServicePoint,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingServicePoint.is_active ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setEditingServicePoint({
                      ...editingServicePoint,
                      is_active: value === "active",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Feedback Options</Label>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="edit-show-recommend"
                    className="text-sm font-normal"
                  >
                    Show "Would you recommend" question
                  </Label>
                  <Switch
                    id="edit-show-recommend"
                    checked={editingServicePoint.show_recommend_question}
                    onCheckedChange={(checked) =>
                      setEditingServicePoint({
                        ...editingServicePoint,
                        show_recommend_question: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="edit-show-comments"
                    className="text-sm font-normal"
                  >
                    Show comments box
                  </Label>
                  <Switch
                    id="edit-show-comments"
                    checked={editingServicePoint.show_comments_box}
                    onCheckedChange={(checked) =>
                      setEditingServicePoint({
                        ...editingServicePoint,
                        show_comments_box: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEditServicePoint} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Service Point"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
