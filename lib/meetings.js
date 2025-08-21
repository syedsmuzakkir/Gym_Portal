// Meetings and calendar data
export const generateMeetings = () => {
  const meetingTypes = [
    { id: "staff", name: "Staff Meeting", color: "#8b5cf6" },
    { id: "training", name: "Training Session", color: "#06b6d4" },
    { id: "consultation", name: "Member Consultation", color: "#10b981" },
    { id: "maintenance", name: "Maintenance Review", color: "#f59e0b" },
    { id: "event", name: "Gym Event", color: "#ef4444" },
  ]

  const meetings = [
    {
      id: 1,
      title: "Weekly Staff Meeting",
      type: "staff",
      date: new Date(2024, 11, 25, 9, 0),
      duration: 60,
      location: "Conference Room",
      organizer: "Sarah Johnson",
      attendees: ["Mike Chen", "Lisa Park", "Alex Rodriguez", "Emma Wilson"],
      agenda: "Review weekly performance, discuss new member onboarding, equipment updates",
      status: "scheduled",
      reminders: [15, 60], // minutes before
    },
    {
      id: 2,
      title: "Personal Training Certification",
      type: "training",
      date: new Date(2024, 11, 26, 14, 0),
      duration: 120,
      location: "Training Area",
      organizer: "Mike Chen",
      attendees: ["New Trainee"],
      agenda: "CPR certification renewal, new equipment training",
      status: "scheduled",
      reminders: [30],
    },
    {
      id: 3,
      title: "Member Fitness Assessment",
      type: "consultation",
      date: new Date(2024, 11, 27, 10, 30),
      duration: 45,
      location: "Assessment Room",
      organizer: "Lisa Park",
      attendees: ["John Smith"],
      agenda: "Initial fitness assessment, goal setting, program design",
      status: "scheduled",
      reminders: [15],
    },
    {
      id: 4,
      title: "Equipment Maintenance Review",
      type: "maintenance",
      date: new Date(2024, 11, 28, 8, 0),
      duration: 90,
      location: "Equipment Floor",
      organizer: "Alex Rodriguez",
      attendees: ["Maintenance Team"],
      agenda: "Monthly equipment inspection, repair scheduling, safety checks",
      status: "scheduled",
      reminders: [30, 120],
    },
    {
      id: 5,
      title: "New Year Fitness Challenge Launch",
      type: "event",
      date: new Date(2025, 0, 1, 18, 0),
      duration: 180,
      location: "Main Gym Floor",
      organizer: "Sarah Johnson",
      attendees: ["All Staff", "Members"],
      agenda: "Challenge announcement, team formation, prize presentation",
      status: "scheduled",
      reminders: [60, 1440], // 1 hour and 1 day before
    },
  ]

  return { meetingTypes, meetings }
}

export const getUpcomingMeetings = (limit = 5) => {
  const { meetings } = generateMeetings()
  const now = new Date()

  return meetings
    .filter((meeting) => meeting.date > now)
    .sort((a, b) => a.date - b.date)
    .slice(0, limit)
}

export const getMeetingsByDate = (date) => {
  const { meetings } = generateMeetings()
  const targetDate = new Date(date)

  return meetings.filter((meeting) => {
    const meetingDate = new Date(meeting.date)
    return (
      meetingDate.getDate() === targetDate.getDate() &&
      meetingDate.getMonth() === targetDate.getMonth() &&
      meetingDate.getFullYear() === targetDate.getFullYear()
    )
  })
}

export const formatMeetingTime = (date, duration) => {
  const start = new Date(date)
  const end = new Date(date.getTime() + duration * 60000)

  const formatTime = (time) => {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return `${formatTime(start)} - ${formatTime(end)}`
}

export const generateCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const current = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}
