"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  MessageCircle,
  Edit,
  Activity,
} from "lucide-react"

export default function CustomerDetailsModal({
  isOpen,
  onClose,
  customer,
  onEdit,
  onMakePayment,
  onGenerateInvoice,
  onViewPayments,
  onSendMessage,
}) {
  if (!customer) return null

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        <Activity className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
        <Activity className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    )
  }

  const getSubscriptionBadge = (subscription) => {
    const status = subscription.status
    if (status === "active") {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          {subscription.plan}
        </Badge>
      )
    } else if (status === "expired") {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Expired
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Cancelled
        </Badge>
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={customer.photo || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">{customer.name}</DialogTitle>
              <DialogDescription className="text-base">
                Customer ID: {customer.customerId} • Member since {new Date(customer.joinDate).toLocaleDateString()}
              </DialogDescription>
              <div className="flex items-center space-x-2 mt-2">
                {getStatusBadge(customer.status)}
                {getSubscriptionBadge(customer.subscription)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="h-fit">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{customer.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">{new Date(customer.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Subscription & Financial Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span>Subscription Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-semibold">{customer.subscription.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">${customer.subscription.price}/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Start Date</span>
                    <span className="font-medium">
                      {new Date(customer.subscription.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Billing</span>
                    <span className="font-medium">
                      {new Date(customer.subscription.nextBilling).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    <span>Financial Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-bold text-lg text-green-600">
                      ${customer.totalPaid?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Last Payment</span>
                    <span className="font-medium">
                      {customer.lastPayment ? new Date(customer.lastPayment).toLocaleDateString() : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Outstanding Balance</span>
                    <span className="font-medium">${customer.outstandingBalance || 0}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t bg-muted/20 px-6 py-4">
          <div className="flex flex-wrap gap-3 justify-end">
            <Button variant="outline" onClick={() => onSendMessage(customer)} className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Send Message</span>
            </Button>
            <Button variant="outline" onClick={() => onEdit(customer)} className="flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Customer</span>
            </Button>
            <Button variant="outline" onClick={() => onViewPayments(customer)} className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Payment History</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => onGenerateInvoice(customer)}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Invoice</span>
            </Button>
            <Button onClick={() => onMakePayment(customer)} className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Make Payment</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
