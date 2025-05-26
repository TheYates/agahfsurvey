"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Save, Bell, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  // If not authenticated, don't render the page content
  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image src="/logo.svg" alt="AGA Health Foundation Logo" width={50} height={50} />
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Settings</h1>
            </div>
            <p className="text-muted-foreground">Manage your survey system settings</p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Home size={16} />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="general" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your survey system preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospital-name">Hospital Name</Label>
                    <Input id="hospital-name" defaultValue="AGA Health Foundation" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Administrator Email</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@agahealth.org" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="survey-title">Default Survey Title</Label>
                    <Input id="survey-title" defaultValue="Patient Satisfaction Survey" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Enable dark mode for the survey interface</p>
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
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for new survey submissions
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-summary">Weekly Summary</Label>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of survey responses</p>
                    </div>
                    <Switch id="weekly-summary" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="negative-feedback">Negative Feedback Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get immediate alerts for negative feedback (Poor/Fair ratings)
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
                <CardDescription>Manage your security preferences</CardDescription>
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
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
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

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your survey data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-retention">Data Retention Period</Label>
                      <p className="text-sm text-muted-foreground">
                        How long to keep survey responses before automatic deletion
                      </p>
                    </div>
                    <select
                      id="data-retention"
                      className="flex h-10 w-40 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="1-year">1 Year</option>
                      <option value="2-years">2 Years</option>
                      <option value="5-years" selected>
                        5 Years
                      </option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anonymize">Anonymize Responses</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove personally identifiable information from responses
                      </p>
                    </div>
                    <Switch id="anonymize" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="backup">Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">Create automatic backups of survey data weekly</p>
                    </div>
                    <Switch id="backup" defaultChecked />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Database size={16} />
                    Save Data Settings
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    Export All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
