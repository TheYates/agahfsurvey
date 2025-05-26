import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextMenu from "@/components/context-menu";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGA Health Foundation Survey",
  description: "Patient satisfaction survey for AGA Health Foundation",
  generator: "v0.dev",
  icons: "agahflogo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ContextMenu>{children}</ContextMenu>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
