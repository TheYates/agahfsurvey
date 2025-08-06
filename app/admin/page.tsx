import { authServer } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";

export default async function AdminPage() {
  // Check authentication on the server
  const { data: { session } } = await authServer.getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  const { user, role } = await authServer.getUserWithRole();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Admin Dashboard
            </h1>
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Welcome back!
              </h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Role:</span> {role}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">User ID:</span> {user?.id}
                </p>
              </div>
            </div>
            
            <AdminDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
