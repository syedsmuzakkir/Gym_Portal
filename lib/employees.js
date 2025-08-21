// Dummy employee data and management functions
export const DUMMY_EMPLOYEES = [
  {
    id: 1,
    employeeId: "EMP001",
    name: "John Smith",
    email: "john.smith@gov.portal",
    phone: "+1234567890",
    department: "Administration",
    position: "Senior Administrator",
    status: "active",
    joinDate: "2022-01-15",
    salary: 65000,
    address: "123 Main St, City, State 12345",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+1234567891",
      relationship: "Spouse",
    },
  },
  {
    id: 2,
    employeeId: "EMP002",
    name: "Sarah Johnson",
    email: "sarah.johnson@gov.portal",
    phone: "+1234567892",
    department: "Human Resources",
    position: "HR Manager",
    status: "active",
    joinDate: "2021-08-20",
    salary: 58000,
    address: "456 Oak Ave, City, State 12345",
    emergencyContact: {
      name: "Mike Johnson",
      phone: "+1234567893",
      relationship: "Brother",
    },
  },
  {
    id: 3,
    employeeId: "EMP003",
    name: "Michael Brown",
    email: "michael.brown@gov.portal",
    phone: "+1234567894",
    department: "IT",
    position: "System Administrator",
    status: "inactive",
    joinDate: "2020-03-10",
    salary: 72000,
    address: "789 Pine St, City, State 12345",
    emergencyContact: {
      name: "Lisa Brown",
      phone: "+1234567895",
      relationship: "Wife",
    },
  },
  {
    id: 4,
    employeeId: "EMP004",
    name: "Emily Davis",
    email: "emily.davis@gov.portal",
    phone: "+1234567896",
    department: "Finance",
    position: "Financial Analyst",
    status: "active",
    joinDate: "2023-02-01",
    salary: 55000,
    address: "321 Elm St, City, State 12345",
    emergencyContact: {
      name: "Robert Davis",
      phone: "+1234567897",
      relationship: "Father",
    },
  },
]

export const DEPARTMENTS = ["Administration", "Human Resources", "IT", "Finance", "Operations", "Legal", "Security"]

export const getEmployees = () => {
  if (typeof window === "undefined") return DUMMY_EMPLOYEES
  const stored = localStorage.getItem("employees")
  return stored ? JSON.parse(stored) : DUMMY_EMPLOYEES
}

export const saveEmployees = (employees) => {
  if (typeof window === "undefined") return
  localStorage.setItem("employees", JSON.stringify(employees))
}

export const addEmployee = (employee) => {
  const employees = getEmployees()
  const newEmployee = {
    ...employee,
    id: Math.max(...employees.map((e) => e.id), 0) + 1,
    employeeId: `EMP${String(Math.max(...employees.map((e) => Number.parseInt(e.employeeId.slice(3))), 0) + 1).padStart(3, "0")}`,
  }
  const updatedEmployees = [...employees, newEmployee]
  saveEmployees(updatedEmployees)
  return newEmployee
}

export const updateEmployee = (id, updates) => {
  const employees = getEmployees()
  const updatedEmployees = employees.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
  saveEmployees(updatedEmployees)
  return updatedEmployees.find((emp) => emp.id === id)
}

export const deleteEmployee = (id) => {
  const employees = getEmployees()
  const updatedEmployees = employees.filter((emp) => emp.id !== id)
  saveEmployees(updatedEmployees)
  return true
}

export const getEmployeeById = (id) => {
  const employees = getEmployees()
  return employees.find((emp) => emp.id === Number.parseInt(id))
}
