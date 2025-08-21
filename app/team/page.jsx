import { Suspense } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import MessageBoard from "@/components/team/message-board"
import OnlineUsers from "@/components/team/online-users"

export default function TeamPage() {
  return (
    <DashboardLayout>
      <div className="h-full flex gap-6 p-6">
        <div className="flex-1">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            }
          >
            <MessageBoard />
          </Suspense>
        </div>
        <div className="w-80">
          <OnlineUsers />
        </div>
      </div>
    </DashboardLayout>
  )
}
