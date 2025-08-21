"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"
import EmployeeTable from "@/components/employees/employee-table"
import EmployeeForm from "@/components/employees/employee-form"
import EmployeeDetails from "@/components/employees/employee-details"
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, DEPARTMENTS } from "@/lib/employees"
import { Users, Plus, Search, Filter, UserCheck, UserX, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setEmployees(getEmployees())
  }, [])

  useEffect(() => {
    let filtered = employees

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((emp) => emp.status === statusFilter)
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter((emp) => emp.department === departmentFilter)
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, statusFilter, departmentFilter])

  const handleAddEmployee = async (employeeData) => {
    setIsLoading(true)
    try {
      const newEmployee = addEmployee(employeeData)
      setEmployees(getEmployees())
      setIsFormOpen(false)
      setSelectedEmployee(null)
      toast({
        title: "Success",
        description: "Employee added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditEmployee = async (employeeData) => {
    setIsLoading(true)
    try {
      updateEmployee(selectedEmployee.id, employeeData)
      setEmployees(getEmployees())
      setIsFormOpen(false)
      setSelectedEmployee(null)
      toast({
        title: "Success",
        description: "Employee updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEmployee = async (id) => {
    try {
      deleteEmployee(id)
      setEmployees(getEmployees())
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      updateEmployee(id, { status: newStatus })
      setEmployees(getEmployees())
      toast({
        title: "Success",
        description: `Employee ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee status",
        variant: "destructive",
      })
    }
  }

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee)
    setIsDetailsOpen(true)
  }

  const handleEditFromDetails = (employee) => {
    setIsDetailsOpen(false)
    setSelectedEmployee(employee)
    setIsFormOpen(true)
  }

  const stats = {
    total: employees.length,
    active: employees.filter((emp) => emp.status === "active").length,
    inactive: employees.filter((emp) => emp.status === "inactive").length,
    departments: [...new Set(employees.map((emp) => emp.department))].length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
              <p className="text-muted-foreground mt-1">Manage your organization's workforce</p>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
                </div>
                <UserX className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departments</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.departments}</p>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </CardTitle>
              <CardDescription>Filter and search through employee records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredEmployees.length} of {employees.length} employees
                </p>
                {(searchTerm || statusFilter !== "all" || departmentFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setDepartmentFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Employee Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Complete list of all employees</CardDescription>
            </CardHeader>
            <CardContent>
              <EmployeeTable
                employees={filteredEmployees}
                onEdit={(employee) => {
                  setSelectedEmployee(employee)
                  setIsFormOpen(true)
                }}
                onDelete={handleDeleteEmployee}
                onView={handleViewEmployee}
                onToggleStatus={handleToggleStatus}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Employee Form Modal */}
        <EmployeeForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setSelectedEmployee(null)
          }}
          onSubmit={selectedEmployee ? handleEditEmployee : handleAddEmployee}
          employee={selectedEmployee}
          isLoading={isLoading}
        />

        {/* Employee Details Modal */}
        <EmployeeDetails
          employee={selectedEmployee}
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false)
            setSelectedEmployee(null)
          }}
          onEdit={handleEditFromDetails}
        />
      </div>
    </DashboardLayout>
  )
}
