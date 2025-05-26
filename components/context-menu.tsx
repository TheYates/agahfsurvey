"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { RefreshCw, RotateCcw, LogIn, Home, BarChart3 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"

interface ContextMenuProps {
  children: React.ReactNode
}

export default function ContextMenu({ children }: ContextMenuProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  const isFirstPage = pathname === "/"

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setPosition({ x: e.clientX, y: e.clientY })
    setShowMenu(true)
  }

  const handleClick = () => {
    if (showMenu) {
      setShowMenu(false)
    }
  }

  const handleRefresh = () => {
    setShowMenu(false)
    window.location.reload()
  }

  const handleStartOver = () => {
    setShowMenu(false)
    router.push("/")
  }

  const handleLogin = () => {
    setShowMenu(false)
    setShowLoginModal(true)
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    router.push("/reports")
  }

  const navigateTo = (path: string) => {
    setShowMenu(false)

    // Check if the path requires authentication
    if ((path === "/reports" || path === "/settings") && !isAuthenticated) {
      setShowLoginModal(true)
    } else {
      router.push(path)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div onContextMenu={handleContextMenu} onClick={handleClick} className="relative">
      {children}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed bg-white shadow-lg rounded-md py-2 z-50 w-48 border border-gray-200"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
        >
          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={handleRefresh}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </div>
          <div
            className={`px-4 py-2 ${isFirstPage ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"} flex items-center gap-2`}
            onClick={!isFirstPage ? handleStartOver : undefined}
          >
            <RotateCcw size={16} />
            <span>Start Over</span>
          </div>
          {!isAuthenticated ? (
            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" onClick={handleLogin}>
              <LogIn size={16} />
              <span>Login</span>
            </div>
          ) : (
            <>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => navigateTo("/reports")}
              >
                <BarChart3 size={16} />
                <span>Reports</span>
              </div>
              <div
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => navigateTo("/settings")}
              >
                <Home size={16} />
                <span>Settings</span>
              </div>
            </>
          )}
        </div>
      )}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onSuccess={handleLoginSuccess} />
    </div>
  )
}
