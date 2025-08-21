"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, Download } from "lucide-react"

export default function InvoiceGenerator({ isOpen, onClose, customer, onGenerate, isLoading = false }) {
  const [items, setItems] = useState([
    {
      description: `${customer?.subscription?.plan || "Basic"} Monthly Subscription`,
      quantity: 1,
      price: customer?.subscription?.price || 49,
    },
  ])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }])
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    const updatedItems = items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setItems(updatedItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const handleGenerate = () => {
    if (customer && items.length > 0) {
      onGenerate(customer.id, items)
    }
  }

  const handleDownloadPDF = () => {
    // Simulate PDF download
    const element = document.createElement("a")
    const file = new Blob([generateInvoiceHTML()], { type: "text/html" })
    element.href = URL.createObjectURL(file)
    element.download = `invoice-${customer?.customerId || "customer"}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const generateInvoiceHTML = () => {
    const total = calculateTotal()
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice - ${customer?.customerId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .invoice-details { margin-bottom: 30px; }
        .customer-details { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f5f5f5; }
        .total { text-align: right; font-size: 18px; font-weight: bold; }
        .footer { margin-top: 40px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Government Portal</h1>
        <h2>INVOICE</h2>
    </div>
    
    <div class="invoice-details">
        <p><strong>Invoice Number:</strong> INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}</p>
        <p><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
    </div>
    
    <div class="customer-details">
        <h3>Bill To:</h3>
        <p><strong>${customer?.name}</strong></p>
        <p>${customer?.email}</p>
        <p>${customer?.phone}</p>
        <p>${customer?.address}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${items
              .map(
                (item) => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>$${item.price}</td>
                    <td>$${item.price * item.quantity}</td>
                </tr>
            `,
              )
              .join("")}
        </tbody>
    </table>
    
    <div class="total">
        <p>Total Amount: $${total}</p>
    </div>
    
    <div class="footer">
        <p>Thank you for your business!</p>
        <p>Government Portal - Administrative System</p>
    </div>
</body>
</html>
    `
  }

  if (!customer) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for {customer.name} ({customer.customerId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>Name:</strong> {customer.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {customer.email}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Phone:</strong> {customer.phone}
                  </p>
                  <p>
                    <strong>Customer ID:</strong> {customer.customerId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Invoice Items</CardTitle>
                <Button onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-12 gap-4 items-end"
                >
                  <div className="col-span-5">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Input
                      id={`description-${index}`}
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`price-${index}`}>Price ($)</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Total</Label>
                    <p className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}

              <Separator />

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-lg font-semibold">Total Amount: ${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isLoading || items.length === 0}>
              {isLoading ? "Generating..." : "Generate Invoice"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
