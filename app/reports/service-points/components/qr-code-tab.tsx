"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { Download, Printer, X } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServicePoint } from "@/app/actions/service-point-actions";
import html2canvas from "html2canvas";

// Update all QR code URLs to include https:// protocol
export const getFullUrl = (id: number): string => {
  // Get the current host (works in development and production)
  const host = typeof window !== "undefined" ? window.location.host : "";

  // Use HTTP for localhost, HTTPS for other hosts
  const protocol = host.includes("localhost") ? "http" : "https";

  // Create an absolute URL with the appropriate protocol
  return `${protocol}://${host}/feedback/${id}`;
};

interface QRCodeTabProps {
  servicePoints: ServicePoint[];
}

export default function QRCodeTab({ servicePoints }: QRCodeTabProps) {
  const [expandedServicePoint, setExpandedServicePoint] = useState<
    number | null
  >(null);
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false);

  // Load QR code library
  useEffect(() => {
    const loadQRCodeLibrary = async () => {
      if (typeof window !== "undefined" && !window.QRCode) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js";
        script.async = true;
        script.onload = () => setQrCodeLoaded(true);
        document.head.appendChild(script);
      } else {
        setQrCodeLoaded(true);
      }
    };

    loadQRCodeLibrary();
  }, []);

  const handlePrint = async (id: number) => {
    const servicePoint = servicePoints.find((sp) => sp.id === id);
    if (!servicePoint) return;

    // Create a temporary div for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print QR codes");
      return;
    }

    const url = getFullUrl(id);

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

  const handleDownload = async (id: number) => {
    const servicePoint = servicePoints.find((sp) => sp.id === id);
    if (!servicePoint) return;

    if (!qrCodeLoaded || !window.QRCode) {
      alert("QR Code library not loaded yet. Please try again in a moment.");
      return;
    }

    try {
      // Create a temporary div for high-resolution QR code
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "fixed";
      tempDiv.style.left = "-9999px";
      tempDiv.style.top = "-9999px";
      tempDiv.style.background = "white";
      tempDiv.style.padding = "40px";
      document.body.appendChild(tempDiv);

      // Create a canvas for the QR code
      const qrCanvas = document.createElement("canvas");
      qrCanvas.width = 1000;
      qrCanvas.height = 1000;
      tempDiv.appendChild(qrCanvas);

      // URL to encode in QR code
      const url = getFullUrl(id);

      // Generate the QR code directly on canvas
      window.QRCode.toCanvas(
        qrCanvas,
        url,
        {
          width: 800,
          margin: 4,
          errorCorrectionLevel: "H",
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        async function (error: Error | null) {
          if (error) {
            console.error(error);
            document.body.removeChild(tempDiv);
            alert("Failed to generate QR code");
            return;
          }

          try {
            // Create another canvas for adding the logo
            const finalCanvas = document.createElement("canvas");
            finalCanvas.width = 1000;
            finalCanvas.height = 1000;
            const ctx = finalCanvas.getContext("2d");

            if (ctx) {
              // First draw the QR code
              ctx.fillStyle = "#FFFFFF";
              ctx.fillRect(0, 0, 1000, 1000);
              ctx.drawImage(qrCanvas, 100, 100, 800, 800);

              // Load the logo
              const logoImg = new window.Image();
              logoImg.onload = function () {
                // Create white background for logo
                ctx.fillStyle = "white";
                const centerSize = 200;
                const centerX = (finalCanvas.width - centerSize) / 2;
                const centerY = (finalCanvas.height - centerSize) / 2;
                ctx.fillRect(centerX, centerY, centerSize, centerSize);

                // Draw logo
                ctx.drawImage(
                  logoImg,
                  centerX + 25,
                  centerY + 25,
                  centerSize - 50,
                  centerSize - 50
                );

                // Add text
                ctx.font = "bold 20px Arial";
                ctx.fillStyle = "#000";
                ctx.textAlign = "center";
                ctx.fillText(
                  servicePoint.name,
                  finalCanvas.width / 2,
                  finalCanvas.height - 50
                );

                // Convert to data URL and download
                const dataUrl = finalCanvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = dataUrl;
                downloadLink.download = `qr-code-${
                  servicePoint.name || id
                }.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();

                // Clean up
                document.body.removeChild(downloadLink);
                document.body.removeChild(tempDiv);
              };

              logoImg.onerror = function () {
                console.error("Failed to load logo");
                const dataUrl = finalCanvas.toDataURL("image/png");
                const downloadLink = document.createElement("a");
                downloadLink.href = dataUrl;
                downloadLink.download = `qr-code-${
                  servicePoint.name || id
                }.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();

                document.body.removeChild(downloadLink);
                document.body.removeChild(tempDiv);
              };

              logoImg.src = "/agahflogo svg.svg";
            } else {
              throw new Error("Could not get canvas context");
            }
          } catch (canvasError) {
            console.error("Error creating final image:", canvasError);
            document.body.removeChild(tempDiv);
            alert("Failed to create QR code image");
          }
        }
      );
    } catch (error) {
      console.error("Error downloading QR code:", error);
      alert("Failed to download QR code. Please try again.");
    }
  };

  const handleToggleExpand = (id: number) => {
    setExpandedServicePoint(expandedServicePoint === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Service Point QR Codes</h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => {
            window.print();
          }}
        >
          <Printer size={16} />
          <span>Print All</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Point QR Codes</CardTitle>
          <CardDescription>
            Click on a QR code to view full details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {servicePoints.map((sp) => (
              <div key={sp.id} className="space-y-4">
                <div
                  className="border rounded-md p-4 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleToggleExpand(sp.id)}
                >
                  <h3 className="font-medium mb-2">{sp.name}</h3>
                  <div
                    id={`qr-code-${sp.id}`}
                    className="bg-white p-2 rounded-md mb-2 relative"
                  >
                    <QRCode value={getFullUrl(sp.id)} size={120} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-2 rounded-sm shadow-sm">
                        <Image
                          src="/agahflogo svg.svg"
                          alt="AGAHF Logo"
                          width={45}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrint(sp.id);
                      }}
                    >
                      <Printer size={14} className="mr-1" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(sp.id);
                      }}
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                {expandedServicePoint === sp.id && (
                  <div className="border rounded-md p-4 bg-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">QR Code Details</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedServicePoint(null)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-4 rounded-md mb-4 relative">
                        <QRCode value={getFullUrl(sp.id)} size={200} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white rounded-sm shadow-sm">
                            <Image
                              src="/agahflogo svg.svg"
                              alt="AGAHF Logo"
                              width={70}
                              height={24}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-center mb-2 text-black text-muted-foreground">
                        URL: {getFullUrl(sp.id)}
                      </p>
                      <p className="text-xs text-center text-muted-foreground">
                        Scan this QR code to access the feedback form for{" "}
                        {sp.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add TypeScript global declaration for QRCode
declare global {
  interface Window {
    QRCode: any;
  }
}
