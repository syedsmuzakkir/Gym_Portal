// Dummy attendance data and management functions
export const DUMMY_ATTENDANCE = [
  {
    id: 1,
    memberId: "EMP001",
    memberName: "John Smith",
    memberType: "employee",
    checkIn: "2024-01-15T09:00:00",
    checkOut: "2024-01-15T17:30:00",
    date: "2024-01-15",
    status: "present",
    scannedBy: "System",
    location: "Main Office",
  },
  {
    id: 2,
    memberId: "CUST001",
    memberName: "Alice Johnson",
    memberType: "customer",
    checkIn: "2024-01-15T10:15:00",
    checkOut: "2024-01-15T11:45:00",
    date: "2024-01-15",
    status: "present",
    scannedBy: "John Smith",
    location: "Service Counter",
  },
  {
    id: 3,
    memberId: "EMP002",
    memberName: "Sarah Johnson",
    memberType: "employee",
    checkIn: "2024-01-15T08:45:00",
    checkOut: "2024-01-15T17:15:00",
    date: "2024-01-15",
    status: "present",
    scannedBy: "System",
    location: "Main Office",
  },
  {
    id: 4,
    memberId: "EMP003",
    memberName: "Michael Brown",
    memberType: "employee",
    checkIn: null,
    checkOut: null,
    date: "2024-01-15",
    status: "absent",
    scannedBy: null,
    location: null,
  },
  {
    id: 5,
    memberId: "CUST002",
    memberName: "Robert Smith",
    memberType: "customer",
    checkIn: "2024-01-15T14:30:00",
    checkOut: "2024-01-15T15:20:00",
    date: "2024-01-15",
    status: "present",
    scannedBy: "Sarah Johnson",
    location: "Meeting Room A",
  },
]

export const MEMBER_CODES = [
  {
    id: 1,
    memberId: "EMP001",
    memberName: "John Smith",
    memberType: "employee",
    qrCode: "QR-EMP001-2024",
    barcode: "123456789012",
    isActive: true,
    generatedDate: "2024-01-01",
  },
  {
    id: 2,
    memberId: "EMP002",
    memberName: "Sarah Johnson",
    memberType: "employee",
    qrCode: "QR-EMP002-2024",
    barcode: "123456789013",
    isActive: true,
    generatedDate: "2024-01-01",
  },
  {
    id: 3,
    memberId: "CUST001",
    memberName: "Alice Johnson",
    memberType: "customer",
    qrCode: "QR-CUST001-2024",
    barcode: "123456789014",
    isActive: true,
    generatedDate: "2024-01-01",
  },
  {
    id: 4,
    memberId: "CUST002",
    memberName: "Robert Smith",
    memberType: "customer",
    qrCode: "QR-CUST002-2024",
    barcode: "123456789015",
    isActive: true,
    generatedDate: "2024-01-01",
  },
]

export const getAttendance = () => {
  if (typeof window === "undefined") return DUMMY_ATTENDANCE
  const stored = localStorage.getItem("attendance")
  return stored ? JSON.parse(stored) : DUMMY_ATTENDANCE
}

export const saveAttendance = (attendance) => {
  if (typeof window === "undefined") return
  localStorage.setItem("attendance", JSON.stringify(attendance))
}

export const getMemberCodes = () => {
  if (typeof window === "undefined") return MEMBER_CODES
  const stored = localStorage.getItem("memberCodes")
  return stored ? JSON.parse(stored) : MEMBER_CODES
}

export const saveMemberCodes = (codes) => {
  if (typeof window === "undefined") return
  localStorage.setItem("memberCodes", JSON.stringify(codes))
}

export const markAttendance = (scannedCode, scannedBy, location = "Main Office") => {
  const memberCodes = getMemberCodes()
  const attendance = getAttendance()

  // Find member by QR code or barcode
  const member = memberCodes.find((m) => m.qrCode === scannedCode || m.barcode === scannedCode)

  if (!member || !member.isActive) {
    throw new Error("Invalid or inactive member code")
  }

  const today = new Date().toISOString().split("T")[0]
  const now = new Date().toISOString()

  // Check if already marked attendance today
  const existingAttendance = attendance.find((a) => a.memberId === member.memberId && a.date === today)

  if (existingAttendance) {
    // Mark check-out if only check-in exists
    if (existingAttendance.checkIn && !existingAttendance.checkOut) {
      const updatedAttendance = attendance.map((a) =>
        a.id === existingAttendance.id ? { ...a, checkOut: now, scannedBy } : a,
      )
      saveAttendance(updatedAttendance)
      return { ...existingAttendance, checkOut: now, type: "checkout" }
    } else {
      throw new Error("Attendance already marked for today")
    }
  } else {
    // Create new attendance record
    const newAttendance = {
      id: Math.max(...attendance.map((a) => a.id), 0) + 1,
      memberId: member.memberId,
      memberName: member.memberName,
      memberType: member.memberType,
      checkIn: now,
      checkOut: null,
      date: today,
      status: "present",
      scannedBy,
      location,
    }

    const updatedAttendance = [...attendance, newAttendance]
    saveAttendance(updatedAttendance)
    return { ...newAttendance, type: "checkin" }
  }
}

export const getAttendanceByDate = (date) => {
  const attendance = getAttendance()
  return attendance.filter((a) => a.date === date)
}

export const getAttendanceByMember = (memberId) => {
  const attendance = getAttendance()
  return attendance.filter((a) => a.memberId === memberId)
}

export const getAttendanceStats = (date = null) => {
  const attendance = getAttendance()
  const targetDate = date || new Date().toISOString().split("T")[0]
  const dayAttendance = attendance.filter((a) => a.date === targetDate)

  const employees = dayAttendance.filter((a) => a.memberType === "employee")
  const customers = dayAttendance.filter((a) => a.memberType === "customer")

  return {
    total: dayAttendance.length,
    present: dayAttendance.filter((a) => a.status === "present").length,
    absent: dayAttendance.filter((a) => a.status === "absent").length,
    employees: {
      total: employees.length,
      present: employees.filter((a) => a.status === "present").length,
      absent: employees.filter((a) => a.status === "absent").length,
    },
    customers: {
      total: customers.length,
      present: customers.filter((a) => a.status === "present").length,
    },
  }
}

export const generateMemberCode = (memberId, memberName, memberType) => {
  const memberCodes = getMemberCodes()

  const newCode = {
    id: Math.max(...memberCodes.map((c) => c.id), 0) + 1,
    memberId,
    memberName,
    memberType,
    qrCode: `QR-${memberId}-${new Date().getFullYear()}`,
    barcode: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
    isActive: true,
    generatedDate: new Date().toISOString().split("T")[0],
  }

  const updatedCodes = [...memberCodes, newCode]
  saveMemberCodes(updatedCodes)
  return newCode
}

export const toggleMemberCodeStatus = (id) => {
  const memberCodes = getMemberCodes()
  const updatedCodes = memberCodes.map((code) => (code.id === id ? { ...code, isActive: !code.isActive } : code))
  saveMemberCodes(updatedCodes)
  return updatedCodes.find((code) => code.id === id)
}
