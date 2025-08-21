// Dummy customer data and management functions
export const DUMMY_CUSTOMERS = [
  {
    id: 1,
    customerId: "CUST001",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+1234567890",
    address: "123 Oak Street, City, State 12345",
    status: "active",
    joinDate: "2023-01-15",
    subscription: {
      type: "monthly",
      plan: "Premium",
      price: 99,
      startDate: "2023-01-15",
      endDate: "2024-01-15",
      status: "active",
    },
    totalPaid: 1188,
    lastPayment: "2023-12-15",
  },
  {
    id: 2,
    customerId: "CUST002",
    name: "Robert Smith",
    email: "robert.smith@email.com",
    phone: "+1234567891",
    address: "456 Pine Avenue, City, State 12345",
    status: "active",
    joinDate: "2023-03-20",
    subscription: {
      type: "monthly",
      plan: "Basic",
      price: 49,
      startDate: "2023-03-20",
      endDate: "2024-03-20",
      status: "active",
    },
    totalPaid: 490,
    lastPayment: "2023-12-20",
  },
  {
    id: 3,
    customerId: "CUST003",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1234567892",
    address: "789 Elm Street, City, State 12345",
    status: "inactive",
    joinDate: "2022-08-10",
    subscription: {
      type: "custom",
      plan: "Enterprise",
      price: 199,
      startDate: "2022-08-10",
      endDate: "2023-08-10",
      status: "expired",
    },
    totalPaid: 2388,
    lastPayment: "2023-07-10",
  },
  {
    id: 4,
    customerId: "CUST004",
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1234567893",
    address: "321 Maple Drive, City, State 12345",
    status: "active",
    joinDate: "2023-06-01",
    subscription: {
      type: "monthly",
      plan: "Premium",
      price: 99,
      startDate: "2023-06-01",
      endDate: "2024-06-01",
      status: "active",
    },
    totalPaid: 693,
    lastPayment: "2023-12-01",
  },
]

export const SUBSCRIPTION_PLANS = [
  {
    id: 1,
    name: "Basic",
    price: 49,
    duration: "monthly",
    features: ["Basic Support", "Standard Features", "Email Support"],
  },
  {
    id: 2,
    name: "Premium",
    price: 99,
    duration: "monthly",
    features: ["Priority Support", "Advanced Features", "Phone Support", "Analytics"],
  },
  {
    id: 3,
    name: "Enterprise",
    price: 199,
    duration: "monthly",
    features: ["24/7 Support", "All Features", "Dedicated Manager", "Custom Integration"],
  },
]

export const DUMMY_INVOICES = [
  {
    id: 1,
    invoiceNumber: "INV-2023-001",
    customerId: 1,
    customerName: "Alice Johnson",
    amount: 99,
    status: "paid",
    issueDate: "2023-12-15",
    dueDate: "2023-12-30",
    paidDate: "2023-12-16",
    items: [{ description: "Premium Monthly Subscription", quantity: 1, price: 99 }],
  },
  {
    id: 2,
    invoiceNumber: "INV-2023-002",
    customerId: 2,
    customerName: "Robert Smith",
    amount: 49,
    status: "paid",
    issueDate: "2023-12-20",
    dueDate: "2024-01-05",
    paidDate: "2023-12-21",
    items: [{ description: "Basic Monthly Subscription", quantity: 1, price: 49 }],
  },
  {
    id: 3,
    invoiceNumber: "INV-2023-003",
    customerId: 4,
    customerName: "David Wilson",
    amount: 99,
    status: "pending",
    issueDate: "2024-01-01",
    dueDate: "2024-01-15",
    paidDate: null,
    items: [{ description: "Premium Monthly Subscription", quantity: 1, price: 99 }],
  },
]

export const DUMMY_PAYMENTS = [
  {
    id: 1,
    customerId: 1,
    customerName: "Alice Johnson",
    amount: 99,
    method: "credit_card",
    status: "completed",
    date: "2023-12-16",
    transactionId: "TXN-001",
    invoiceId: 1,
  },
  {
    id: 2,
    customerId: 2,
    customerName: "Robert Smith",
    amount: 49,
    method: "bank_transfer",
    status: "completed",
    date: "2023-12-21",
    transactionId: "TXN-002",
    invoiceId: 2,
  },
  {
    id: 3,
    customerId: 1,
    customerName: "Alice Johnson",
    amount: 99,
    method: "credit_card",
    status: "completed",
    date: "2023-11-16",
    transactionId: "TXN-003",
    invoiceId: null,
  },
]

export const getCustomers = () => {
  if (typeof window === "undefined") return DUMMY_CUSTOMERS
  const stored = localStorage.getItem("customers")
  return stored ? JSON.parse(stored) : DUMMY_CUSTOMERS
}

export const saveCustomers = (customers) => {
  if (typeof window === "undefined") return
  localStorage.setItem("customers", JSON.stringify(customers))
}

export const getInvoices = () => {
  if (typeof window === "undefined") return DUMMY_INVOICES
  const stored = localStorage.getItem("invoices")
  return stored ? JSON.parse(stored) : DUMMY_INVOICES
}

export const saveInvoices = (invoices) => {
  if (typeof window === "undefined") return
  localStorage.setItem("invoices", JSON.stringify(invoices))
}

export const getPayments = () => {
  if (typeof window === "undefined") return DUMMY_PAYMENTS
  const stored = localStorage.getItem("payments")
  return stored ? JSON.parse(stored) : DUMMY_PAYMENTS
}

export const addCustomer = (customer) => {
  const customers = getCustomers()
  const newCustomer = {
    ...customer,
    id: Math.max(...customers.map((c) => c.id), 0) + 1,
    customerId: `CUST${String(Math.max(...customers.map((c) => Number.parseInt(c.customerId.slice(4))), 0) + 1).padStart(3, "0")}`,
    totalPaid: 0,
    lastPayment: null,
  }
  const updatedCustomers = [...customers, newCustomer]
  saveCustomers(updatedCustomers)
  return newCustomer
}

export const updateCustomer = (id, updates) => {
  const customers = getCustomers()
  const updatedCustomers = customers.map((customer) => (customer.id === id ? { ...customer, ...updates } : customer))
  saveCustomers(updatedCustomers)
  return updatedCustomers.find((customer) => customer.id === id)
}

export const deleteCustomer = (id) => {
  const customers = getCustomers()
  const updatedCustomers = customers.filter((customer) => customer.id !== id)
  saveCustomers(updatedCustomers)
  return true
}

export const getCustomerById = (id) => {
  const customers = getCustomers()
  return customers.find((customer) => customer.id === Number.parseInt(id))
}

export const generateInvoice = (customerId, items) => {
  const invoices = getInvoices()
  const customer = getCustomerById(customerId)

  const newInvoice = {
    id: Math.max(...invoices.map((i) => i.id), 0) + 1,
    invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.max(...invoices.map((i) => Number.parseInt(i.invoiceNumber.split("-")[2])), 0) + 1).padStart(3, "0")}`,
    customerId,
    customerName: customer.name,
    amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: "pending",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    paidDate: null,
    items,
  }

  const updatedInvoices = [...invoices, newInvoice]
  saveInvoices(updatedInvoices)
  return newInvoice
}

export const getCustomerPayments = (customerId) => {
  const payments = getPayments()
  return payments.filter((payment) => payment.customerId === customerId)
}

export const getCustomerInvoices = (customerId) => {
  const invoices = getInvoices()
  return invoices.filter((invoice) => invoice.customerId === customerId)
}
