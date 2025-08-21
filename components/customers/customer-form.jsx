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
import { SUBSCRIPTION_PLANS } from "@/lib/customers"
import { Upload, User, Calendar, DollarSign, Settings } from "lucide-react"

export default function CustomerForm({ isOpen, onClose, onSubmit, customer = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    photo: customer?.photo || "",
    status: customer?.status || "active",
    joinDate: customer?.joinDate || new Date().toISOString().split("T")[0],
    subscription: {
      type: customer?.subscription?.type || "monthly",
      plan: customer?.subscription?.plan || "Basic",
      price: customer?.subscription?.price || 49,
      customPrice: customer?.subscription?.customPrice || "",
      duration: customer?.subscription?.duration || "1",
      features: customer?.subscription?.features || "",
      startDate: customer?.subscription?.startDate || new Date().toISOString().split("T")[0],
      endDate:
        customer?.subscription?.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: customer?.subscription?.status || "active",
    },
  })

  const [photoPreview, setPhotoPreview] = useState(customer?.photo || "")

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

  const handlePlanChange = (planName) => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.name === planName)
    if (plan) {
      setFormData((prev) => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          plan: planName,
          price: plan.price,
        },
      }))
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
                  {customer ? "Edit Customer" : "Add New Customer"}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {customer
                    ? "Update customer information and subscription"
                    : "Enter customer details and subscription plan"}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Photo Upload Section */}
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
                              alt="Customer photo"
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

                {/* Basic Information */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <User className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
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
                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            required
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
                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone *
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            required
                          />
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
                              className="pl-10 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                            Address
                          </Label>
                          <Textarea
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                            Status
                          </Label>
                          <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                            <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
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

                {/* Subscription Information */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Settings className="w-5 h-5 text-purple-500" />
                        <h3 className="text-lg font-semibold text-gray-800">Subscription Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="subscriptionType" className="text-sm font-medium text-gray-700">
                            Subscription Type
                          </Label>
                          <Select
                            value={formData.subscription.type}
                            onValueChange={(value) => handleChange("subscription.type", value)}
                          >
                            <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subscriptionPlan" className="text-sm font-medium text-gray-700">
                            Plan
                          </Label>
                          <Select value={formData.subscription.plan} onValueChange={handlePlanChange}>
                            <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SUBSCRIPTION_PLANS.map((plan) => (
                                <SelectItem key={plan.id} value={plan.name}>
                                  {plan.name} - ${plan.price}/month
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <AnimatePresence>
                          {formData.subscription.type === "custom" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="md:col-span-2 space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
                            >
                              <h4 className="font-medium text-purple-800">Custom Subscription Settings</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="customPrice" className="text-sm font-medium text-gray-700">
                                    Custom Price ($)
                                  </Label>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                      id="customPrice"
                                      type="number"
                                      placeholder="Enter custom price"
                                      value={formData.subscription.customPrice}
                                      onChange={(e) => handleChange("subscription.customPrice", e.target.value)}
                                      className="pl-10 border-2 border-gray-200 focus:border-purple-500"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                                    Duration (months)
                                  </Label>
                                  <Input
                                    id="duration"
                                    type="number"
                                    placeholder="Duration in months"
                                    value={formData.subscription.duration}
                                    onChange={(e) => handleChange("subscription.duration", e.target.value)}
                                    className="border-2 border-gray-200 focus:border-purple-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="features" className="text-sm font-medium text-gray-700">
                                    Custom Features
                                  </Label>
                                  <Input
                                    id="features"
                                    placeholder="e.g., Personal trainer, Pool access"
                                    value={formData.subscription.features}
                                    onChange={(e) => handleChange("subscription.features", e.target.value)}
                                    className="border-2 border-gray-200 focus:border-purple-500"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="space-y-2">
                          <Label htmlFor="subscriptionPrice" className="text-sm font-medium text-gray-700">
                            Price ($)
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="subscriptionPrice"
                              type="number"
                              value={formData.subscription.price}
                              onChange={(e) => handleChange("subscription.price", Number.parseInt(e.target.value))}
                              className="pl-10 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subscriptionStatus" className="text-sm font-medium text-gray-700">
                            Subscription Status
                          </Label>
                          <Select
                            value={formData.subscription.status}
                            onValueChange={(value) => handleChange("subscription.status", value)}
                          >
                            <SelectTrigger className="border-2 border-gray-200 focus:border-purple-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="expired">Expired</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subscriptionStart" className="text-sm font-medium text-gray-700">
                            Start Date
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="subscriptionStart"
                              type="date"
                              value={formData.subscription.startDate}
                              onChange={(e) => handleChange("subscription.startDate", e.target.value)}
                              className="pl-10 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subscriptionEnd" className="text-sm font-medium text-gray-700">
                            End Date
                          </Label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="subscriptionEnd"
                              type="date"
                              value={formData.subscription.endDate}
                              onChange={(e) => handleChange("subscription.endDate", e.target.value)}
                              className="pl-10 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                            />
                          </div>
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
                    {isLoading ? "Saving..." : customer ? "Update Customer" : "Add Customer"}
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
