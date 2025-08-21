"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import ChatModal from "@/components/chat/chat-modal"
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  FileText,
  CreditCard,
  MessageCircle,
  DollarSign,
} from "lucide-react"

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
  onGenerateInvoice,
  onViewPayments,
  onMakePayment,
}) {
  const [deleteCustomer, setDeleteCustomer] = useState(null)
  const [chatUser, setChatUser] = useState(null)

  const handleDelete = () => {
    if (deleteCustomer) {
      onDelete(deleteCustomer.id)
      setDeleteCustomer(null)
    }
  }

  const getStatusBadge = (status) => {
    return status === "active" ? (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
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
    <>
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="hidden sm:table-cell font-semibold">Subscription</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Total Paid</TableHead>
                <TableHead className="hidden lg:table-cell font-semibold">Last Payment</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={customer.photo || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate">{customer.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                        <div className="sm:hidden mt-1 space-y-1">
                          {getSubscriptionBadge(customer.subscription)}
                          <p className="text-xs text-muted-foreground">
                            ${customer.subscription.price}/month • ${customer.totalPaid?.toLocaleString() || 0} total
                          </p>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="space-y-1">
                      {getSubscriptionBadge(customer.subscription)}
                      <p className="text-xs text-muted-foreground">${customer.subscription.price}/month</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    ${customer.totalPaid?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {customer.lastPayment ? new Date(customer.lastPayment).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMakePayment(customer)}
                        className="h-8 w-8 p-0 hover:bg-green-100 sm:hidden"
                      >
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setChatUser(customer)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 sm:hidden"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onView(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setChatUser(customer)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(customer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onMakePayment(customer)}>
                            <DollarSign className="mr-2 h-4 w-4" />
                            Make Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onGenerateInvoice(customer)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onViewPayments(customer)}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Payment History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onToggleStatus(customer.id, customer.status)}>
                            {customer.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setDeleteCustomer(customer)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {chatUser && <ChatModal user={chatUser} onClose={() => setChatUser(null)} />}

      <AlertDialog open={!!deleteCustomer} onOpenChange={() => setDeleteCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer record for{" "}
              <strong>{deleteCustomer?.name}</strong> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
