"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Home,
  Download,
  RefreshCw,
  ChevronLeft,
  Loader2,
  Printer,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import {
  ServicePoint,
  fetchServicePoints,
  fetchServicePointFeedbackStats,
  fetchServicePointFeedbackItems,
  createServicePoint,
  deleteServicePoint,
  updateServicePoint,
} from "@/app/actions/service-point-actions";
import QRCode from "react-qr-code";

// Import our component tabs
import AnalyticsTab from "./components/analytics-tab";
import ManagementTab from "./components/management-tab";
import QRCodeTab from "./components/qr-code-tab";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  ArcElement,
  PieController,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement,
  PieController
);

// Colors for charts
const COLORS = [
  "#4caf50", // dark teal
  "#22c5bf", // light teal
  "#e8e5c0", // beige
  "#f6a050", // orange
  "#e84e3c", // red
];

interface ServicePointStats {
  id: number;
  name: string;
  averageRating: number;
  totalFeedback: number;
  recommendRate: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export default function ServicePointsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [dateRange, setDateRange] = useState("all");
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [selectedServicePoint, setSelectedServicePoint] = useState<
    number | null
  >(null);
  const [activeTab, setActiveTab] = useState("analytics");
  const [servicePoints, setServicePoints] = useState<ServicePoint[]>([]);
  const [servicePointStats, setServicePointStats] = useState<
    ServicePointStats[]
  >([]);
  const [recentFeedback, setRecentFeedback] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  // Management related state
  const [filteredServicePoints, setFilteredServicePoints] = useState<
    ServicePoint[]
  >([]);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [qrServicePoint, setQrServicePoint] = useState<ServicePoint | null>(
    null
  );

  // Global feedback options states - initialize with defaults
  const [globalRecommendQuestion, setGlobalRecommendQuestion] = useState(true);
  const [globalCommentsBox, setGlobalCommentsBox] = useState(true);

  useEffect(() => {
    setIsAuthChecked(true);
  }, []);

  useEffect(() => {
    if (isAuthChecked) {
      if (!isAuthenticated) {
        router.push("/");
      } else {
        // Check URL parameters for tab selection
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const tabParam = params.get("tab");
          if (
            tabParam &&
            (tabParam === "analytics" ||
              tabParam === "manage" ||
              tabParam === "qrcodes")
          ) {
            setActiveTab(tabParam);
          }
        }

        loadData();
      }
    }
  }, [isAuthenticated, router, isAuthChecked]);

  // Initialize global toggle states based on service points data
  useEffect(() => {
    if (servicePoints.length > 0) {
      // If all service points have the setting disabled, initialize the toggle to off
      const allHaveRecommendDisabled = servicePoints.every(
        (sp) => !sp.show_recommend_question
      );
      const allHaveCommentsDisabled = servicePoints.every(
        (sp) => !sp.show_comments_box
      );

      setGlobalRecommendQuestion(!allHaveRecommendDisabled);
      setGlobalCommentsBox(!allHaveCommentsDisabled);
    }
  }, [servicePoints]);

  // Reload data when date range changes
  useEffect(() => {
    if (isAuthenticated && isAuthChecked) {
      loadData();
    }
  }, [dateRange]);

  // Load feedback for selected service point
  useEffect(() => {
    if (selectedServicePoint && activeTab === "analytics") {
      loadFeedbackForServicePoint(selectedServicePoint);
    }
  }, [selectedServicePoint, dateRange, activeTab]);

  // Filter service points based on active management tab
  useEffect(() => {
    if (servicePoints.length > 0) {
      filterServicePoints(activeTab, servicePoints);
    }
  }, [activeTab, servicePoints]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch service points
      const pointsData = await fetchServicePoints();
      console.log("Loaded service points:", pointsData); // Log the data for debugging
      setServicePoints(pointsData);
      filterServicePoints(activeTab, pointsData);

      // Fetch stats if on analytics tab
      if (activeTab === "analytics") {
        const stats = await fetchServicePointFeedbackStats(dateRange);
        if (stats && stats.servicePoints) {
          setServicePointStats(stats.servicePoints);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterServicePoints = (tab: string, points: ServicePoint[]) => {
    switch (tab) {
      case "active":
        setFilteredServicePoints(points.filter((sp) => sp.is_active));
        break;
      case "inactive":
        setFilteredServicePoints(points.filter((sp) => !sp.is_active));
        break;
      default:
        setFilteredServicePoints(points);
        break;
    }
  };

  const loadFeedbackForServicePoint = async (servicePointId: number) => {
    setIsLoadingFeedback(true);
    try {
      const feedback = await fetchServicePointFeedbackItems(
        dateRange,
        servicePointId.toString(),
        5
      );
      setRecentFeedback(feedback);
    } catch (error) {
      console.error(
        `Error fetching feedback for service point ${servicePointId}:`,
        error
      );
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const getServicePointStats = (id: number) => {
    return (
      servicePointStats.find((stat) => stat.id === id) || {
        averageRating: 0,
        totalFeedback: 0,
        recommendRate: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      }
    );
  };

  const getRatingDistribution = (id: number) => {
    const stats = getServicePointStats(id);
    return [
      stats.ratingDistribution[1],
      stats.ratingDistribution[2],
      stats.ratingDistribution[3],
      stats.ratingDistribution[4],
      stats.ratingDistribution[5],
    ];
  };

  // Management functions
  const handleDeleteServicePoint = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service point?")) return;

    try {
      await deleteServicePoint(id);
      setServicePoints((prev) => prev.filter((sp) => sp.id !== id));
      // If the deleted service point is selected in analytics, clear selection
      if (selectedServicePoint === id) {
        setSelectedServicePoint(null);
      }
    } catch (error) {
      console.error("Error deleting service point:", error);
      alert("Failed to delete service point. Please try again.");
    }
  };

  // Helper function to generate full URL for QR codes
  const getFullUrl = (id: number): string => {
    // Get the current host (works in development and production)
    const host = typeof window !== "undefined" ? window.location.host : "";

    // Use HTTP for localhost, HTTPS for other hosts
    const protocol = host.includes("localhost") ? "http" : "https";

    return `${protocol}://${host}/feedback/${id}`;
  };

  const handleViewQrCode = (servicePoint: ServicePoint) => {
    setQrServicePoint(servicePoint);
    setIsQrDialogOpen(true);
  };

  const handlePrintQRCode = (servicePoint: ServicePoint) => {
    // Create a temporary div for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print QR codes");
      return;
    }

    const url = getFullUrl(servicePoint.id);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${servicePoint.name}</title>
          <style>
            body { 
              font-family: sans-serif;
              text-align: center;
              padding: 40px;
            }
            .container {
              max-width: 400px;
              margin: 0 auto;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              border-radius: 8px;
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #333;
            }
            .qr-code {
              margin: 30px auto;
              width: 300px;
              height: 300px;
              position: relative;
              background: #fff;
            }
            p {
              color: #666;
              margin-top: 20px;
            }
            #qrcode {
              width: 300px;
              height: 300px;
              margin: 0 auto;
            }
            .logo {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 60px;
              height: 60px;
              background: white;
              padding: 5px;
              border-radius: 4px;
            }
            .error-message {
              color: red;
              margin-top: 10px;
              display: none;
            }
            @media print {
              body {
                padding: 0;
              }
              .container {
                box-shadow: none;
                padding: 0;
              }
              .error-message {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${servicePoint.name}</h1>
            <div class="qr-code">
              <canvas id="qrcode"></canvas>
              <div class="logo">
                <img src="${window.location.origin}/agahflogo svg.svg" width="60" height="60" alt="Logo" />
              </div>
            </div>
            <p>Scan this QR code to provide quick feedback</p>
            <p class="error-message" id="error-message">QR code failed to load. Please try again.</p>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
          <script>
            function renderQRCode() {
              if (typeof QRCode === 'undefined') {
                document.getElementById('error-message').style.display = 'block';
                return;
              }
              
              try {
                QRCode.toCanvas(document.getElementById('qrcode'), "${url}", {
                  width: 300,
                  margin: 1,
                  errorCorrectionLevel: 'H',
                  color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                  }
                }, function(error) {
                  if (error) {
                    console.error(error);
                    document.getElementById('error-message').style.display = 'block';
                    return;
                  }
                  
                  // If successful, set a longer delay before printing
                  setTimeout(function() {
                    window.print();
                  }, 2000);
                });
              } catch (e) {
                console.error(e);
                document.getElementById('error-message').style.display = 'block';
              }
            }
            
            // First load the image, then render the QR code
            window.onload = function() {
              // Give time for the script to load
              setTimeout(renderQRCode, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Function to update all service points
  const updateAllServicePointOptions = async () => {
    try {
      // Update all service points in the database
      for (const sp of servicePoints) {
        await updateServicePoint(sp.id, {
          show_recommend_question: globalRecommendQuestion,
          show_comments_box: globalCommentsBox,
        });
      }

      // Reload data from the server to ensure we have the latest state
      await loadData();

      alert("All service points updated successfully");
    } catch (error) {
      console.error("Error updating service points:", error);
      alert("Failed to update all service points");
    }
  };

  // If not authenticated, don't render the page content
  if (!isAuthenticated && isAuthChecked) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src="/agahflogo svg.svg"
                alt="AGA Health Foundation Logo"
                width={50}
                height={50}
              />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Service Points
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage and analyze service point feedback
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
            <Link href="/reports">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                <span className="hidden md:inline">Reports</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => loadData()}
            >
              <RefreshCw size={16} />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="analytics">
              Analytics
            </TabsTrigger>
            <TabsTrigger className="w-full" value="manage">
              Manage
            </TabsTrigger>
            <TabsTrigger className="w-full" value="qrcodes">
              QR Codes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <AnalyticsTab
              servicePoints={servicePoints}
              servicePointStats={servicePointStats}
              selectedServicePoint={selectedServicePoint}
              setSelectedServicePoint={setSelectedServicePoint}
              dateRange={dateRange}
              setDateRange={setDateRange}
              isLoading={isLoading}
              isLoadingFeedback={isLoadingFeedback}
              recentFeedback={recentFeedback}
              getServicePointStats={getServicePointStats}
              getRatingDistribution={getRatingDistribution}
              loadData={loadData}
            />
          </TabsContent>

          <TabsContent value="manage">
            <ManagementTab
              servicePoints={servicePoints}
              filteredServicePoints={filteredServicePoints}
              isLoading={isLoading}
              handleDeleteServicePoint={handleDeleteServicePoint}
              handleViewQrCode={handleViewQrCode}
              loadData={loadData}
              createServicePoint={createServicePoint}
            />

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Global Feedback Options</CardTitle>
                <CardDescription>
                  Configure feedback options for all service points at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="global-recommend" className="font-medium">
                      Show "Would you recommend" question for all service points
                    </Label>
                    <Switch
                      id="global-recommend"
                      checked={globalRecommendQuestion}
                      onCheckedChange={setGlobalRecommendQuestion}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="global-comments" className="font-medium">
                      Show comments box for all service points
                    </Label>
                    <Switch
                      id="global-comments"
                      checked={globalCommentsBox}
                      onCheckedChange={setGlobalCommentsBox}
                    />
                  </div>
                  <Button
                    onClick={updateAllServicePointOptions}
                    className="w-full mt-4"
                  >
                    Apply to All Service Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qrcodes">
            <QRCodeTab servicePoints={servicePoints} />
          </TabsContent>
        </Tabs>

        {/* QR Code Dialog */}
        <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Service Point QR Code</DialogTitle>
              <DialogDescription>
                {qrServicePoint && `For ${qrServicePoint.name}`}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-4">
              {qrServicePoint && (
                <>
                  <div className="bg-white p-4 rounded-md mb-4 relative">
                    <QRCode
                      value={
                        qrServicePoint ? getFullUrl(qrServicePoint.id) : ""
                      }
                      size={200}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm">
                        <Image
                          src="/agahflogo svg.svg"
                          alt="AGAHF Logo"
                          width={70}
                          height={24}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-center mb-2">
                    Scan this QR code to provide quick feedback
                  </p>
                </>
              )}
            </div>
            <DialogFooter className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsQrDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => {
                  if (qrServicePoint) {
                    handlePrintQRCode(qrServicePoint);
                  }
                }}
              >
                <Printer size={16} />
                Print
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
