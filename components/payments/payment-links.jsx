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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { generatePaymentLink } from "@/lib/payments"
import { Link, Plus, Copy, ExternalLink, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PaymentLinks({ paymentLinks = [], onRefresh, customers = [] }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [expiryDays, setExpiryDays] = useState("30")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleCreateLink = async (e) => {
    e.preventDefault()
    if (!selectedCustomer || !amount || !description) return

    setIsLoading(true)
    try {
      const customer = customers.find((c) => c.id === Number.parseInt(selectedCustomer))
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + Number.parseInt(expiryDays))

      const linkData = {
        customerId: customer.id,
        customerName: customer.name,
        amount: Number.parseFloat(amount),
        description,
        expiryDate: expiryDate.toISOString().split("T")[0],
      }

      generatePaymentLink(linkData)
      onRefresh && onRefresh()

      setIsCreateModalOpen(false)
      setSelectedCustomer("")
      setAmount("")
      setDescription("")
      setExpiryDays("30")

      toast({
        title: "Success",
        description: "Payment link created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Payment link copied to clipboard",
    })
  }

  const getStatusBadge = (status, expiryDate) => {
    const isExpired = new Date(expiryDate) < new Date()

    if (isExpired) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Expired
        </Badge>
      )
    }

    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Paid
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Payment Links
              </CardTitle>
              <CardDescription>Generate and manage direct payment links for customers</CardDescription>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Link
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Payment Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Payment Links</CardTitle>
          <CardDescription>All generated payment links and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentLinks.map((link, index) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-sm">{link.linkId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{link.customerName}</p>
                        <p className="text-sm text-muted-foreground">ID: {link.customerId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">${link.amount}</TableCell>
                    <TableCell className="max-w-xs truncate">{link.description}</TableCell>
                    <TableCell>{getStatusBadge(link.status, link.expiryDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{new Date(link.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>{link.clicks}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.url)}>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => window.open(link.url, "_blank")}>
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {paymentLinks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payment links created yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Payment Link Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Payment Link</DialogTitle>
            <DialogDescription>Generate a direct payment link for a customer</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <select
                id="customer"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.customerId})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDays">Expires in (days)</Label>
              <Input
                id="expiryDays"
                type="number"
                min="1"
                max="365"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
