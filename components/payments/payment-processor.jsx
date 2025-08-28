"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PAYMENT_METHODS, useRazorpay, useStripe, processPayment, updatePaymentStatus } from "@/lib/payments"
import { CreditCard, Banknote, Smartphone, Building, CheckCircle, XCircle, Clock } from "lucide-react"

export default function PaymentProcessor({ isOpen, onClose, customer, invoice = null, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState("")
  const [amount, setAmount] = useState(invoice?.amount || "")
  const [description, setDescription] = useState(invoice?.items?.[0]?.description || "")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentResult, setPaymentResult] = useState(null)
  const [error, setError] = useState("")

  const razorpay = useRazorpay()
  const stripe = useStripe()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!paymentMethod || !amount || !customer) return

    setIsProcessing(true)
    setError("")
    setPaymentResult(null)

    try {
      // Create initial payment record
      const paymentData = {
        customerId: customer.id,
        customerName: customer.name,
        amount: Number.parseFloat(amount),
        method: paymentMethod,
        description,
        invoiceId: invoice?.id,
      }

      const payment = await processPayment(paymentData)

      // Process based on payment method
      if (paymentMethod === PAYMENT_METHODS.CASH) {
        // Cash payment is immediately completed
        setPaymentResult({
          success: true,
          payment,
          message: "Cash payment recorded successfully",
        })
        onPaymentComplete && onPaymentComplete(payment)
      } else if (paymentMethod === PAYMENT_METHODS.RAZORPAY) {
        // Process Razorpay payment
        try {
          const result = await razorpay.processPayment(paymentData)
          const updatedPayment = updatePaymentStatus(payment.id, "completed", result.transactionId)

          setPaymentResult({
            success: true,
            payment: updatedPayment,
            gatewayResponse: result.gatewayResponse,
            message: "Payment processed successfully via Razorpay",
          })
          onPaymentComplete && onPaymentComplete(updatedPayment)
        } catch (gatewayError) {
          updatePaymentStatus(payment.id, "failed")
          throw gatewayError
        }
      } else if (paymentMethod === PAYMENT_METHODS.STRIPE) {
        // Process Stripe payment
        try {
          const result = await stripe.processPayment(paymentData)
          const updatedPayment = updatePaymentStatus(payment.id, "completed", result.transactionId)

          setPaymentResult({
            success: true,
            payment: updatedPayment,
            gatewayResponse: result.gatewayResponse,
            message: "Payment processed successfully via Stripe",
          })
          onPaymentComplete && onPaymentComplete(updatedPayment)
        } catch (gatewayError) {
          updatePaymentStatus(payment.id, "failed")
          throw gatewayError
        }
      } else if (paymentMethod === PAYMENT_METHODS.BANK_TRANSFER) {
        // Bank transfer requires manual verification
        const updatedPayment = updatePaymentStatus(payment.id, "pending")
        setPaymentResult({
          success: true,
          payment: updatedPayment,
          message: "Bank transfer initiated. Payment pending verification.",
        })
        onPaymentComplete && onPaymentComplete(updatedPayment)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case PAYMENT_METHODS.CASH:
        return <Banknote className="w-5 h-5" />
      case PAYMENT_METHODS.RAZORPAY:
        return <Smartphone className="w-5 h-5" />
      case PAYMENT_METHODS.STRIPE:
        return <CreditCard className="w-5 h-5" />
      case PAYMENT_METHODS.BANK_TRANSFER:
        return <Building className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  if (!customer) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose} className = "w-[700px] mt-5">
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Process payment for {customer.name} ({customer.customerId})
          </DialogDescription>
        </DialogHeader>

        {!paymentResult ? (
          <form onSubmit={handleSubmit} className="space-y-0 m-0 p-0">
            {/* Customer Info */}
            <Card  >
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Input id="customer" value={`${customer.name} (${customer.customerId})`} disabled />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount ($) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Method</CardTitle>
                <CardDescription>Choose how the customer wants to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
                    <motion.div key={method} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Card
                        className={`cursor-pointer transition-colors ${
                          paymentMethod === method ? "border-primary bg-primary/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod(method)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full ${
                                paymentMethod === method ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {getPaymentMethodIcon(method)}
                            </div>
                            <div>
                              <p className="font-medium capitalize">{method.replace("_", " ")}</p>
                              <p className="text-sm text-muted-foreground">
                                {method === PAYMENT_METHODS.CASH && "Physical cash payment"}
                                {method === PAYMENT_METHODS.RAZORPAY && "UPI, Cards, Wallets"}
                                {method === PAYMENT_METHODS.STRIPE && "Credit/Debit Cards"}
                                {method === PAYMENT_METHODS.BANK_TRANSFER && "Direct bank transfer"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing || !paymentMethod || !amount}>
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Process Payment ($${amount})`
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          /* Payment Result */
          <div className="space-y-6">
            <Alert className={paymentResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {paymentResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={paymentResult.success ? "text-green-800" : "text-red-800"}>
                {paymentResult.message}
              </AlertDescription>
            </Alert>

            {paymentResult.success && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getStatusIcon(paymentResult.payment.status)}
                    <span className="ml-2">Payment Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Transaction ID</p>
                      <p className="text-muted-foreground">{paymentResult.payment.transactionId}</p>
                    </div>
                    <div>
                      <p className="font-medium">Amount</p>
                      <p className="text-muted-foreground">${paymentResult.payment.amount}</p>
                    </div>
                    <div>
                      <p className="font-medium">Method</p>
                      <p className="text-muted-foreground capitalize">
                        {paymentResult.payment.method.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Status</p>
                      <Badge
                        variant={
                          paymentResult.payment.status === "completed"
                            ? "default"
                            : paymentResult.payment.status === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {paymentResult.payment.status}
                      </Badge>
                    </div>
                    {paymentResult.payment.gatewayTransactionId && (
                      <div className="col-span-2">
                        <p className="font-medium">Gateway Transaction ID</p>
                        <p className="text-muted-foreground font-mono text-xs">
                          {paymentResult.payment.gatewayTransactionId}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
