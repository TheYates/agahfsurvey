import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextMenu from "@/components/context-menu";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SessionTimeoutAlert } from "@/components/ui/session-timeout-alert";
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
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ContextMenu>{children}</ContextMenu>
            <Toaster />
            <SessionTimeoutAlert />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
