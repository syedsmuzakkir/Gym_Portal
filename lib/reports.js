// Gym analytics and reporting data
export const generateMonthlyReports = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  return {
    membershipTrends: months.map((month, index) => ({
      month,
      newMembers: Math.floor(Math.random() * 50) + 20,
      activeMembers: Math.floor(Math.random() * 200) + 300,
      cancelledMembers: Math.floor(Math.random() * 15) + 5,
      revenue: Math.floor(Math.random() * 50000) + 80000,
    })),

    attendancePatterns: [
      { time: "6:00 AM", members: 45, day: "Monday" },
      { time: "7:00 AM", members: 78, day: "Monday" },
      { time: "8:00 AM", members: 92, day: "Monday" },
      { time: "9:00 AM", members: 65, day: "Monday" },
      { time: "10:00 AM", members: 34, day: "Monday" },
      { time: "5:00 PM", members: 120, day: "Monday" },
      { time: "6:00 PM", members: 145, day: "Monday" },
      { time: "7:00 PM", members: 98, day: "Monday" },
      { time: "8:00 PM", members: 67, day: "Monday" },
    ],

    subscriptionAnalytics: [
      { plan: "Basic Monthly", members: 156, revenue: 46800, color: "#8b5cf6" },
      { plan: "Premium Monthly", members: 89, revenue: 62300, color: "#06b6d4" },
      { plan: "Annual Basic", members: 67, revenue: 60300, color: "#10b981" },
      { plan: "Annual Premium", members: 34, revenue: 40800, color: "#f59e0b" },
    ],

    equipmentUsage: [
      { equipment: "Treadmills", usage: 85, bookings: 234 },
      { equipment: "Weight Machines", usage: 92, bookings: 189 },
      { equipment: "Free Weights", usage: 78, bookings: 156 },
      { equipment: "Cardio Bikes", usage: 67, bookings: 123 },
      { equipment: "Rowing Machines", usage: 45, bookings: 89 },
    ],

    classPopularity: [
      { class: "Yoga", participants: 45, sessions: 12 },
      { class: "HIIT", participants: 38, sessions: 8 },
      { class: "Pilates", participants: 32, sessions: 10 },
      { class: "Spin Class", participants: 28, sessions: 6 },
      { class: "Zumba", participants: 25, sessions: 5 },
    ],
  }
}

export const getKPIMetrics = () => ({
  totalMembers: 346,
  activeMembers: 312,
  monthlyRevenue: 89750,
  averageAttendance: 78,
  memberRetention: 92.5,
  equipmentUtilization: 76.8,
})

export const getRevenueBreakdown = () => [
  { source: "Membership Fees", amount: 67500, percentage: 75.2 },
  { source: "Personal Training", amount: 12300, percentage: 13.7 },
  { source: "Classes", amount: 6800, percentage: 7.6 },
  { source: "Merchandise", amount: 3150, percentage: 3.5 },
]
