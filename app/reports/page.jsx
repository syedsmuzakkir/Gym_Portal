import { Suspense } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import AnalyticsDashboard from "@/components/reports/analytics-dashboard"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          }
        >
          <AnalyticsDashboard />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
