"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  QrCode,
  CreditCard,
  BarChart3,
  MessageSquare,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  X,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    name: "Customers",
    href: "/customers",
    icon: UserCheck,
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: QrCode,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Team Chat",
    href: "/team",
    icon: MessageSquare,
  },
  {
    name: "Meetings",
    href: "/meetings",
    icon: Calendar,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export default function Sidebar({ collapsed, onToggle, isMobile, isOpen, onClose }) {
  const pathname = usePathname()

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 lg:hidden"
            >
              {/* Mobile Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800">FitGym Pro</h2>
                    <p className="text-xs text-slate-600">Gym Management</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Navigation */}
              <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.name} href={item.href} onClick={onClose}>
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 shadow-sm"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                          )}
                        >
                          <item.icon
                            className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-indigo-600" : "text-slate-500")}
                          />
                          <span>{item.name}</span>
                        </motion.div>
                      </Link>
                    )
                  })}
                </nav>
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-slate-200 flex flex-col h-full shadow-sm hidden lg:flex"
    >
      {/* Desktop Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <motion.div
            initial={false}
            animate={{ opacity: collapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-slate-800">FitGym Pro</h2>
                <p className="text-xs text-slate-600">Gym Management</p>
              </div>
            )}
          </motion.div>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 shadow-sm"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-indigo-600" : "text-slate-500")} />
                  <motion.span
                    initial={false}
                    animate={{ opacity: collapsed ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={collapsed ? "sr-only" : ""}
                  >
                    {item.name}
                  </motion.span>
                </motion.div>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </motion.div>
  )
}
