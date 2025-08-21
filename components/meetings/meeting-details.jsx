"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Edit, Trash2, Clock, MapPin, Users, Calendar, Bell, CheckCircle, AlertCircle } from "lucide-react"
import { generateMeetings, formatMeetingTime } from "@/lib/meetings"

export default function MeetingDetails({ meeting, onEdit, onDelete, onClose }) {
  const { meetingTypes } = generateMeetings()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const meetingType = meetingTypes.find((type) => type.id === meeting.type)
  const isUpcoming = meeting.date > new Date()

  const handleDelete = () => {
    onDelete(meeting.id)
    onClose()
  }

  const getReminderText = (minutes) => {
    if (minutes < 60) return `${minutes} minutes before`
    if (minutes === 60) return "1 hour before"
    if (minutes === 1440) return "1 day before"
    return `${Math.floor(minutes / 60)} hours before`
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl">{meeting.title}</CardTitle>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: meetingType?.color,
                    color: meetingType?.color,
                  }}
                >
                  {meetingType?.name}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {meeting.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatMeetingTime(meeting.date, meeting.duration)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isUpcoming && (
                <Button variant="outline" size="sm" onClick={() => onEdit(meeting)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Meeting Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{meeting.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{meeting.attendees.length} attendees</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{meeting.duration} minutes</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Organizer</h4>
                <p className="text-gray-600">{meeting.organizer}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                <div className="flex items-center gap-2">
                  {isUpcoming ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-600">Scheduled</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <span className="text-gray-600">Past</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Attendees</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meeting.attendees.map((attendee, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`/diverse-user-avatars.png?height=32&width=32&query=${attendee.replace(" ", "+")}`}
                    />
                    <AvatarFallback>
                      {attendee
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-700">{attendee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agenda */}
          {meeting.agenda && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Agenda</h4>
              <p className="text-gray-600 leading-relaxed">{meeting.agenda}</p>
            </div>
          )}

          {/* Reminders */}
          {meeting.reminders.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Reminders</h4>
              <div className="flex flex-wrap gap-2">
                {meeting.reminders.map((minutes, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {getReminderText(minutes)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h4 className="font-medium text-red-900">Delete Meeting</h4>
              </div>
              <p className="text-red-700 mb-4">
                Are you sure you want to delete this meeting? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Delete Meeting
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
