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

  // Form state
  const [name, setName] = useState("");
  const [customQuestion, setCustomQuestion] = useState(
    "How would you rate your experience?"
  );
  const [showComments, setShowComments] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [currentQRCode, setCurrentQRCode] = useState<string | null>(null);

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
      // For individual service point updates, only update name and active status
      // The show_comments setting is managed globally through the Survey Features tab
      const updatedServicePoint = await updateServicePoint(
        selectedServicePoint.id,
        {
          name,
          active: isActive,
          // Not updating global settings here
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
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
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

          {/* QR Code Tab */}
          <TabsContent value="qr-codes" className="space-y-6">
            {process.env.NODE_ENV === "development" && (
              <Card className="border-0 mb-4"></Card>
            )}

            <div className="grid gap-6">
              {servicePoints.map((servicePoint) => (
                <Card
                  key={servicePoint.id}
                  className="border-2 backdrop-blur-sm  transition-all hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {servicePoint.name}
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              servicePoint.active
                                ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {servicePoint.active ? "Active" : "Inactive"}
                          </div>
                        </CardTitle>
                        <CardDescription>
                          Service Point {servicePoint.id}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="p-4 rounded-lg shadow border w-full max-w-[250px] flex items-center justify-center bg-background">
                            {currentQRCode &&
                            selectedServicePoint?.id === servicePoint.id ? (
                              <div
                                style={{
                                  width: 200,
                                  height: 200,
                                  position: "relative",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "0.375rem",
                                  overflow: "hidden",
                                }}
                              >
                                <img
                                  src={currentQRCode}
                                  alt={`QR code for ${servicePoint.name}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                                <QrCode className="h-16 w-16 mb-2" />
                                <span className="text-sm">
                                  Click Generate to create QR Code
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() => handleGenerateQRCode(servicePoint)}
                            >
                              <QrCode className="h-4 w-4" />
                              Generate
                            </Button>
                            <Button
                              variant="outline"
                              className="flex items-center gap-2"
                              onClick={() => handleDownloadQRCode("png")}
                              disabled={
                                !(
                                  currentQRCode &&
                                  selectedServicePoint?.id === servicePoint.id
                                )
                              }
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Feedback URL</h4>
                          <div className="bg-muted p-3 rounded-lg">
                            <code className="text-sm break-all">{`${window.location.origin}/feedback/${servicePoint.id}`}</code>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">
                            QR Code Instructions
                          </h4>
                          <div className="flex flex-row gap-4 items-start">
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground mb-2">
                                Generate and print QR codes (min 4x4 inches) to
                                collect feedback. Place them where customers can
                                easily scan with instructions "Scan to rate your
                                experience".
                              </p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() =>
                                    window.open(
                                      `/feedback/${servicePoint.id}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3 mr-1"
                                  >
                                    <path d="m21 7-8-4-8 4" />
                                    <path d="M3 7v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                                    <path d="M7 15h0M17 15h0" />
                                  </svg>
                                  Test Form
                                </Button>
                              </div>
                            </div>
                            <div className="min-w-[140px] bg-accent p-3 rounded-lg border text-center">
                              <h5 className="font-bold text-sm">
                                Rate Your Experience
                              </h5>
                              <p className="text-xs mb-1">Scan the QR code</p>
                              <div className="bg-background p-2 rounded border border-dashed inline-block">
                                <QrCode className="h-6 w-6 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleEdit(servicePoint)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(servicePoint)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </CardFooter>
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">Survey Configuration</h2>
                <p className="text-muted-foreground">
                  Customize how your feedback forms work across all service
                  points
                </p>
              </div>
              <Button
                id="save-settings-button"
                onClick={async () => {
                  try {
                    setIsLoading(true);

                    // Update all existing service points with the new global settings
                    const updatePromises = servicePoints.map((sp) =>
                      updateServicePoint(sp.id, {
                        custom_question: customQuestion,
                        show_comments: showComments,
                      })
                    );

                    await Promise.all(updatePromises);
                    toast.success("Settings saved successfully", {
                      description: `Applied to ${
                        servicePoints.length
                      } service point${servicePoints.length !== 1 ? "s" : ""}`,
                      duration: 3000,
                    });
                    await fetchServicePoints();
                  } catch (error) {
                    console.error("Error updating settings:", error);
                    toast.error("Failed to save settings", {
                      description: "Please try again or contact support",
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save Settings
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Survey Features</CardTitle>
                  <CardDescription>
                    Control which features are shown in your surveys
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label
                        htmlFor="show-comments"
                        className="text-base font-medium"
                      >
                        Comments Section
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Allow customers to leave additional comments
                      </p>
                    </div>
                    <Switch
                      id="show-comments"
                      checked={showComments}
                      onCheckedChange={(checked) => {
                        setShowComments(checked);
                        toast(
                          checked ? "Comments enabled" : "Comments disabled",
                          {
                            description: checked
                              ? "Customers can leave additional feedback"
                              : "Comment section will be hidden",
                            action: {
                              label: "Save",
                              onClick: () =>
                                document
                                  .getElementById("save-settings-button")
                                  ?.click(),
                            },
                          }
                        );
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="space-y-1">
                      <Label
                        htmlFor="service-point-active"
                        className="text-base font-medium"
                      >
                        Default Service Point Status
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Set the default active status for new service points
                      </p>
                    </div>
                    <Switch
                      id="service-point-active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Survey Content</CardTitle>
                  <CardDescription>
                    Customize the text and messages shown in your surveys
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label
                      htmlFor="custom-question"
                      className="text-base font-medium"
                    >
                      Survey Question
                    </Label>
                    <Textarea
                      id="custom-question"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="How would you rate your experience?"
                      className="min-h-[80px] mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This question will appear on all service point feedback
                      forms
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="thankYouMessage">Thank You Message</Label>
                    <Input
                      id="thankYouMessage"
                      placeholder="Thank you for your feedback!"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      The message displayed after users submit their feedback
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    See how your survey will look to customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border rounded-lg p-6 mx-auto w-full max-w-md">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold">Feedback Form</h3>
                        <p className="text-muted-foreground text-sm">
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
                          <div
                            key={index}
                            className="p-2 border rounded text-center"
                          >
                            <div className="relative h-10 w-10 mx-auto">
                              <img
                                src={emoji}
                                alt={`Rating ${index + 1}`}
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {showComments && (
                        <div className="mb-4">
                          <textarea
                            className="w-full p-2 border rounded text-sm bg-background"
                            placeholder="Any additional comments?"
                            rows={2}
                            disabled
                          />
                        </div>
                      )}

                      <Button className="w-full" disabled>
                        Submit Feedback
                      </Button>
                    </div>

                    <div>
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold mb-2">
                          QR Code Settings
                        </h3>
                        <p className="text-muted-foreground">
                          Configure appearance of your QR codes
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="logo">Company Logo</Label>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex-1">
                              <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                className="cursor-pointer"
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                Recommended: Square image, max 200x200px, PNG or
                                JPG format
                              </p>
                            </div>
                            <div className="w-16 h-16 border rounded-lg overflow-hidden flex items-center justify-center bg-background">
                              <img
                                src="/agahflogo.svg"
                                alt="Logo preview"
                                width={48}
                                height={48}
                                className="object-contain"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <Label htmlFor="qrColor">QR Code Color</Label>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 grid grid-cols-5 gap-2">
                              {[
                                "#000000",
                                "#2563eb",
                                "#059669",
                                "#dc2626",
                                "#7c3aed",
                              ].map((color) => (
                                <div
                                  key={color}
                                  className="h-8 w-8 rounded-full cursor-pointer border-2 border-transparent hover:border-gray-300"
                                  style={{ backgroundColor: color }}
                                ></div>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Choose a color for your QR code
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Points Tab */}
          <TabsContent value="service-points" className="space-y-6">
            <div className="flex justify-end mb-4">
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
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servicePoints.map((servicePoint) => (
                      <TableRow key={servicePoint.id}>
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

      {/* Edit Dialog - Keep existing dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service Point</DialogTitle>
            <DialogDescription>
              Update the selected service point details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
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
                <Label htmlFor="service-point-active-edit">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Enable feedback collection for this service point
                </p>
              </div>
              <Switch
                id="service-point-active-edit"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
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
