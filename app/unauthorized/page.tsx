import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldX, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <ShieldX className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              This page requires specific permissions that your account doesn't have. 
              Please contact your administrator if you believe this is an error.
            </p>
            
            <div className="flex flex-col space-y-2">
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Home
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/auth/login">
                  Sign in with different account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
