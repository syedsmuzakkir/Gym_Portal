"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, MapPin, Users } from "lucide-react"
import { generateCalendarDays, generateMeetings, getMeetingsByDate, formatMeetingTime } from "@/lib/meetings"

export default function CalendarView({ onCreateMeeting, onSelectMeeting }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const { meetingTypes, meetings } = generateMeetings()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const calendarDays = generateCalendarDays(year, month)
  const selectedDateMeetings = getMeetingsByDate(selectedDate)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(month + direction)
    setCurrentDate(newDate)
  }

  const getMeetingsForDate = (date) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date)
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getMeetingTypeColor = (typeId) => {
    return meetingTypes.find((type) => type.id === typeId)?.color || "#6b7280"
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === month
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Calendar Grid */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {monthNames[month]} {year}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button onClick={onCreateMeeting} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Meeting
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => {
                const dayMeetings = getMeetingsForDate(date)
                const isSelected = selectedDate.toDateString() === date.toDateString()

                return (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      p-2 min-h-[80px] border rounded-lg text-left transition-all hover:bg-gray-50
                      ${isSelected ? "bg-purple-50 border-purple-200" : "border-gray-200"}
                      ${!isCurrentMonth(date) ? "text-gray-400 bg-gray-50" : ""}
                      ${isToday(date) ? "bg-blue-50 border-blue-200" : ""}
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday(date) ? "text-blue-600" : ""}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayMeetings.slice(0, 2).map((meeting) => (
                        <div
                          key={meeting.id}
                          className="text-xs p-1 rounded truncate"
                          style={{
                            backgroundColor: getMeetingTypeColor(meeting.type) + "20",
                            color: getMeetingTypeColor(meeting.type),
                          }}
                        >
                          {meeting.title}
                        </div>
                      ))}
                      {dayMeetings.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayMeetings.length - 2} more</div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Details */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateMeetings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No meetings scheduled</p>
                <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={onCreateMeeting}>
                  Schedule Meeting
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateMeetings.map((meeting) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onSelectMeeting(meeting)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: getMeetingTypeColor(meeting.type),
                          color: getMeetingTypeColor(meeting.type),
                        }}
                      >
                        {meetingTypes.find((t) => t.id === meeting.type)?.name}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {formatMeetingTime(meeting.date, meeting.duration)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {meeting.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {meeting.attendees.length} attendees
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Meeting Types Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Meeting Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {meetingTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-sm text-gray-700">{type.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
