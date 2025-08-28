"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/layout/dashboard-layout"
import {
  Users,
  UserCheck,
  QrCode,
  CreditCard,
  BarChart3,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react"

// Dummy data for dashboard
const stats = [
  {
    title: "Total Employees",
    value: "248",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Customers",
    value: "1,429",
    change: "+8%",
    trend: "up",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Today's Attendance",
    value: "92%",
    change: "-2%",
    trend: "down",
    icon: QrCode,
    color: "text-purple-600",
  },
  {
    title: "Monthly Revenue",
    value: "$45,231",
    change: "+15%",
    trend: "up",
    icon: CreditCard,
    color: "text-emerald-600",
  },
]

const quickActions = [
  {
    title: "Add Employee",
    description: "Register new staff member",
    icon: Users,
    href: "/employees",
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
  {
    title: "New Customer",
    description: "Add customer record",
    icon: UserCheck,
    href: "/customers",
    color: "bg-green-50 text-green-600 hover:bg-green-100",
  },
  // {
  //   title: "Mark Attendance",
  //   description: "Scan member codes",
  //   icon: QrCode,
  //   href: "/attendance",
  //   color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  // },
  {
    title: "Process Payment",
    description: "Handle transactions",
    icon: CreditCard,
    href: "/payments",
    color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
  },
]

const recentActivities = [
  {
    id: 1,
    type: "employee",
    message: "John Doe marked attendance",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    type: "payment",
    message: "Payment of $150 received from Sarah Wilson",
    time: "15 minutes ago",
    status: "success",
  },
  {
    id: 3,
    type: "customer",
    message: "New customer registration: Mike Johnson",
    time: "1 hour ago",
    status: "info",
  },
  {
    id: 4,
    type: "meeting",
    message: "Team meeting scheduled for 3:00 PM",
    time: "2 hours ago",
    status: "warning",
  },
]

const upcomingTasks = [
  {
    id: 1,
    title: "Monthly Report Generation",
    due: "Today, 5:00 PM",
    priority: "high",
  },
  {
    id: 2,
    title: "Employee Performance Review",
    due: "Tomorrow, 10:00 AM",
    priority: "medium",
  },
  {
    id: 3,
    title: "System Backup",
    due: "Friday, 6:00 PM",
    priority: "low",
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back to the Government Portal</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Clock className="w-3 h-3 mr-1" />
                Last updated: {new Date().toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.title}
                    variant="outline"
                    className={`h-auto p-4 flex flex-col items-center space-y-2 ${action.color}`}
                    asChild
                  >
                    <a href={action.href}>
                      <action.icon className="w-8 h-8" />
                      <div className="text-center">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs opacity-70">{action.description}</p>
                      </div>
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {activity.status === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {activity.status === "info" && <AlertCircle className="w-5 h-5 text-blue-600" />}
                        {activity.status === "warning" && <Clock className="w-5 h-5 text-yellow-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Scheduled activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.due}</p>
                      </div>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
