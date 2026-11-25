import type React from "react";
import type { Metadata, Viewport } from "next";
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
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { UpdateToast } from "@/components/pwa/update-toast";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGA Health Foundation Survey",
  description: "Patient satisfaction survey for AGA Health Foundation",
  generator: "v0.dev",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
              <InstallPrompt />
              <UpdateToast />
              <ContextMenu>{children}</ContextMenu>
              <Analytics />
              <Toaster />
              <SessionTimeoutAlert />
            </OfflineProvider>
          </SupabaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
