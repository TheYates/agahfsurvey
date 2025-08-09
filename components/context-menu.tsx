"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  RefreshCw,
  RotateCcw,
  LogIn,
  Home,
  BarChart3,
  Copy,
  Clipboard,
  Scissors,
  MousePointer,
  LogOut,
  Settings,
} from "lucide-react";
import { useSupabaseAuth } from "@/contexts/supabase-auth-context";
import { LoginModal } from "@/components/login-modal";

interface ContextMenuProps {
  children: React.ReactNode;
}

export default function ContextMenu({ children }: ContextMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [canCopyPaste, setCanCopyPaste] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, signOut } = useSupabaseAuth();

  const isFirstPage = pathname === "/";

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    // Calculate position to ensure menu stays within viewport
    const menuWidth = 192; // w-48 = 12rem = 192px
    const menuHeight = 400; // Approximate height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = e.clientX;
    let y = e.clientY;

    // Adjust if menu would go off-screen
    if (x + menuWidth > viewportWidth) {
      x = viewportWidth - menuWidth - 10;
    }
    if (y + menuHeight > viewportHeight) {
      y = viewportHeight - menuHeight - 10;
    }

    setPosition({ x, y });

    // Check if text is selected
    const selection = window.getSelection();
    const hasSelection = !!selection && selection.toString().length > 0;
    setSelectedText(selection ? selection.toString() : "");
    setCanCopyPaste(hasSelection);

    setShowMenu(true);
  };

  const handleClick = () => {
    if (showMenu) {
      setShowMenu(false);
    }
  };

  const handleRefresh = () => {
    setShowMenu(false);
    window.location.reload();
  };

  const handleStartOver = () => {
    setShowMenu(false);
    router.push("/");
  };

  const handleLogin = () => {
    setShowMenu(false);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    router.push("/reports");
  };

  const navigateTo = (path: string) => {
    setShowMenu(false);

    // Check if the path requires authentication
    if ((path === "/reports" || path === "/settings") && !isAuthenticated) {
      setShowLoginModal(true);
    } else {
      router.push(path);
    }
  };

  const handleCopy = () => {
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          setShowMenu(false);
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
        });
    }
  };

  const handlePaste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        // Insert at cursor position if possible
        const activeElement = document.activeElement as
          | HTMLInputElement
          | HTMLTextAreaElement;
        if (
          activeElement &&
          (activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA")
        ) {
          const start = activeElement.selectionStart || 0;
          const end = activeElement.selectionEnd || 0;
          const value = activeElement.value;
          activeElement.value =
            value.substring(0, start) + text + value.substring(end);
          // Set cursor position after pasted text
          activeElement.selectionStart = activeElement.selectionEnd =
            start + text.length;
        }
        setShowMenu(false);
      })
      .catch((err) => {
        console.error("Could not paste text: ", err);
      });
  };

  const handleCut = () => {
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          // Remove selected text if in editable element
          const activeElement = document.activeElement as
            | HTMLInputElement
            | HTMLTextAreaElement;
          if (
            activeElement &&
            (activeElement.tagName === "INPUT" ||
              activeElement.tagName === "TEXTAREA")
          ) {
            const start = activeElement.selectionStart || 0;
            const end = activeElement.selectionEnd || 0;
            const value = activeElement.value;
            activeElement.value =
              value.substring(0, start) + value.substring(end);
            // Set cursor position to start of cut
            activeElement.selectionStart = activeElement.selectionEnd = start;
          }
          setShowMenu(false);
        })
        .catch((err) => {
          console.error("Could not cut text: ", err);
        });
    }
  };

  const handleSelectAll = () => {
    const activeElement = document.activeElement as
      | HTMLInputElement
      | HTMLTextAreaElement;
    if (
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA")
    ) {
      activeElement.select();
    } else {
      document.execCommand("selectAll");
    }
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      className="relative"
    >
      {children}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed bg-background shadow-lg rounded-md py-2 z-50 w-48 border border-border text-sm"
          style={{
            top: `${position.y}px`,
            left: `${position.x}px`,
          }}
        >
          {/* Edit operations */}
          <div
            className={`px-4 py-2.5 ${
              canCopyPaste
                ? "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                : "text-muted-foreground cursor-not-allowed"
            } flex items-center gap-3`}
            onClick={canCopyPaste ? handleCopy : undefined}
          >
            <Copy size={14} />
            <span>Copy</span>
          </div>
          <div
            className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-3"
            onClick={handlePaste}
          >
            <Clipboard size={14} />
            <span>Paste</span>
          </div>
          <div
            className={`px-4 py-2.5 ${
              canCopyPaste
                ? "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                : "text-muted-foreground cursor-not-allowed"
            } flex items-center gap-3`}
            onClick={canCopyPaste ? handleCut : undefined}
          >
            <Scissors size={14} />
            <span>Cut</span>
          </div>
          <div
            className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-3"
            onClick={handleSelectAll}
          >
            <MousePointer size={14} />
            <span>Select All</span>
          </div>

          <div className="border-t my-1"></div>

          {/* Navigation */}
          <div
            className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-3"
            onClick={() => navigateTo("/")}
          >
            <Home size={14} />
            <span>Home</span>
          </div>

          <div
            className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-3"
            onClick={handleRefresh}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </div>
          {/* Show Login for unauthenticated users, Reports for authenticated users */}
          {!isAuthenticated ? (
            <div
              className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-3"
              onClick={handleLogin}
            >
              <LogIn size={14} />
              <span>Login</span>
            </div>
          ) : (
            <div
              className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-3"
              onClick={() => navigateTo("/reports")}
            >
              <BarChart3 size={14} />
              <span>Reports</span>
            </div>
          )}

          {/* Settings only shown for authenticated users */}
          {isAuthenticated && (
            <div
              className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-3"
              onClick={() => navigateTo("/settings")}
            >
              <Settings size={14} />
              <span>Settings</span>
            </div>
          )}

          {/* Logout option for authenticated users */}
          {isAuthenticated && (
            <>
              <div className="border-t my-1"></div>
              <div
                className="px-4 py-2.5 hover:bg-accent hover:text-accent-foreground cursor-pointer flex items-center gap-3 text-destructive"
                onClick={async () => {
                  setShowMenu(false);
                  await signOut();
                  router.push("/");
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </div>
            </>
          )}
        </div>
      )}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
