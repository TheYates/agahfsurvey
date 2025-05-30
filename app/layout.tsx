import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ContextMenu from "@/components/context-menu";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AGA Health Foundation Survey",
  description: "Patient satisfaction survey for AGA Health Foundation",
  generator: "v0.dev",
  icons: {
    icon: "/agahflogo svg.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ContextMenu>
              <div className="flex flex-col min-h-screen">
                <div className="fixed top-4 right-4 z-50">
                  <ThemeToggle />
                </div>
                <main className="flex-1">{children}</main>
              </div>
            </ContextMenu>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
