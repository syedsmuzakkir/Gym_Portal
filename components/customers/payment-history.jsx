"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Banknote, CheckCircle, Clock, XCircle } from "lucide-react"

export default function PaymentHistory({ isOpen, onClose, customer, payments = [], invoices = [] }) {
  if (!customer) return null

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="w-4 h-4" />
      case "bank_transfer":
        return <Banknote className="w-4 h-4" />
      default:
        return <CreditCard className="w-4 h-4" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalPaid = payments.reduce((sum, payment) => (payment.status === "completed" ? sum + payment.amount : sum), 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">Payment History</DialogTitle>
              <DialogDescription className="text-sm">
                Complete payment and invoice history for <span className="font-medium">{customer.name}</span> (
                {customer.customerId})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-700">${totalPaid.toLocaleString()}</p>
                      <p className="text-sm font-medium text-green-600">Total Paid</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-700">{payments.length}</p>
                      <p className="text-sm font-medium text-blue-600">Total Payments</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100/50 sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-700">{invoices.length}</p>
                      <p className="text-sm font-medium text-purple-600">Total Invoices</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Banknote className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span>Payment Transactions</span>
                  </CardTitle>
                  <CardDescription>All payment transactions for this customer</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30">
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Amount</TableHead>
                            <TableHead className="hidden sm:table-cell font-semibold">Method</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="hidden lg:table-cell font-semibold">Transaction ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((payment, index) => (
                            <motion.tr
                              key={payment.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-muted/20 transition-colors"
                            >
                              <TableCell className="font-medium">
                                <div>
                                  {new Date(payment.date).toLocaleDateString()}
                                  <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                    {getPaymentMethodIcon(payment.method)}
                                    <span className="ml-1 capitalize">{payment.method.replace("_", " ")}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-bold text-lg">${payment.amount}</TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <div className="flex items-center space-x-2">
                                  {getPaymentMethodIcon(payment.method)}
                                  <span className="capitalize">{payment.method.replace("_", " ")}</span>
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(payment.status)}</TableCell>
                              <TableCell className="hidden lg:table-cell font-mono text-sm text-muted-foreground">
                                {payment.transactionId}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground font-medium">No payment history found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">Payments will appear here once processed</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b">
                  <CardTitle className="flex items-center space-x-2">
                    <Banknote className="w-5 h-5 text-primary" />
                    <span>Invoice History</span>
                  </CardTitle>
                  <CardDescription>All invoices generated for this customer</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {invoices.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30">
                            <TableHead className="font-semibold">Invoice #</TableHead>
                            <TableHead className="hidden sm:table-cell font-semibold">Issue Date</TableHead>
                            <TableHead className="hidden md:table-cell font-semibold">Due Date</TableHead>
                            <TableHead className="font-semibold">Amount</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((invoice, index) => (
                            <motion.tr
                              key={invoice.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-muted/20 transition-colors"
                            >
                              <TableCell className="font-mono font-medium">
                                <div>
                                  {invoice.invoiceNumber}
                                  <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                    Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                {new Date(invoice.issueDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {new Date(invoice.dueDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="font-bold text-lg">${invoice.amount}</TableCell>
                              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
                        <Banknote className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground font-medium">No invoices found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">Generated invoices will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
