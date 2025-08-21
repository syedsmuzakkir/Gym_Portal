"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Bell } from "lucide-react"
import { generateMeetings } from "@/lib/meetings"

export default function MeetingForm({ meeting, onSave, onCancel }) {
  const { meetingTypes } = generateMeetings()
  const [formData, setFormData] = useState({
    title: meeting?.title || "",
    type: meeting?.type || "staff",
    date: meeting?.date ? meeting.date.toISOString().slice(0, 16) : "",
    duration: meeting?.duration || 60,
    location: meeting?.location || "",
    organizer: meeting?.organizer || "You",
    attendees: meeting?.attendees || [],
    agenda: meeting?.agenda || "",
    reminders: meeting?.reminders || [15],
  })

  const [newAttendee, setNewAttendee] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const meetingData = {
      ...formData,
      id: meeting?.id || Date.now(),
      date: new Date(formData.date),
      status: "scheduled",
    }
    onSave(meetingData)
  }

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData((prev) => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()],
      }))
      setNewAttendee("")
    }
  }

  const removeAttendee = (attendee) => {
    setFormData((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((a) => a !== attendee),
    }))
  }

  const toggleReminder = (minutes) => {
    setFormData((prev) => ({
      ...prev,
      reminders: prev.reminders.includes(minutes)
        ? prev.reminders.filter((r) => r !== minutes)
        : [...prev.reminders, minutes],
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>{meeting ? "Edit Meeting" : "Create New Meeting"}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter meeting title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Meeting Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {meetingTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          {type.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select
                  value={formData.duration.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="180">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Meeting location"
                required
              />
            </div>

            {/* Attendees */}
            <div className="space-y-2">
              <Label>Attendees</Label>
              <div className="flex gap-2">
                <Input
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  placeholder="Add attendee name"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAttendee())}
                />
                <Button type="button" onClick={addAttendee} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.attendees.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.attendees.map((attendee) => (
                    <Badge key={attendee} variant="secondary" className="flex items-center gap-1">
                      {attendee}
                      <button
                        type="button"
                        onClick={() => removeAttendee(attendee)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Agenda */}
            <div className="space-y-2">
              <Label htmlFor="agenda">Agenda</Label>
              <Textarea
                id="agenda"
                value={formData.agenda}
                onChange={(e) => setFormData((prev) => ({ ...prev, agenda: e.target.value }))}
                placeholder="Meeting agenda and topics"
                rows={3}
              />
            </div>

            {/* Reminders */}
            <div className="space-y-2">
              <Label>Reminders</Label>
              <div className="flex flex-wrap gap-2">
                {[5, 15, 30, 60, 1440].map((minutes) => (
                  <Button
                    key={minutes}
                    type="button"
                    variant={formData.reminders.includes(minutes) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleReminder(minutes)}
                    className="flex items-center gap-1"
                  >
                    <Bell className="h-3 w-3" />
                    {minutes < 60 ? `${minutes}m` : minutes === 60 ? "1h" : "1d"} before
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                {meeting ? "Update Meeting" : "Create Meeting"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
