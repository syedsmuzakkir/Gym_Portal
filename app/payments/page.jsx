"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DashboardLayout from "@/components/layout/dashboard-layout"
import PaymentProcessor from "@/components/payments/payment-processor"
import PaymentLinks from "@/components/payments/payment-links"
import { getPayments, getPaymentLinks, getPaymentStats, PAYMENT_METHODS, PAYMENT_STATUS } from "@/lib/payments"
import { getCustomers } from "@/lib/customers"
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Link,
  Banknote,
  Smartphone,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [paymentLinks, setPaymentLinks] = useState([])
  const [customers, setCustomers] = useState([])
  const [filteredPayments, setFilteredPayments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [isProcessorOpen, setIsProcessorOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [stats, setStats] = useState({})
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, statusFilter, methodFilter])

  const loadData = () => {
    setPayments(getPayments())
    setPaymentLinks(getPaymentLinks())
    setCustomers(getCustomers())
    setStats(getPaymentStats())
  }

  const filterPayments = () => {
    let filtered = payments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment) => payment.status === statusFilter)
    }

    // Method filter
    if (methodFilter !== "all") {
      filtered = filtered.filter((payment) => payment.method === methodFilter)
    }

    setFilteredPayments(filtered)
  }

  const handlePaymentComplete = (payment) => {
    loadData()
    setIsProcessorOpen(false)
    setSelectedCustomer(null)

    toast({
      title: "Success",
      description: `Payment of $${payment.amount} processed successfully`,
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case PAYMENT_STATUS.PENDING:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case PAYMENT_STATUS.PROCESSING:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Processing
          </Badge>
        )
      case PAYMENT_STATUS.FAILED:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Failed
          </Badge>
        )
      case PAYMENT_STATUS.CANCELLED:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMethodIcon = (method) => {
    switch (method) {
      case PAYMENT_METHODS.CASH:
        return <Banknote className="w-4 h-4" />
      case PAYMENT_METHODS.RAZORPAY:
        return <Smartphone className="w-4 h-4" />
      case PAYMENT_METHODS.STRIPE:
        return <CreditCard className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
              <p className="text-muted-foreground mt-1">Process payments and manage transactions</p>
            </div>
            <Button onClick={() => setIsProcessorOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Process Payment
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
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${stats.totalAmount?.toLocaleString() || 0}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">${stats.monthlyAmount?.toLocaleString() || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.completed || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="transactions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center space-x-2">
                <Link className="w-4 h-4" />
                <span>Payment Links</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Transaction Filters
                  </CardTitle>
                  <CardDescription>Filter and search through payment transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search transactions..."
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
                        <SelectItem value={PAYMENT_STATUS.COMPLETED}>Completed</SelectItem>
                        <SelectItem value={PAYMENT_STATUS.PENDING}>Pending</SelectItem>
                        <SelectItem value={PAYMENT_STATUS.PROCESSING}>Processing</SelectItem>
                        <SelectItem value={PAYMENT_STATUS.FAILED}>Failed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={methodFilter} onValueChange={setMethodFilter}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value={PAYMENT_METHODS.CASH}>Cash</SelectItem>
                        <SelectItem value={PAYMENT_METHODS.RAZORPAY}>Razorpay</SelectItem>
                        <SelectItem value={PAYMENT_METHODS.STRIPE}>Stripe</SelectItem>
                        <SelectItem value={PAYMENT_METHODS.BANK_TRANSFER}>Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredPayments.length} of {payments.length} transactions
                    </p>
                    {(searchTerm || statusFilter !== "all" || methodFilter !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("")
                          setStatusFilter("all")
                          setMethodFilter("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Transactions</CardTitle>
                  <CardDescription>All payment transactions and their details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayments.map((payment, index) => (
                          <motion.tr
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{payment.customerName}</p>
                                <p className="text-sm text-muted-foreground">ID: {payment.customerId}</p>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">${payment.amount}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getMethodIcon(payment.method)}
                                <span className="capitalize">{payment.method.replace("_", " ")}</span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-xs truncate">{payment.description}</TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredPayments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No transactions found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <PaymentLinks paymentLinks={paymentLinks} customers={customers} onRefresh={loadData} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Payment Processor Modal */}
        <PaymentProcessor
          isOpen={isProcessorOpen}
          onClose={() => {
            setIsProcessorOpen(false)
            setSelectedCustomer(null)
          }}
          customer={selectedCustomer}
          onPaymentComplete={handlePaymentComplete}
        />
      </div>
    </DashboardLayout>
  )
}
