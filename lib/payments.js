// Payment processing and management functions
export const PAYMENT_METHODS = {
  CASH: "cash",
  RAZORPAY: "razorpay",
  STRIPE: "stripe",
  BANK_TRANSFER: "bank_transfer",
}

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
}

export const DUMMY_PAYMENTS = [
  {
    id: 1,
    transactionId: "TXN-2024-001",
    customerId: 1,
    customerName: "Alice Johnson",
    amount: 99,
    method: PAYMENT_METHODS.RAZORPAY,
    status: PAYMENT_STATUS.COMPLETED,
    date: "2024-01-15T10:30:00",
    description: "Premium Monthly Subscription",
    invoiceId: 1,
    gatewayTransactionId: "rzp_2024_001",
    fees: 2.97,
    netAmount: 96.03,
  },
  {
    id: 2,
    transactionId: "TXN-2024-002",
    customerId: 2,
    customerName: "Robert Smith",
    amount: 49,
    method: PAYMENT_METHODS.STRIPE,
    status: PAYMENT_STATUS.COMPLETED,
    date: "2024-01-15T14:20:00",
    description: "Basic Monthly Subscription",
    invoiceId: 2,
    gatewayTransactionId: "pi_2024_002",
    fees: 1.72,
    netAmount: 47.28,
  },
  {
    id: 3,
    transactionId: "TXN-2024-003",
    customerId: 3,
    customerName: "Maria Garcia",
    amount: 150,
    method: PAYMENT_METHODS.CASH,
    status: PAYMENT_STATUS.COMPLETED,
    date: "2024-01-15T16:45:00",
    description: "Service Fee Payment",
    invoiceId: null,
    gatewayTransactionId: null,
    fees: 0,
    netAmount: 150,
  },
  {
    id: 4,
    transactionId: "TXN-2024-004",
    customerId: 4,
    customerName: "David Wilson",
    amount: 99,
    method: PAYMENT_METHODS.RAZORPAY,
    status: PAYMENT_STATUS.PENDING,
    date: "2024-01-16T09:15:00",
    description: "Premium Monthly Subscription",
    invoiceId: 3,
    gatewayTransactionId: "rzp_2024_004",
    fees: 2.97,
    netAmount: 96.03,
  },
]

export const PAYMENT_LINKS = [
  {
    id: 1,
    linkId: "PL-2024-001",
    customerId: 1,
    customerName: "Alice Johnson",
    amount: 99,
    description: "Premium Subscription Renewal",
    status: "active",
    expiryDate: "2024-02-15",
    createdDate: "2024-01-15",
    url: "https://pay.gov-portal.com/link/PL-2024-001",
    clicks: 3,
    paid: false,
  },
  {
    id: 2,
    linkId: "PL-2024-002",
    customerId: 2,
    customerName: "Robert Smith",
    amount: 49,
    description: "Basic Subscription Payment",
    status: "expired",
    expiryDate: "2024-01-20",
    createdDate: "2024-01-10",
    url: "https://pay.gov-portal.com/link/PL-2024-002",
    clicks: 1,
    paid: true,
  },
]

export const getPayments = () => {
  if (typeof window === "undefined") return DUMMY_PAYMENTS
  const stored = localStorage.getItem("payments")
  return stored ? JSON.parse(stored) : DUMMY_PAYMENTS
}

export const savePayments = (payments) => {
  if (typeof window === "undefined") return
  localStorage.setItem("payments", JSON.stringify(payments))
}

export const getPaymentLinks = () => {
  if (typeof window === "undefined") return PAYMENT_LINKS
  const stored = localStorage.getItem("paymentLinks")
  return stored ? JSON.parse(stored) : PAYMENT_LINKS
}

export const savePaymentLinks = (links) => {
  if (typeof window === "undefined") return
  localStorage.setItem("paymentLinks", JSON.stringify(links))
}

// Dummy Razorpay integration
export const useRazorpay = () => {
  const processPayment = async (paymentData) => {
    // Simulate Razorpay payment processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% success rate

        if (success) {
          const transactionId = `rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`
          resolve({
            success: true,
            transactionId,
            gatewayResponse: {
              razorpay_payment_id: transactionId,
              razorpay_order_id: `order_${Date.now()}`,
              razorpay_signature: `sig_${Math.random().toString(36).substr(2, 9)}`,
            },
          })
        } else {
          reject(new Error("Payment failed. Please try again."))
        }
      }, 2000) // Simulate network delay
    })
  }

  const createPaymentLink = async (linkData) => {
    // Simulate Razorpay payment link creation
    return new Promise((resolve) => {
      setTimeout(() => {
        const linkId = `rzp_link_${Date.now()}`
        resolve({
          id: linkId,
          short_url: `https://rzp.io/${linkId}`,
          status: "created",
        })
      }, 1000)
    })
  }

  return { processPayment, createPaymentLink }
}

// Dummy Stripe integration
export const useStripe = () => {
  const processPayment = async (paymentData) => {
    // Simulate Stripe payment processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% success rate

        if (success) {
          const transactionId = `pi_${Date.now()}_${Math.floor(Math.random() * 1000)}`
          resolve({
            success: true,
            transactionId,
            gatewayResponse: {
              id: transactionId,
              status: "succeeded",
              payment_method: "card_1234",
            },
          })
        } else {
          reject(new Error("Payment declined. Please check your card details."))
        }
      }, 2000) // Simulate network delay
    })
  }

  const createPaymentLink = async (linkData) => {
    // Simulate Stripe payment link creation
    return new Promise((resolve) => {
      setTimeout(() => {
        const linkId = `plink_${Date.now()}`
        resolve({
          id: linkId,
          url: `https://checkout.stripe.com/pay/${linkId}`,
          active: true,
        })
      }, 1000)
    })
  }

  return { processPayment, createPaymentLink }
}

export const processPayment = async (paymentData) => {
  const payments = getPayments()

  const newPayment = {
    id: Math.max(...payments.map((p) => p.id), 0) + 1,
    transactionId: `TXN-${new Date().getFullYear()}-${String(Math.max(...payments.map((p) => Number.parseInt(p.transactionId.split("-")[2])), 0) + 1).padStart(3, "0")}`,
    customerId: paymentData.customerId,
    customerName: paymentData.customerName,
    amount: paymentData.amount,
    method: paymentData.method,
    status: paymentData.method === PAYMENT_METHODS.CASH ? PAYMENT_STATUS.COMPLETED : PAYMENT_STATUS.PROCESSING,
    date: new Date().toISOString(),
    description: paymentData.description,
    invoiceId: paymentData.invoiceId || null,
    gatewayTransactionId: paymentData.gatewayTransactionId || null,
    fees: paymentData.method === PAYMENT_METHODS.CASH ? 0 : paymentData.amount * 0.03, // 3% gateway fee
    netAmount: paymentData.method === PAYMENT_METHODS.CASH ? paymentData.amount : paymentData.amount * 0.97,
  }

  const updatedPayments = [...payments, newPayment]
  savePayments(updatedPayments)

  return newPayment
}

export const updatePaymentStatus = (paymentId, status, gatewayTransactionId = null) => {
  const payments = getPayments()
  const updatedPayments = payments.map((payment) =>
    payment.id === paymentId
      ? { ...payment, status, gatewayTransactionId: gatewayTransactionId || payment.gatewayTransactionId }
      : payment,
  )
  savePayments(updatedPayments)
  return updatedPayments.find((payment) => payment.id === paymentId)
}

export const generatePaymentLink = (linkData) => {
  const links = getPaymentLinks()

  const newLink = {
    id: Math.max(...links.map((l) => l.id), 0) + 1,
    linkId: `PL-${new Date().getFullYear()}-${String(Math.max(...links.map((l) => Number.parseInt(l.linkId.split("-")[2])), 0) + 1).padStart(3, "0")}`,
    customerId: linkData.customerId,
    customerName: linkData.customerName,
    amount: linkData.amount,
    description: linkData.description,
    status: "active",
    expiryDate: linkData.expiryDate,
    createdDate: new Date().toISOString().split("T")[0],
    url: `https://pay.gov-portal.com/link/${linkData.linkId || "new"}`,
    clicks: 0,
    paid: false,
  }

  const updatedLinks = [...links, newLink]
  savePaymentLinks(updatedLinks)

  return newLink
}

export const getPaymentStats = () => {
  const payments = getPayments()
  const today = new Date().toISOString().split("T")[0]
  const thisMonth = new Date().toISOString().slice(0, 7)

  const todayPayments = payments.filter((p) => p.date.startsWith(today))
  const monthPayments = payments.filter((p) => p.date.startsWith(thisMonth))
  const completedPayments = payments.filter((p) => p.status === PAYMENT_STATUS.COMPLETED)

  return {
    total: payments.length,
    completed: completedPayments.length,
    pending: payments.filter((p) => p.status === PAYMENT_STATUS.PENDING).length,
    failed: payments.filter((p) => p.status === PAYMENT_STATUS.FAILED).length,
    todayCount: todayPayments.length,
    todayAmount: todayPayments.reduce((sum, p) => sum + (p.status === PAYMENT_STATUS.COMPLETED ? p.amount : 0), 0),
    monthlyAmount: monthPayments.reduce((sum, p) => sum + (p.status === PAYMENT_STATUS.COMPLETED ? p.amount : 0), 0),
    totalAmount: completedPayments.reduce((sum, p) => sum + p.amount, 0),
    totalFees: completedPayments.reduce((sum, p) => sum + p.fees, 0),
    netAmount: completedPayments.reduce((sum, p) => sum + p.netAmount, 0),
  }
}
