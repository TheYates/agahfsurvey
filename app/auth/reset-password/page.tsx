import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set New Password
          </h1>
          <p className="text-gray-600">
            Enter your new password below
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
