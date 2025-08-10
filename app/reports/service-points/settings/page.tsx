"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import Link from "next/link";
import { saveAs } from "file-saver";
import QRCode from "qrcode";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Home,
  PlusCircle,
  QrCode,
  Download,
  Pencil,
  Trash2,
  BarChart3,
  Settings,
  Check,
  X,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import {
  getServicePoints,
  createServicePoint,
  updateServicePoint,
  deleteServicePoint,
  ServicePoint,
} from "@/app/actions/service_point-actions";

export default function ServicePointSettingsPage() {
  const { isAuthenticated } = useSupabaseAuth();
  const router = useRouter();
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServicePoint, setSelectedServicePoint] =
    useState<ServicePoint | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingQRCode, setIsGeneratingQRCode] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [viewType, setViewType] = useState<"table" | "grid">("table");

  // Bulk actions state
  const [selectedServicePoints, setSelectedServicePoints] = useState<number[]>([]);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [bulkCommentsTitle, setBulkCommentsTitle] = useState("Any additional comments?");
  const [bulkCommentsPlaceholder, setBulkCommentsPlaceholder] = useState("Share your thoughts...");

  // Form state
  const [name, setName] = useState("");
  const [customQuestion, setCustomQuestion] = useState(
    "How would you rate your experience?"
  );
  const [showComments, setShowComments] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [currentQRCode, setCurrentQRCode] = useState<string | null>(null);

  // Service point-specific comment settings
  const [commentsTitle, setCommentsTitle] = useState("Any additional comments?");
  const [commentsPlaceholder, setCommentsPlaceholder] = useState("Share your thoughts...");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    } else {
      fetchServicePoints();
    }
  }, [isAuthenticated, router]);

  // Add effect to load comments setting from service points when data is loaded
  useEffect(() => {
    // Get comments setting from the first service point (if any exist)
    if (servicePoints.length > 0 && !isLoading) {
      const firstServicePoint = servicePoints[0];
      if (firstServicePoint.show_comments !== undefined) {
        setShowComments(firstServicePoint.show_comments);
      }
    }
  }, [servicePoints, isLoading]);

  const fetchServicePoints = async () => {
    setIsLoading(true);
    try {
      const data = await getServicePoints();
      setServicePoints(data);
    } catch (error) {
      console.error("Error fetching service points:", error);
      toast.error("Failed to load service points");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateServicePoint = async () => {
    try {
      const newServicePoint = await createServicePoint({
        name,
        location_type: "default", // Just use a default value since we're not using this field
        custom_question: customQuestion,
        show_comments: showComments,
        comments_title: commentsTitle,
        comments_placeholder: commentsPlaceholder,
        active: isActive,
      });

      if (newServicePoint) {
        toast.success(`Service point "${name}" created successfully`);
        fetchServicePoints();
        resetForm();
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating service point:", error);
      toast.error("Failed to create service point");
    }
  };

  const handleUpdateServicePoint = async () => {
    if (!selectedServicePoint) return;

    try {
      // Update service point with individual settings
      const updatedServicePoint = await updateServicePoint(
        selectedServicePoint.id,
        {
          name,
          active: isActive,
          show_comments: showComments,
          comments_title: commentsTitle,
          comments_placeholder: commentsPlaceholder,
        }
      );

      if (updatedServicePoint) {
        toast.success(`Service point "${name}" updated successfully`);
        fetchServicePoints();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating service point:", error);
      toast.error("Failed to update service point");
    }
  };

  const handleDeleteServicePoint = async () => {
    if (!selectedServicePoint) return;

    try {
      const success = await deleteServicePoint(selectedServicePoint.id);

      if (success) {
        toast.success(
          `Service point "${selectedServicePoint.name}" deleted successfully`
        );
        fetchServicePoints();
        setIsDeleteDialogOpen(false);
        setSelectedServicePoint(null);
      }
    } catch (error) {
      console.error("Error deleting service point:", error);
      toast.error("Failed to delete service point");
    }
  };

  const handleEdit = (servicePoint: ServicePoint) => {
    setSelectedServicePoint(servicePoint);
    setName(servicePoint.name);
    setIsActive(servicePoint.active);

    // Load service point-specific settings
    setShowComments(servicePoint.show_comments ?? true);
    setCommentsTitle(servicePoint.comments_title || "Any additional comments?");
    setCommentsPlaceholder(servicePoint.comments_placeholder || "Share your thoughts...");

    setIsEditDialogOpen(true);
  };

  const handleDelete = (servicePoint: ServicePoint) => {
    setSelectedServicePoint(servicePoint);
    setIsDeleteDialogOpen(true);
  };

  const handleGenerateQRCode = async (servicePoint: ServicePoint) => {
    setSelectedServicePoint(servicePoint);
    setIsGeneratingQRCode(true);

    try {
      // Generate the QR code
      const baseUrl = window.location.origin;
      const feedbackUrl = `${baseUrl}/feedback/${servicePoint.id}`;

      // Generate QR code as data URL (without logo first)
      // Increased resolution to 1000px for higher quality
      const qrCodeDataUrl = await QRCode.toDataURL(feedbackUrl, {
        width: 1000,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H", // High error correction for logo overlay
      });

      // Load the QR code image
      const qrImage = document.createElement("img");
      qrImage.src = qrCodeDataUrl;

      // Wait for the QR code to load
      await new Promise<void>((resolve) => {
        qrImage.onload = () => resolve();
      });

      // Create a canvas to combine QR code and logo
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas dimensions
      canvas.width = qrImage.width;
      canvas.height = qrImage.height;

      // Draw QR code onto canvas
      ctx.drawImage(qrImage, 0, 0);

      // Try to load SVG logo first
      const logoImg = document.createElement("img");
      logoImg.crossOrigin = "anonymous";

      // Try SVG with a PNG fallback
      const useSvgLogo = async () => {
        return new Promise<boolean>((resolveSvg) => {
          logoImg.src = "/agahflogo.svg";

          logoImg.onload = () => {
            try {
              // Calculate position for centered logo (about 25% of QR size)
              const logoSize = qrImage.width * 0.25;
              const logoX = (qrImage.width - logoSize) / 2;
              const logoY = (qrImage.height - logoSize) / 2;

              // Create white background for logo
              ctx.fillStyle = "white";
              ctx.fillRect(
                logoX - 10,
                logoY - 10,
                logoSize + 20,
                logoSize + 20
              );

              // Add a border around the white background
              ctx.strokeStyle = "#f0f0f0";
              ctx.lineWidth = 2;
              ctx.strokeRect(
                logoX - 10,
                logoY - 10,
                logoSize + 20,
                logoSize + 20
              );

              // Draw logo on top
              ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

              resolveSvg(true);
            } catch (err) {
              console.error("Error drawing SVG logo:", err);
              resolveSvg(false);
            }
          };

          logoImg.onerror = () => {
            console.error("Error loading SVG logo");
            resolveSvg(false);
          };

          // Set a timeout for SVG loading
          setTimeout(() => {
            resolveSvg(false);
          }, 2000);
        });
      };

      // Try using a PNG fallback if SVG fails
      const usePngLogo = async () => {
        return new Promise<void>((resolvePng) => {
          const pngLogo = document.createElement("img");
          pngLogo.crossOrigin = "anonymous";
          pngLogo.src = "/logo.png"; // Fallback to PNG version if available

          pngLogo.onload = () => {
            try {
              // Calculate position for centered logo
              const logoSize = qrImage.width * 0.25;
              const logoX = (qrImage.width - logoSize) / 2;
              const logoY = (qrImage.height - logoSize) / 2;

              // Create white background for logo
              ctx.fillStyle = "white";
              ctx.fillRect(
                logoX - 10,
                logoY - 10,
                logoSize + 20,
                logoSize + 20
              );

              // Draw PNG logo
              ctx.drawImage(pngLogo, logoX, logoY, logoSize, logoSize);
            } catch (err) {
              console.error("Error drawing PNG logo:", err);
            }
            resolvePng();
          };

          pngLogo.onerror = () => {
            console.error("Error loading PNG logo fallback");
            resolvePng();
          };

          // Timeout for PNG loading
          setTimeout(() => {
            resolvePng();
          }, 2000);
        });
      };

      // Try SVG first, fall back to PNG if needed
      const svgSuccess = await useSvgLogo();
      if (!svgSuccess) {
        await usePngLogo();
      }

      // Get the final QR code with logo as data URL
      const finalQrCodeWithLogo = canvas.toDataURL("image/png");
      setCurrentQRCode(finalQrCodeWithLogo);

      setIsPreviewDialogOpen(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");

      // Fallback to QR code without logo
      try {
        const baseUrl = window.location.origin;
        const feedbackUrl = `${baseUrl}/feedback/${servicePoint.id}`;

        const qrCodeDataUrl = await QRCode.toDataURL(feedbackUrl, {
          width: 1000,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        setCurrentQRCode(qrCodeDataUrl);
        setIsPreviewDialogOpen(true);
      } catch (fallbackError) {
        console.error("Error with fallback QR code:", fallbackError);
        toast.error("Failed to generate QR code");
      }
    } finally {
      setIsGeneratingQRCode(false);
    }
  };

  const handleDownloadQRCode = (format: "png" = "png", resolution?: number) => {
    if (!currentQRCode || !selectedServicePoint) return;

    try {
      // Only PNG handling - remove the if/else for SVG handling
      if (resolution && resolution !== 1000 && currentQRCode) {
        // Resize the QR code to the requested resolution
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        // Create an image from the current QR code
        const img = new Image();
        img.src = currentQRCode;

        // Wait for image to load
        img.onload = () => {
          // Set canvas to the desired resolution
          canvas.width = resolution;
          canvas.height = resolution;

          // Draw the image scaled to the new resolution
          ctx.drawImage(img, 0, 0, resolution, resolution);

          // Download the resized image
          const resizedQR = canvas.toDataURL("image/png");
          const resizedBlob = dataURLtoBlob(resizedQR);
          saveAs(
            resizedBlob,
            `${selectedServicePoint.name.replace(
              /\s+/g,
              "-"
            )}-QR-Code-${resolution}px.png`
          );
          toast.success(
            `QR code downloaded as ${resolution}x${resolution}px PNG`
          );
        };
      } else {
        // Download the original 1000px PNG
        const originalBlob = dataURLtoBlob(currentQRCode);
        saveAs(
          originalBlob,
          `${selectedServicePoint.name.replace(/\s+/g, "-")}-QR-Code.png`
        );
        toast.success("QR code downloaded as high-quality PNG");
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
    }
  };

  const resetForm = () => {
    setName("");
    setCustomQuestion("How would you rate your experience?");
    setShowComments(true);
    setIsActive(true);
    setCommentsTitle("Any additional comments?");
    setCommentsPlaceholder("Share your thoughts...");
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  // Bulk actions handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServicePoints(servicePoints.map(sp => sp.id));
    } else {
      setSelectedServicePoints([]);
    }
  };

  const handleSelectServicePoint = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedServicePoints(prev => [...prev, id]);
    } else {
      setSelectedServicePoints(prev => prev.filter(spId => spId !== id));
    }
  };

  const handleBulkAction = async () => {
    if (selectedServicePoints.length === 0 || !bulkAction) return;

    try {
      setIsLoading(true);

      const updatePromises = selectedServicePoints.map(async (id) => {
        const updateData: Partial<ServicePoint> = {};

        switch (bulkAction) {
          case 'activate':
            updateData.active = true;
            break;
          case 'deactivate':
            updateData.active = false;
            break;
          case 'enable-comments':
            updateData.show_comments = true;
            break;
          case 'disable-comments':
            updateData.show_comments = false;
            break;
          case 'update-comment-settings':
            updateData.show_comments = true;
            updateData.comments_title = bulkCommentsTitle;
            updateData.comments_placeholder = bulkCommentsPlaceholder;
            break;
        }

        return updateServicePoint(id, updateData);
      });

      await Promise.all(updatePromises);

      toast.success(`Bulk action applied to ${selectedServicePoints.length} service point${selectedServicePoints.length !== 1 ? 's' : ''}`, {
        description: getBulkActionDescription(bulkAction),
      });

      await fetchServicePoints();
      setSelectedServicePoints([]);
      setIsBulkActionsOpen(false);
      setBulkAction("");
    } catch (error) {
      console.error("Error applying bulk action:", error);
      toast.error("Failed to apply bulk action");
    } finally {
      setIsLoading(false);
    }
  };

  const getBulkActionDescription = (action: string) => {
    switch (action) {
      case 'activate': return 'Service points activated';
      case 'deactivate': return 'Service points deactivated';
      case 'enable-comments': return 'Comments enabled';
      case 'disable-comments': return 'Comments disabled';
      case 'update-comment-settings': return 'Comment settings updated';
      default: return 'Action completed';
    }
  };

  // Fix the dataURLtoBlob function to properly handle the conversion
  const dataURLtoBlob = (dataURL: string): Blob => {
    try {
      // Split the data URL
      const parts = dataURL.split(";base64,");
      if (parts.length !== 2) {
        throw new Error("Invalid data URL format");
      }

      // Get the content type from the data URL
      const contentType = parts[0].split(":")[1];

      // Convert base64 to binary
      const byteCharacters = window.atob(parts[1]);

      // Convert binary to byte array
      const byteArrays = [];
      const sliceSize = 512;

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      // Create and return the Blob
      return new Blob(byteArrays, { type: contentType });
    } catch (error) {
      console.error("Error converting data URL to Blob:", error);
      // Return a default empty blob if conversion fails
      return new Blob([], { type: "image/png" });
    }
  };

  // If user is not authenticated, don't render anything
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/agahflogo white.svg"
                alt="AGA Health Foundation Logo"
                width={50}
                height={50}
                style={{ width: "50px", height: "50px" }}
              />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Service Point Settings
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage your service points, QR codes, and feedback settings
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/reports/service-points">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <BarChart3 size={16} />
                <span className="hidden md:inline">Service Point Reports</span>
              </Button>
            </Link>
            <Link href="/reports">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Home size={16} />
                <span className="hidden md:inline">All Reports</span>
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="qr-codes" className="space-y-6">
          <TabsList className="border w-full">
            <TabsTrigger
              value="qr-codes"
              className="flex items-center gap-2 w-full"
            >
              <QrCode className="h-4 w-4" />
              QR Codes
            </TabsTrigger>

            <TabsTrigger
              value="service-points"
              className="flex items-center gap-2 w-full"
            >
              <BarChart3 className="h-4 w-4" />
              Service Points
            </TabsTrigger>
            <TabsTrigger
              value="survey-features"
              className="flex items-center gap-2 w-full"
            >
              <Settings className="h-4 w-4" />
              Survey Features
            </TabsTrigger>
          </TabsList>

          {/* QR Code Tab - Compact Multi-Column Layout */}
          <TabsContent value="qr-codes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {servicePoints.map((servicePoint) => (
                <Card
                  key={servicePoint.id}
                  className="border transition-all hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">
                          {servicePoint.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          ID: {servicePoint.id}
                        </CardDescription>
                      </div>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          servicePoint.active
                            ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {servicePoint.active ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* QR Code Display */}
                    <div className="flex justify-center">
                      <div className="p-3 rounded-lg border bg-background w-32 h-32 flex items-center justify-center">
                        {currentQRCode && selectedServicePoint?.id === servicePoint.id ? (
                          <img
                            src={currentQRCode}
                            alt={`QR code for ${servicePoint.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <QrCode className="h-8 w-8 mb-1" />
                            <span className="text-xs text-center">Not Generated</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleGenerateQRCode(servicePoint)}
                      >
                        <QrCode className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleDownloadQRCode("png")}
                        disabled={!(currentQRCode && selectedServicePoint?.id === servicePoint.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>

                    {/* Feedback URL */}
                    <div>
                      <div className="text-xs font-medium mb-1">Feedback URL:</div>
                      <div className="bg-muted p-2 rounded text-xs">
                        <code className="break-all">
                          {`${window.location.origin}/feedback/${servicePoint.id}`}
                        </code>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-3 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => window.open(`/feedback/${servicePoint.id}`, "_blank")}
                      >
                        Test
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => handleEdit(servicePoint)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(servicePoint)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {servicePoints.length === 0 && !isLoading && (
              <Card className="border-0">
                <CardContent className="p-12 text-center">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No service points available
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Create a service point to generate QR codes
                  </p>
                  <Button onClick={openCreateDialog}>
                    Create Service Point
                  </Button>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={openCreateDialog}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Service Point
              </Button>
            </div>
          </TabsContent>

          {/* Survey Features Tab */}
          <TabsContent value="survey-features" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Global Survey Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure default settings for new service points. Individual service points can override these settings.
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Settings */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Default Settings</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="show-comments" className="font-medium">
                              Comments Section
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Default comments setting for new service points
                            </p>
                          </div>
                          <Switch
                            id="show-comments"
                            checked={showComments}
                            onCheckedChange={setShowComments}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="service-point-active" className="font-medium">
                              Active Status
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Default active status for new service points
                            </p>
                          </div>
                          <Switch
                            id="service-point-active"
                            checked={isActive}
                            onCheckedChange={setIsActive}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-4">Default Content</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="custom-question" className="font-medium">
                            Survey Question
                          </Label>
                          <Textarea
                            id="custom-question"
                            value={customQuestion}
                            onChange={(e) => setCustomQuestion(e.target.value)}
                            placeholder="How would you rate your experience?"
                            className="min-h-[60px] mt-2"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="default-comments-title" className="text-sm">
                              Comments Title
                            </Label>
                            <Input
                              id="default-comments-title"
                              value={commentsTitle}
                              onChange={(e) => setCommentsTitle(e.target.value)}
                              placeholder="Any additional comments?"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="default-comments-placeholder" className="text-sm">
                              Comments Placeholder
                            </Label>
                            <Input
                              id="default-comments-placeholder"
                              value={commentsPlaceholder}
                              onChange={(e) => setCommentsPlaceholder(e.target.value)}
                              placeholder="Share your thoughts..."
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Preview */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Preview</h3>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="text-center mb-4">
                        <h4 className="font-medium text-sm">Feedback Form Preview</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {customQuestion}
                        </p>
                      </div>

                      <div className="grid grid-cols-5 gap-2 mb-4">
                        {[
                          "/service-points-emojis/Very Unsatisfied.svg",
                          "/service-points-emojis/Unsatisfied.svg",
                          "/service-points-emojis/Neutral.svg",
                          "/service-points-emojis/Satisfied.svg",
                          "/service-points-emojis/Very Satisfied.svg",
                        ].map((emoji, index) => (
                          <div key={index} className="p-2 border rounded text-center bg-background">
                            <div className="relative h-8 w-8 mx-auto">
                              <img
                                src={emoji}
                                alt={`Rating ${index + 1}`}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {showComments && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            {commentsTitle}
                          </label>
                          <textarea
                            className="w-full p-2 border rounded text-sm bg-background resize-none"
                            placeholder={commentsPlaceholder}
                            rows={2}
                            disabled
                          />
                        </div>
                      )}

                      <Button className="w-full mt-4" size="sm" disabled>
                        Submit Feedback
                      </Button>
                    </div>

                    <div className="text-center">
                      <Button
                        onClick={async () => {
                          try {
                            setIsLoading(true);
                            const updatePromises = servicePoints.map((sp) =>
                              updateServicePoint(sp.id, {
                                custom_question: customQuestion,
                                show_comments: showComments,
                              })
                            );
                            await Promise.all(updatePromises);
                            toast.success("Global settings saved", {
                              description: `Applied to ${servicePoints.length} service points`,
                            });
                            await fetchServicePoints();
                          } catch (error) {
                            toast.error("Failed to save settings");
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? "Saving..." : "Save Global Settings"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Points Tab */}
          <TabsContent value="service-points" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {selectedServicePoints.length > 0 && (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {selectedServicePoints.length} selected
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4 mr-2" />
                          Bulk Actions
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => { setBulkAction('activate'); setIsBulkActionsOpen(true); }}>
                          <Check className="h-4 w-4 mr-2" />
                          Activate Selected
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setBulkAction('deactivate'); setIsBulkActionsOpen(true); }}>
                          <X className="h-4 w-4 mr-2" />
                          Deactivate Selected
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => { setBulkAction('enable-comments'); setIsBulkActionsOpen(true); }}>
                          Enable Comments
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setBulkAction('disable-comments'); setIsBulkActionsOpen(true); }}>
                          Disable Comments
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setBulkAction('update-comment-settings'); setIsBulkActionsOpen(true); }}>
                          Update Comment Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
              <Button onClick={openCreateDialog}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Service Point
              </Button>
            </div>

            <Card className="border-0">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedServicePoints.length === servicePoints.length && servicePoints.length > 0}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all service points"
                        />
                      </TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicePoints.map((servicePoint) => (
                      <TableRow key={servicePoint.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedServicePoints.includes(servicePoint.id)}
                            onCheckedChange={(checked) => handleSelectServicePoint(servicePoint.id, checked as boolean)}
                            aria-label={`Select ${servicePoint.name}`}
                          />
                        </TableCell>
                        <TableCell className="font-mono">
                          {servicePoint.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {servicePoint.name}
                        </TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              servicePoint.active
                                ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {servicePoint.active ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            {servicePoint.active ? "Active" : "Inactive"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                                servicePoint.show_comments
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {servicePoint.show_comments ? "Enabled" : "Disabled"}
                            </div>
                            {servicePoint.show_comments && (
                              <div className="text-xs text-muted-foreground">
                                "{servicePoint.comments_title || "Any additional comments?"}"
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleGenerateQRCode(servicePoint)}
                            >
                              <QrCode className="h-3 w-3" />
                              QR
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => handleEdit(servicePoint)}
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(servicePoint)}
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {servicePoints.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                <p>
                  No service points found. Create your first service point
                  above.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Dialog - Keep existing dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Service Point</DialogTitle>
            <DialogDescription>
              Create a new service point for feedback collection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-point-name">Name</Label>
              <Input
                id="service-point-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter service point name"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="service-point-active-create">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Enable feedback collection for this service point
                </p>
              </div>
              <Switch
                id="service-point-active-create"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateServicePoint}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Compact version */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Service Point</DialogTitle>
            <DialogDescription>
              Update service point details and survey settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Basic Settings */}
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="service-point-name-edit">Name</Label>
                <Input
                  id="service-point-name-edit"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter service point name"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="service-point-active-edit">Active Status</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable feedback collection
                  </p>
                </div>
                <Switch
                  id="service-point-active-edit"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>

            {/* Survey Features */}
            <div className="space-y-3 border-t pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="service-point-comments-edit">Comments Section</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow additional feedback
                  </p>
                </div>
                <Switch
                  id="service-point-comments-edit"
                  checked={showComments}
                  onCheckedChange={setShowComments}
                />
              </div>

              {showComments && (
                <div className="space-y-3 ml-3 pl-3 border-l-2 border-muted">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="comments-title-edit" className="text-sm">Title</Label>
                      <Input
                        id="comments-title-edit"
                        value={commentsTitle}
                        onChange={(e) => setCommentsTitle(e.target.value)}
                        placeholder="Any additional comments?"
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="comments-placeholder-edit" className="text-sm">Placeholder</Label>
                      <Input
                        id="comments-placeholder-edit"
                        value={commentsPlaceholder}
                        onChange={(e) => setCommentsPlaceholder(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Compact Preview */}
                  <div className="border rounded p-3 bg-muted/10">
                    <div className="text-xs text-muted-foreground mb-2">Preview:</div>
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <div key={rating} className="h-4 w-4 bg-muted rounded-full"></div>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-medium">{commentsTitle}</div>
                        <div className="text-xs p-1 border rounded bg-background text-muted-foreground">
                          {commentsPlaceholder}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateServicePoint}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog - Keep existing dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete Service Point
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service point? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedServicePoint && (
              <p className="font-medium">
                Service Point:{" "}
                <span className="text-destructive">
                  {selectedServicePoint.name}
                </span>
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteServicePoint}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={isBulkActionsOpen} onOpenChange={setIsBulkActionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Action</DialogTitle>
            <DialogDescription>
              Apply action to {selectedServicePoints.length} selected service point{selectedServicePoints.length !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {bulkAction === 'update-comment-settings' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="bulk-comments-title">Comments Title</Label>
                  <Input
                    id="bulk-comments-title"
                    value={bulkCommentsTitle}
                    onChange={(e) => setBulkCommentsTitle(e.target.value)}
                    placeholder="Any additional comments?"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bulk-comments-placeholder">Comments Placeholder</Label>
                  <Input
                    id="bulk-comments-placeholder"
                    value={bulkCommentsPlaceholder}
                    onChange={(e) => setBulkCommentsPlaceholder(e.target.value)}
                    placeholder="Share your thoughts..."
                  />
                </div>
              </div>
            )}

            {bulkAction && bulkAction !== 'update-comment-settings' && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  {getBulkActionDescription(bulkAction)} for the selected service points.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkActionsOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkAction} disabled={isLoading}>
              {isLoading ? "Applying..." : "Apply Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog - Keep existing dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Preview</DialogTitle>
            <DialogDescription>{selectedServicePoint?.name}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            {currentQRCode && (
              <div
                className="mb-4 border rounded-md overflow-hidden"
                style={{ width: 300, height: 300 }}
              >
                <img
                  src={currentQRCode}
                  alt={`QR Code for ${
                    selectedServicePoint?.name || "Service Point"
                  }`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-sm font-medium mb-1">Download Options</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentQRCode && selectedServicePoint) {
                      const link = document.createElement("a");
                      link.href = currentQRCode;
                      link.download = `${selectedServicePoint.name.replace(
                        /\s+/g,
                        "-"
                      )}-QR-Code.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success("High quality QR code downloaded");
                    }
                  }}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  High Quality PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentQRCode && selectedServicePoint) {
                      // Create a new canvas for the smaller size
                      const canvas = document.createElement("canvas");
                      const ctx = canvas.getContext("2d");
                      canvas.width = 300;
                      canvas.height = 300;

                      // Create an image from the QR code
                      const img = new Image();
                      img.onload = () => {
                        if (ctx) {
                          ctx.drawImage(img, 0, 0, 300, 300);
                          const smallQR = canvas.toDataURL("image/png");

                          const link = document.createElement("a");
                          link.href = smallQR;
                          link.download = `${selectedServicePoint.name.replace(
                            /\s+/g,
                            "-"
                          )}-QR-Code-300px.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.success("Standard QR code (300px) downloaded");
                        }
                      };
                      img.src = currentQRCode;
                    }
                  }}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Standard PNG (300px)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (currentQRCode && selectedServicePoint) {
                      // Create a new canvas for the medium size
                      const canvas = document.createElement("canvas");
                      const ctx = canvas.getContext("2d");
                      canvas.width = 500;
                      canvas.height = 500;

                      // Create an image from the QR code
                      const img = new Image();
                      img.onload = () => {
                        if (ctx) {
                          ctx.drawImage(img, 0, 0, 500, 500);
                          const mediumQR = canvas.toDataURL("image/png");

                          const link = document.createElement("a");
                          link.href = mediumQR;
                          link.download = `${selectedServicePoint.name.replace(
                            /\s+/g,
                            "-"
                          )}-QR-Code-500px.png`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.success("Medium QR code (500px) downloaded");
                        }
                      };
                      img.src = currentQRCode;
                    }
                  }}
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Medium PNG (500px)
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPreviewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
