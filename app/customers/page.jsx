"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"
import CustomerTable from "@/components/customers/customer-table"
import CustomerForm from "@/components/customers/customer-form"
import InvoiceGenerator from "@/components/customers/invoice-generator"
import PaymentHistory from "@/components/customers/payment-history"
import PaymentProcessor from "@/components/payments/payment-processor"
import CustomerDetailsModal from "@/components/customers/customer-details-modal"
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  generateInvoice,
  getCustomerPayments,
  getCustomerInvoices,
  SUBSCRIPTION_PLANS,
} from "@/lib/customers"
import { UserCheck, Plus, Search, Filter, Users, DollarSign, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [isPaymentProcessorOpen, setIsPaymentProcessorOpen] = useState(false)
  const [paymentCustomer, setPaymentCustomer] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setCustomers(getCustomers())
  }, [])

  useEffect(() => {
    let filtered = customers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.subscription.plan.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((customer) => customer.status === statusFilter)
    }

    // Subscription filter
    if (subscriptionFilter !== "all") {
      filtered = filtered.filter((customer) => customer.subscription.plan === subscriptionFilter)
    }

    setFilteredCustomers(filtered)
  }, [customers, searchTerm, statusFilter, subscriptionFilter])

  const handleAddCustomer = async (customerData) => {
    setIsLoading(true)
    try {
      const newCustomer = addCustomer(customerData)
      setCustomers(getCustomers())
      setIsFormOpen(false)
      setSelectedCustomer(null)
      toast({
        title: "Success",
        description: "Customer added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditCustomer = async (customerData) => {
    setIsLoading(true)
    try {
      updateCustomer(selectedCustomer.id, customerData)
      setCustomers(getCustomers())
      setIsFormOpen(false)
      setSelectedCustomer(null)
      toast({
        title: "Success",
        description: "Customer updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCustomer = async (id) => {
    try {
      deleteCustomer(id)
      setCustomers(getCustomers())
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      updateCustomer(id, { status: newStatus })
      setCustomers(getCustomers())
      toast({
        title: "Success",
        description: `Customer ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer status",
        variant: "destructive",
      })
    }
  }

  const handleGenerateInvoice = (customer) => {
    setSelectedCustomer(customer)
    setIsInvoiceOpen(true)
  }

  const handleInvoiceGenerated = async (customerId, items) => {
    setIsLoading(true)
    try {
      const invoice = generateInvoice(customerId, items)
      setIsInvoiceOpen(false)
      setSelectedCustomer(null)
      toast({
        title: "Success",
        description: `Invoice ${invoice.invoiceNumber} generated successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoice",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewPayments = (customer) => {
    setSelectedCustomer(customer)
    setIsPaymentHistoryOpen(true)
  }

  const handleMakePayment = (customer) => {
    setPaymentCustomer(customer)
    setIsPaymentProcessorOpen(true)
  }

  const handlePaymentComplete = (payment) => {
    setCustomers(getCustomers()) // Refresh customer data
    setIsPaymentProcessorOpen(false)
    setPaymentCustomer(null)
    toast({
      title: "Success",
      description: `Payment of $${payment.amount} processed successfully for ${paymentCustomer?.name}`,
    })
  }

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setIsCustomerDetailsOpen(true)
  }

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.totalPaid || 0), 0),
    activeSubscriptions: customers.filter((c) => c.subscription.status === "active").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
              <p className="text-muted-foreground mt-1">Manage customers, subscriptions, and billing</p>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
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
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.activeSubscriptions}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
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
              <CardDescription>Filter and search through customer records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search customers..."
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
                <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {SUBSCRIPTION_PLANS.map((plan) => (
                      <SelectItem key={plan.id} value={plan.name}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredCustomers.length} of {customers.length} customers
                </p>
                {(searchTerm || statusFilter !== "all" || subscriptionFilter !== "all") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setStatusFilter("all")
                      setSubscriptionFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>Complete list of all customers and their subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerTable
                customers={filteredCustomers}
                onEdit={(customer) => {
                  setSelectedCustomer(customer)
                  setIsFormOpen(true)
                }}
                onDelete={handleDeleteCustomer}
                onView={handleViewCustomer}
                onToggleStatus={handleToggleStatus}
                onGenerateInvoice={handleGenerateInvoice}
                onViewPayments={handleViewPayments}
                onMakePayment={handleMakePayment}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Form Modal */}
        <CustomerForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setSelectedCustomer(null)
          }}
          onSubmit={selectedCustomer ? handleEditCustomer : handleAddCustomer}
          customer={selectedCustomer}
          isLoading={isLoading}
        />

        {/* Invoice Generator Modal */}
        <InvoiceGenerator
          isOpen={isInvoiceOpen}
          onClose={() => {
            setIsInvoiceOpen(false)
            setSelectedCustomer(null)
          }}
          customer={selectedCustomer}
          onGenerate={handleInvoiceGenerated}
          isLoading={isLoading}
        />

        {/* Payment History Modal */}
        <PaymentHistory
          isOpen={isPaymentHistoryOpen}
          onClose={() => {
            setIsPaymentHistoryOpen(false)
            setSelectedCustomer(null)
          }}
          customer={selectedCustomer}
          payments={selectedCustomer ? getCustomerPayments(selectedCustomer.id) : []}
          invoices={selectedCustomer ? getCustomerInvoices(selectedCustomer.id) : []}
        />

        {/* Payment Processor Modal */}
        <PaymentProcessor
          isOpen={isPaymentProcessorOpen}
          onClose={() => {
            setIsPaymentProcessorOpen(false)
            setPaymentCustomer(null)
          }}
          customer={paymentCustomer}
          onPaymentComplete={handlePaymentComplete}
        />

        {/* Customer Details Modal */}
        <CustomerDetailsModal
          isOpen={isCustomerDetailsOpen}
          onClose={() => {
            setIsCustomerDetailsOpen(false)
            setSelectedCustomer(null)
          }}
          customer={selectedCustomer}
          onEdit={(customer) => {
            setIsCustomerDetailsOpen(false)
            setSelectedCustomer(customer)
            setIsFormOpen(true)
          }}
          onMakePayment={(customer) => {
            setIsCustomerDetailsOpen(false)
            handleMakePayment(customer)
          }}
          onGenerateInvoice={(customer) => {
            setIsCustomerDetailsOpen(false)
            handleGenerateInvoice(customer)
          }}
          onViewPayments={(customer) => {
            setIsCustomerDetailsOpen(false)
            handleViewPayments(customer)
          }}
          onSendMessage={(customer) => {
            setIsCustomerDetailsOpen(false)
            // Could integrate with chat system
            console.log("Send message to:", customer)
          }}
        />
      </div>
    </DashboardLayout>
  )
}
