"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { getCustomerPayments, getCustomerInvoices } from "@/lib/customers"
import { DollarSign, CreditCard, Calendar, TrendingUp, AlertCircle, CheckCircle, FileText } from "lucide-react"

export default function CustomerPaymentDashboard({ customer, onMakePayment, onViewHistory }) {
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    if (customer) {
      const customerPayments = getCustomerPayments(customer.id)
      const customerInvoices = getCustomerInvoices(customer.id)

      setPayments(customerPayments)
      setInvoices(customerInvoices)

      // Calculate stats
      const totalPaid = customerPayments.reduce((sum, p) => sum + p.amount, 0)
      const pendingAmount = customerInvoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.total, 0)
      const lastPayment = customerPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0]

      setStats({
        totalPaid,
        pendingAmount,
        lastPayment: lastPayment?.date,
        paymentCount: customerPayments.length,
        subscriptionProgress: calculateSubscriptionProgress(customer),
      })
    }
  }, [customer])

  const calculateSubscriptionProgress = (customer) => {
    if (!customer.subscription.endDate) return 100

    const start = new Date(customer.subscription.startDate)
    const end = new Date(customer.subscription.endDate)
    const now = new Date()

    const total = end - start
    const elapsed = now - start

    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  if (!customer) return null

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border"
      >
        <Avatar className="h-16 w-16">
          <AvatarImage src={customer.photo || "/placeholder.svg"} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {customer.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground">{customer.name}</h2>
          <p className="text-muted-foreground">{customer.email}</p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
            <Badge variant="outline">
              {customer.subscription.plan} - ${customer.subscription.price}/month
            </Badge>
          </div>
        </div>
        <Button onClick={() => onMakePayment(customer)} className="bg-green-600 hover:bg-green-700">
          <DollarSign className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </motion.div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalPaid?.toLocaleString() || 0}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold text-orange-600">${stats.pendingAmount?.toLocaleString() || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Payment</p>
                <p className="text-lg font-bold text-foreground">
                  {stats.lastPayment ? new Date(stats.lastPayment).toLocaleDateString() : "Never"}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payments Made</p>
                <p className="text-2xl font-bold text-purple-600">{stats.paymentCount || 0}</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Subscription Progress
          </CardTitle>
          <CardDescription>Current subscription period progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(stats.subscriptionProgress || 0)}%</span>
            </div>
            <Progress value={stats.subscriptionProgress || 0} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Started: {new Date(customer.subscription.startDate).toLocaleDateString()}</span>
              <span>
                Ends:{" "}
                {customer.subscription.endDate
                  ? new Date(customer.subscription.endDate).toLocaleDateString()
                  : "Ongoing"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.slice(0, 5).map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">${payment.amount}</p>
                        <p className="text-sm text-muted-foreground">{payment.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                      <Badge variant="outline" className="text-xs">
                        {payment.method}
                      </Badge>
                    </div>
                  </motion.div>
                ))}

                {payments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No payments found</p>
                  </div>
                )}

                {payments.length > 5 && (
                  <Button variant="outline" onClick={() => onViewHistory(customer)} className="w-full">
                    View All Payments
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Latest invoices and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">#{invoice.invoiceNumber}</p>
                        <p className="text-sm text-muted-foreground">${invoice.total}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                      <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>{invoice.status}</Badge>
                    </div>
                  </motion.div>
                ))}

                {invoices.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No invoices found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
