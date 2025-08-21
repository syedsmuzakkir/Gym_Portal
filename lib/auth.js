export const DUMMY_USERS = [
  {
    id: 1,
    email: "admin@gmail.com",
    phone: "+1234567890",
    password: "admin123",
    role: "admin",
    name: "System Administrator",
  },
  {
    id: 2,
    email: "manager@gmail.com",
    phone: "+1234567891",
    password: "manager123",
    role: "manager",
    name: "Department Manager",
  },
  {
    id: 3,
    email: "employee@gmail.com",
    phone: "+1234567892",
    password: "employee123",
    role: "employee",
    name: "Staff Employee",
  },
]

export const authenticateUser = (identifier, password) => {
  const user = DUMMY_USERS.find((u) => (u.email === identifier || u.phone === identifier) && u.password === password)
  return user || null
}

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null
  const userData = localStorage.getItem("currentUser")
  return userData ? JSON.parse(userData) : null
}

export const setCurrentUser = (user) => {
  if (typeof window === "undefined") return
  localStorage.setItem("currentUser", JSON.stringify(user))
}

export const clearCurrentUser = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
}

export const isAuthenticated = () => {
  return getCurrentUser() !== null
}
