"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { Users, DollarSign, Activity, Target, Award } from "lucide-react"
import { generateMonthlyReports, getKPIMetrics, getRevenueBreakdown } from "@/lib/reports"

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("12months")
  const [selectedMetric, setSelectedMetric] = useState("members")

  const reports = generateMonthlyReports()
  const kpis = getKPIMetrics()
  const revenueBreakdown = getRevenueBreakdown()

  const kpiCards = [
    {
      title: "Total Members",
      value: kpis.totalMembers,
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: `$${kpis.monthlyRevenue.toLocaleString()}`,
      change: "+8.2%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Avg Attendance",
      value: `${kpis.averageAttendance}%`,
      change: "+5.1%",
      icon: Activity,
      color: "text-purple-600",
    },
    {
      title: "Member Retention",
      value: `${kpis.memberRetention}%`,
      change: "+2.3%",
      icon: Target,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gym Analytics</h2>
          <p className="text-gray-600">Track performance and member insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-sm text-green-600 font-medium">{kpi.change}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-100 ${kpi.color}`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Membership Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Growth</CardTitle>
            <CardDescription>New members and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={reports.membershipTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="newMembers"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="activeMembers"
                  stackId="2"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Income distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {revenueBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Attendance Pattern</CardTitle>
            <CardDescription>Peak hours and member flow</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.attendancePatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="members" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Equipment Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Utilization</CardTitle>
            <CardDescription>Most popular gym equipment</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reports.equipmentUsage} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="equipment" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="usage" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Performance</CardTitle>
          <CardDescription>Member distribution across subscription plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {reports.subscriptionAnalytics.map((plan, index) => (
              <div key={plan.plan} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                  <h4 className="font-medium">{plan.plan}</h4>
                </div>
                <p className="text-2xl font-bold">{plan.members}</p>
                <p className="text-sm text-gray-600">${plan.revenue.toLocaleString()} revenue</p>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.subscriptionAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="members" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Class Popularity */}
      <Card>
        <CardHeader>
          <CardTitle>Class Popularity</CardTitle>
          <CardDescription>Most attended fitness classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.classPopularity.map((classItem, index) => (
              <div key={classItem.class} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{classItem.class}</h4>
                    <p className="text-sm text-gray-600">{classItem.sessions} sessions/week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{classItem.participants}</p>
                  <p className="text-sm text-gray-600">avg participants</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
