"use client"

import { useState } from "react"
import { Suspense } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import GeneralSettings from "@/components/settings/general-settings"
import PaymentSettings from "@/components/settings/payment-settings"
import UserRoles from "@/components/settings/user-roles"
import { Button } from "@/components/ui/button"
import { Settings, CreditCard, Users, Bell, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "payments", name: "Payments", icon: CreditCard },
    { id: "roles", name: "User Roles", icon: Users },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "system", name: "System", icon: Database },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />
      case "payments":
        return <PaymentSettings />
      case "roles":
        return <UserRoles />
      case "notifications":
        return <NotificationSettings />
      case "security":
        return <SecuritySettings />
      case "system":
        return <SystemSettings />
      default:
        return <GeneralSettings />
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Manage your gym portal configuration and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg border p-2 space-y-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`w-full justify-start ${activeTab === tab.id ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon className="h-4 w-4 mr-3" />
                  {tab.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              }
            >
              {renderTabContent()}
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Placeholder components for other settings tabs
function NotificationSettings() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
      <p className="text-gray-600">Configure email, SMS, and push notification preferences.</p>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Notification settings panel coming soon...</p>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
      <p className="text-gray-600">Manage password policies, session timeouts, and security features.</p>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">Security settings panel coming soon...</p>
      </div>
    </div>
  )
}

function SystemSettings() {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      <p className="text-gray-600">Configure database, backup, and system maintenance settings.</p>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500">System settings panel coming soon...</p>
      </div>
    </div>
  )
}
