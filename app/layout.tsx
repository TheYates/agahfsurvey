import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextMenu from "@/components/context-menu";
import { SupabaseAuthProvider } from "@/contexts/supabase-auth-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SessionTimeoutAlert } from "@/components/ui/session-timeout-alert";
import { OfflineProvider } from "@/lib/offline/offline-context";
import { OfflineBanner } from "@/components/offline-banner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGA Health Foundation Survey",
  description: "Patient satisfaction survey for AGA Health Foundation",
  generator: "v0.dev",
  icons: "agahflogo white.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/agahflogo white.svg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseAuthProvider>
            <OfflineProvider>
              <ServiceWorkerRegistration />
              <OfflineBanner />
              <ContextMenu>{children}</ContextMenu>
              <Toaster />
              <SessionTimeoutAlert />
            </OfflineProvider>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
