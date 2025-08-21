"use client"

import { useState } from "react"
import { Suspense } from "react"
import { AnimatePresence } from "framer-motion"
import DashboardLayout from "@/components/layout/dashboard-layout"
import CalendarView from "@/components/meetings/calendar-view"
import MeetingForm from "@/components/meetings/meeting-form"
import MeetingDetails from "@/components/meetings/meeting-details"

export default function MeetingsPage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [editingMeeting, setEditingMeeting] = useState(null)

  const handleCreateMeeting = () => {
    setEditingMeeting(null)
    setShowForm(true)
  }

  const handleEditMeeting = (meeting) => {
    setSelectedMeeting(null)
    setEditingMeeting(meeting)
    setShowForm(true)
  }

  const handleSaveMeeting = (meetingData) => {
    // In a real app, this would save to backend
    console.log("[v0] Saving meeting:", meetingData)
    setShowForm(false)
    setEditingMeeting(null)
  }

  const handleDeleteMeeting = (meetingId) => {
    // In a real app, this would delete from backend
    console.log("[v0] Deleting meeting:", meetingId)
    setSelectedMeeting(null)
  }

  const handleSelectMeeting = (meeting) => {
    setSelectedMeeting(meeting)
  }

  return (
    <DashboardLayout>
      <div className="p-6 h-full">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          }
        >
          <CalendarView onCreateMeeting={handleCreateMeeting} onSelectMeeting={handleSelectMeeting} />
        </Suspense>

        <AnimatePresence>
          {showForm && (
            <MeetingForm
              meeting={editingMeeting}
              onSave={handleSaveMeeting}
              onCancel={() => {
                setShowForm(false)
                setEditingMeeting(null)
              }}
            />
          )}

          {selectedMeeting && (
            <MeetingDetails
              meeting={selectedMeeting}
              onEdit={handleEditMeeting}
              onDelete={handleDeleteMeeting}
              onClose={() => setSelectedMeeting(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
