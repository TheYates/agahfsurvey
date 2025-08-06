"use client";

import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminNav } from "@/components/admin-nav";
import { BarChart3, Users, Building, QrCode, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminDashboard() {
  const { signOut, user } = useSupabaseAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const stats = [
    {
      title: "Total Surveys",
      value: "1,234",
      description: "Submitted this month",
      icon: BarChart3,
    },
    {
      title: "Active Users",
      value: "56",
      description: "Registered users",
      icon: Users,
    },
    {
      title: "Service Points",
      value: "12",
      description: "Active locations",
      icon: Building,
    },
    {
      title: "QR Codes",
      value: "24",
      description: "Generated codes",
      icon: QrCode,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600">Manage your hospital survey system</p>
        </div>
        <Button onClick={handleSignOut} variant="outline">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow p-4">
        <AdminNav />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Survey Reports</CardTitle>
            <CardDescription>
              View and analyze survey responses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/reports")} className="w-full">
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Points</CardTitle>
            <CardDescription>
              Manage survey locations and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/service-points")} className="w-full">
              Manage Service Points
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Codes</CardTitle>
            <CardDescription>
              Generate and manage QR codes for surveys
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/admin/qr-codes")} className="w-full">
              Manage QR Codes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>
            Current user session details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Role:</span> {user?.user_metadata?.role || 'user'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Last Sign In:</span> {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
