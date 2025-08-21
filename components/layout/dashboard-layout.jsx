"use client"

import { useState, useEffect } from "react"
import Sidebar from "./sidebar"
import Header from "./header"
import AuthGuard from "@/components/auth-guard"

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <AuthGuard>
      <div className="h-screen flex bg-background">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobile}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} isMobileMenuOpen={mobileMenuOpen} />
          <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 bg-background">{children}</main>
        </div>
      </div>
    </AuthGuard>
  )
}
