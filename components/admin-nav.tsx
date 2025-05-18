"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Settings, Users, Building, QrCode, Home } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/reports",
      label: "Reports",
      icon: BarChart3,
      active: pathname === "/reports" || pathname.startsWith("/reports/"),
    },
    {
      href: "/admin/service-points",
      label: "Service Points",
      icon: Building,
      active: pathname === "/admin/service-points",
    },
    {
      href: "/admin/qr-codes",
      label: "QR Codes",
      icon: QrCode,
      active: pathname === "/admin/qr-codes",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      active: pathname === "/admin/users",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 overflow-auto pb-2">
      {routes.map((route) => (
        <Button
          key={route.href}
          asChild
          variant={route.active ? "default" : "ghost"}
          size="sm"
          className="justify-start"
        >
          <Link href={route.href}>
            <route.icon className="h-4 w-4 mr-2" />
            {route.label}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
