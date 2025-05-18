"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchServicePoints } from "@/app/actions/service-point-actions"
import { generateQRCode } from "@/lib/qr-code"
import { Printer, Download, RefreshCw } from "lucide-react"

export default function QRCodeGeneratorPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  const [servicePoints, setServicePoints] = useState<{ id: number; name: string }[]>([])
  const [selectedServicePoint, setSelectedServicePoint] = useState<string | null>(null)
  const [qrCodeData, setQrCodeData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [customName, setCustomName] = useState("")
  const [customId, setCustomId] = useState("")
  const [activeTab, setActiveTab] = useState("existing")
  const [baseUrl, setBaseUrl] = useState("")

  useEffect(() => {
    setIsAuthChecked(true)
    setBaseUrl(process.env.NEXT_PUBLIC_APP_URL || window.location.origin)
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
      const points = await fetchServicePoints()
      setServicePoints(points)
    } catch (error) {
      console.error("Error loading service points:", error)
    }
  }

  const generateQR = async () => {
    setLoading(true)
    try {
      let url = ""
      let name = ""

      if (activeTab === "existing" && selectedServicePoint) {
        const servicePoint = servicePoints.find((sp) => sp.id.toString() === selectedServicePoint)
        if (!servicePoint) {
          throw new Error("Service point not found")
        }
        url = `${baseUrl}/feedback?id=${servicePoint.id}`
        name = servicePoint.name
      } else if (activeTab === "custom" && customId) {
        url = `${baseUrl}/feedback?id=${customId}`
        name = customName || `Service Point ${customId}`
      } else {
        throw new Error("Please select a service point or enter a custom ID")
      }

      const qrCode = await generateQRCode(url)
      setQrCodeData(qrCode)
    } catch (error) {
      console.error("Error generating QR code:", error)
      alert("Failed to generate QR code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (!qrCodeData) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow pop-ups to print the QR code")
      return
    }

    const servicePoint =
      activeTab === "existing" && selectedServicePoint
        ? servicePoints.find((sp) => sp.id.toString() === selectedServicePoint)?.name
        : customName || `Service Point ${customId}`

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${servicePoint}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .qr-container {
              max-width: 400px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 8px;
            }
            .qr-code {
              width: 300px;
              height: 300px;
              margin: 20px auto;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 18px;
              margin-bottom: 20px;
            }
            .instructions {
              font-size: 14px;
              color: #555;
              margin-top: 20px;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="title">AGA Health Foundation</div>
            <div class="subtitle">${servicePoint}</div>
            <img src="${qrCodeData}" alt="QR Code" class="qr-code" />
            <div class="instructions">Scan this QR code to provide feedback</div>
          </div>
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleDownload = () => {
    if (!qrCodeData) return

    const servicePoint =
      activeTab === "existing" && selectedServicePoint
        ? servicePoints.find((sp) => sp.id.toString() === selectedServicePoint)?.name
        : customName || `Service Point ${customId}`

    const link = document.createElement("a")
    link.href = qrCodeData
    link.download = `qr-code-${servicePoint.replace(/\s+/g, "-").toLowerCase()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isAuthenticated && isAuthChecked) {
    return null
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">QR Code Generator</h1>
          <p className="text-muted-foreground">Generate QR codes for service point feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate QR Code</CardTitle>
              <CardDescription>Create a QR code for a service point</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="existing">Existing Service Point</TabsTrigger>
                  <TabsTrigger value="custom">Custom Service Point</TabsTrigger>
                </TabsList>

                <TabsContent value="existing" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-point">Select Service Point</Label>
                    <Select value={selectedServicePoint || ""} onValueChange={setSelectedServicePoint}>
                      <SelectTrigger id="service-point">
                        <SelectValue placeholder="Select a service point" />
                      </SelectTrigger>
                      <SelectContent>
                        {servicePoints.map((sp) => (
                          <SelectItem key={sp.id} value={sp.id.toString()}>
                            {sp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-id">Service Point ID</Label>
                    <Input
                      id="custom-id"
                      type="number"
                      placeholder="Enter service point ID"
                      value={customId}
                      onChange={(e) => setCustomId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custom-name">Service Point Name (Optional)</Label>
                    <Input
                      id="custom-name"
                      placeholder="Enter service point name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button onClick={generateQR} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate QR Code"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code Preview</CardTitle>
              <CardDescription>Scan this code to access the feedback form</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px]">
              {qrCodeData ? (
                <div className="text-center">
                  <div className="mb-4">
                    <img src={qrCodeData || "/placeholder.svg"} alt="QR Code" className="mx-auto" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {activeTab === "existing" && selectedServicePoint
                      ? servicePoints.find((sp) => sp.id.toString() === selectedServicePoint)?.name
                      : customName || (customId ? `Service Point ${customId}` : "")}
                  </p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>No QR code generated yet</p>
                  <p className="text-sm">Select a service point and click Generate</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrint} disabled={!qrCodeData} className="flex-1 mr-2">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" onClick={handleDownload} disabled={!qrCodeData} className="flex-1 ml-2">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>How to use QR codes for feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                <li>Generate a QR code for each service point</li>
                <li>Print the QR codes and place them in visible locations at each service point</li>
                <li>Patients can scan the QR code with their smartphone camera</li>
                <li>The QR code will direct them to a feedback form specific to that service point</li>
                <li>View feedback results in the Service Point Reports section</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
