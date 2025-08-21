"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { DEPARTMENTS } from "@/lib/employees"
import { Upload, User, Calendar, DollarSign, Briefcase, MapPin, Phone } from "lucide-react"

export default function EmployeeForm({ isOpen, onClose, onSubmit, employee = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: employee?.name || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    photo: employee?.photo || "",
    department: employee?.department || "",
    position: employee?.position || "",
    status: employee?.status || "active",
    joinDate: employee?.joinDate || "",
    salary: employee?.salary || "",
    address: employee?.address || "",
    emergencyContact: {
      name: employee?.emergencyContact?.name || "",
      phone: employee?.emergencyContact?.phone || "",
      relationship: employee?.emergencyContact?.relationship || "",
    },
  })

  const [photoPreview, setPhotoPreview] = useState(employee?.photo || "")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        setPhotoPreview(result)
        handleChange("photo", result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {employee ? "Edit Employee" : "Add New Employee"}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {employee ? "Update employee information" : "Enter employee details to add them to the system"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                          {photoPreview ? (
                            <motion.img
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              src={photoPreview}
                              alt="Employee photo"
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <Label htmlFor="photo" className="cursor-pointer">
                            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all">
                              <Upload className="w-4 h-4" />
                              <span>Upload Photo</span>
                            </div>
                          </Label>
                          <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                          <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <User className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            required
                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            required
                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone *
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleChange("phone", e.target.value)}
                              required
                              className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="joinDate" className="text-sm font-medium text-gray-700">
                            Join Date *
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="joinDate"
                              type="date"
                              value={formData.joinDate}
                              onChange={(e) => handleChange("joinDate", e.target.value)}
                              required
                              className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Briefcase className="w-5 h-5 text-green-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Work Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                            Department *
                          </Label>
                          <Select
                            value={formData.department}
                            onValueChange={(value) => handleChange("department", value)}
                          >
                            <SelectTrigger className="border-2 border-gray-200 focus:border-green-500">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {DEPARTMENTS.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position" className="text-sm font-medium text-gray-700">
                            Position *
                          </Label>
                          <Input
                            id="position"
                            value={formData.position}
                            onChange={(e) => handleChange("position", e.target.value)}
                            required
                            className="border-2 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="salary" className="text-sm font-medium text-gray-700">
                            Salary
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="salary"
                              type="number"
                              value={formData.salary}
                              onChange={(e) => handleChange("salary", e.target.value)}
                              className="pl-10 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500/20 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                            Status
                          </Label>
                          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                            <SelectTrigger className="border-2 border-gray-200 focus:border-green-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                          Address
                        </Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleChange("address", e.target.value)}
                          rows={3}
                          className="border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Phone className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyName" className="text-sm font-medium text-gray-700">
                            Contact Name
                          </Label>
                          <Input
                            id="emergencyName"
                            value={formData.emergencyContact.name}
                            onChange={(e) => handleChange("emergencyContact.name", e.target.value)}
                            className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone" className="text-sm font-medium text-gray-700">
                            Contact Phone
                          </Label>
                          <Input
                            id="emergencyPhone"
                            value={formData.emergencyContact.phone}
                            onChange={(e) => handleChange("emergencyContact.phone", e.target.value)}
                            className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500/20 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyRelationship" className="text-sm font-medium text-gray-700">
                            Relationship
                          </Label>
                          <Input
                            id="emergencyRelationship"
                            value={formData.emergencyContact.relationship}
                            onChange={(e) => handleChange("emergencyContact.relationship", e.target.value)}
                            className="border-2 border-gray-200 focus:border-red-500 focus:ring-red-500/20 transition-all"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <DialogFooter className="pt-6">
                  <Button type="button" variant="outline" onClick={onClose} className="px-6 bg-transparent">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    {isLoading ? "Saving..." : employee ? "Update Employee" : "Add Employee"}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
