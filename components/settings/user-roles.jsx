"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Users, Shield } from "lucide-react"
import { getUserRoles } from "@/lib/settings"

export default function UserRoles() {
  const [roles, setRoles] = useState(getUserRoles())
  const [editingRole, setEditingRole] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const allPermissions = [
    { id: "manage_users", name: "Manage Users", description: "Create, edit, and delete user accounts" },
    { id: "manage_settings", name: "Manage Settings", description: "Access and modify system settings" },
    { id: "view_reports", name: "View Reports", description: "Access analytics and reporting" },
    { id: "manage_payments", name: "Manage Payments", description: "Process and manage payments" },
    { id: "manage_subscriptions", name: "Manage Subscriptions", description: "Handle membership subscriptions" },
    { id: "manage_attendance", name: "Manage Attendance", description: "Track and manage member attendance" },
    { id: "manage_meetings", name: "Manage Meetings", description: "Schedule and manage meetings" },
    { id: "manage_communication", name: "Manage Communication", description: "Access team communication tools" },
    { id: "view_members", name: "View Members", description: "View member information" },
    { id: "view_communication", name: "View Communication", description: "View team messages and updates" },
  ]

  const handleEditRole = (role) => {
    setEditingRole(role)
    setShowForm(true)
  }

  const handleCreateRole = () => {
    setEditingRole({
      id: "",
      name: "",
      description: "",
      permissions: [],
      color: "#6b7280",
    })
    setShowForm(true)
  }

  const handleSaveRole = (roleData) => {
    if (editingRole.id) {
      // Update existing role
      setRoles((prev) => prev.map((role) => (role.id === editingRole.id ? roleData : role)))
    } else {
      // Create new role
      const newRole = { ...roleData, id: Date.now().toString() }
      setRoles((prev) => [...prev, newRole])
    }
    setShowForm(false)
    setEditingRole(null)
  }

  const handleDeleteRole = (roleId) => {
    setRoles((prev) => prev.filter((role) => role.id !== roleId))
  }

  if (showForm) {
    return (
      <RoleForm
        role={editingRole}
        permissions={allPermissions}
        onSave={handleSaveRole}
        onCancel={() => {
          setShowForm(false)
          setEditingRole(null)
        }}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Roles & Permissions
          </CardTitle>
          <Button onClick={handleCreateRole} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roles.map((role) => (
            <Card key={role.id} className="border-l-4" style={{ borderLeftColor: role.color }}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                      <Badge style={{ backgroundColor: role.color + "20", color: role.color }}>
                        {role.permissions.length} permissions
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{role.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permissionId) => {
                        const permission = allPermissions.find((p) => p.id === permissionId)
                        return permission ? (
                          <Badge key={permissionId} variant="outline" className="text-xs">
                            {permission.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {role.id !== "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RoleForm({ role, permissions, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: role?.name || "",
    description: role?.description || "",
    permissions: role?.permissions || [],
    color: role?.color || "#6b7280",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...role, ...formData })
  }

  const togglePermission = (permissionId) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((p) => p !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  const colors = ["#ef4444", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6", "#ec4899", "#6b7280"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {role?.id ? "Edit Role" : "Create New Role"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter role name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? "border-gray-900" : "border-gray-300"}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData((prev) => ({ ...prev, color }))}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this role's responsibilities"
              rows={2}
            />
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={() => togglePermission(permission.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                      {permission.name}
                    </Label>
                    <p className="text-sm text-gray-600">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              {role?.id ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
