// Team communication data and utilities
export const generateTeamMessages = () => {
  const channels = [
    { id: "general", name: "General", description: "General gym discussions" },
    { id: "trainers", name: "Personal Trainers", description: "Trainer coordination" },
    { id: "maintenance", name: "Maintenance", description: "Equipment and facility issues" },
    { id: "events", name: "Events", description: "Gym events and classes" },
    { id: "announcements", name: "Announcements", description: "Important updates" },
  ]

  const messages = [
    {
      id: 1,
      channel: "general",
      author: "Sarah Johnson",
      role: "Manager",
      avatar: "/woman-manager.png",
      content: "Good morning team! Remember we have the new member orientation at 10 AM today.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      edited: false,
      reactions: [
        { emoji: "👍", count: 3 },
        { emoji: "✅", count: 2 },
      ],
    },
    {
      id: 2,
      channel: "trainers",
      author: "Mike Chen",
      role: "Personal Trainer",
      avatar: "/man-trainer.png",
      content: "Client John Smith requested to reschedule his 3 PM session to 4 PM. Can someone cover the 3 PM slot?",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      edited: false,
      reactions: [{ emoji: "🤝", count: 1 }],
    },
    {
      id: 3,
      channel: "maintenance",
      author: "Alex Rodriguez",
      role: "Maintenance",
      avatar: "/man-maintenance.png",
      content:
        'Treadmill #3 is making unusual noises. I\'ve put an "Out of Order" sign on it. Will check it after lunch.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      edited: true,
      reactions: [
        { emoji: "🔧", count: 2 },
        { emoji: "👍", count: 1 },
      ],
    },
    {
      id: 4,
      channel: "events",
      author: "Lisa Park",
      role: "Fitness Instructor",
      avatar: "/woman-instructor.png",
      content: "Yoga class tomorrow is fully booked! We might need to consider adding an extra session.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      edited: false,
      reactions: [
        { emoji: "🧘", count: 4 },
        { emoji: "🎉", count: 2 },
      ],
    },
    {
      id: 5,
      channel: "announcements",
      author: "Sarah Johnson",
      role: "Manager",
      avatar: "/woman-manager.png",
      content: "New safety protocols are now in effect. Please review the updated guidelines in the staff handbook.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      edited: false,
      reactions: [
        { emoji: "📋", count: 5 },
        { emoji: "✅", count: 3 },
      ],
      pinned: true,
    },
  ]

  return { channels, messages }
}

export const formatMessageTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return timestamp.toLocaleDateString()
}

export const getOnlineUsers = () => [
  { id: 1, name: "Sarah Johnson", role: "Manager", status: "online" },
  { id: 2, name: "Mike Chen", role: "Personal Trainer", status: "online" },
  { id: 3, name: "Lisa Park", role: "Fitness Instructor", status: "away" },
  { id: 4, name: "Alex Rodriguez", role: "Maintenance", status: "offline" },
  { id: 5, name: "Emma Wilson", role: "Receptionist", status: "online" },
]
