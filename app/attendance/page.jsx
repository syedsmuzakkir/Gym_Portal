"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import BarcodeScanner from "@/components/attendance/barcode-scanner"
import AttendanceLogs from "@/components/attendance/attendance-logs"
import MemberCodes from "@/components/attendance/member-codes"
import {
  getAttendanceByDate,
  getAttendanceStats,
  getMemberCodes,
  markAttendance,
  toggleMemberCodeStatus,
  generateMemberCode,
} from "@/lib/attendance"
import { getEmployees } from "@/lib/employees"
import { getCustomers } from "@/lib/customers"
import { QrCode, Users, Scan, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([])
  const [memberCodes, setMemberCodes] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [stats, setStats] = useState({})
  const { toast } = useToast()

  useEffect(() => {
    setMemberCodes(getMemberCodes())
    loadAttendanceData()
  }, [])

  useEffect(() => {
    loadAttendanceData()
  }, [selectedDate])

  const loadAttendanceData = () => {
    const dayAttendance = getAttendanceByDate(selectedDate)
    const dayStats = getAttendanceStats(selectedDate)
    setAttendance(dayAttendance)
    setStats(dayStats)
  }

  const handleScan = async (scannedCode, scannedBy) => {
    try {
      const result = await markAttendance(scannedCode, scannedBy)
      loadAttendanceData() // Refresh data

      toast({
        title: "✅ Success",
        description: `${result.type === "checkin" ? "Check-in" : "Check-out"} recorded for ${result.memberName}`,
      })

      return result
    } catch (error) {
      toast({
        title: "❌ Error",
        description: error.message,
        variant: "destructive",
      })
      throw error
    }
  }

  const handleToggleMemberCodeStatus = (id) => {
    try {
      const updatedCode = toggleMemberCodeStatus(id)
      setMemberCodes(getMemberCodes())

      toast({
        title: "Success",
        description: `Member code ${updatedCode.isActive ? "enabled" : "disabled"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member code status",
        variant: "destructive",
      })
    }
  }

  const handleGenerateMemberCode = () => {
    // For demo purposes, generate a code for a random member
    const employees = getEmployees()
    const customers = getCustomers()
    const allMembers = [
      ...employees.map((e) => ({ ...e, type: "employee" })),
      ...customers.map((c) => ({ ...c, type: "customer" })),
    ]

    // Find members without codes
    const existingMemberIds = memberCodes.map((c) => c.memberId)
    const membersWithoutCodes = allMembers.filter((m) => !existingMemberIds.includes(m.employeeId || m.customerId))

    if (membersWithoutCodes.length > 0) {
      const randomMember = membersWithoutCodes[0]
      const memberId = randomMember.employeeId || randomMember.customerId

      try {
        generateMemberCode(memberId, randomMember.name, randomMember.type)
        setMemberCodes(getMemberCodes())

        toast({
          title: "Success",
          description: `Member code generated for ${randomMember.name}`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to generate member code",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Info",
        description: "All members already have codes generated",
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center sm:text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Quick Check-In
                </h1>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                  Scan your member code to check in/out instantly
                </p>
              </div>
              <div className="flex items-center justify-center sm:justify-end">
                <div className="bg-accent/10 rounded-full p-3">
                  <Scan className="w-8 h-8 text-accent" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-emerald-700">Today's Visits</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-800">{stats.present || 0}</p>
                  </div>
                  <div className="bg-emerald-200 rounded-full p-2">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-blue-700">Staff Present</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-800">{stats.employees?.present || 0}</p>
                  </div>
                  <div className="bg-blue-200 rounded-full p-2">
                    <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/20 border-accent/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-accent">Member Visits</p>
                    <p className="text-xl sm:text-2xl font-bold text-accent">{stats.customers?.present || 0}</p>
                  </div>
                  <div className="bg-accent/20 rounded-full p-2">
                    <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-primary">Active Codes</p>
                    <p className="text-xl sm:text-2xl font-bold text-primary">
                      {memberCodes.filter((c) => c.isActive).length}
                    </p>
                  </div>
                  <div className="bg-primary/20 rounded-full p-2">
                    <QrCode className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Scanner - Prominently Featured */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <BarcodeScanner onScan={handleScan} currentUser={{ name: "Gym System" }} />
          </motion.div>

          {/* Additional Features - Collapsible on Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <details className="group">
              <summary className="cursor-pointer list-none">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">View Attendance Logs & Member Codes</h3>
                      <div className="group-open:rotate-180 transition-transform duration-300">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </summary>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AttendanceLogs
                    attendance={attendance}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    stats={stats}
                  />
                  <MemberCodes
                    memberCodes={memberCodes}
                    onToggleStatus={handleToggleMemberCodeStatus}
                    onGenerateCode={handleGenerateMemberCode}
                  />
                </div>
              </div>
            </details>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
