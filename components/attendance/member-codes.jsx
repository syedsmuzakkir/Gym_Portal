"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Barcode, Plus, Search, Download, ToggleLeft, ToggleRight } from "lucide-react"

export default function MemberCodes({ memberCodes = [], onToggleStatus, onGenerateCode }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCode, setSelectedCode] = useState(null)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)

  const filteredCodes = memberCodes.filter(
    (code) =>
      code.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.qrCode.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Active
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Inactive
      </Badge>
    )
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case "employee":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Employee
          </Badge>
        )
      case "customer":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Customer
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleViewQR = (code) => {
    setSelectedCode(code)
    setIsQRModalOpen(true)
  }

  const generateQRCodeSVG = (text) => {
    // Simple QR code representation (dummy implementation)
    return `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <g fill="black">
          ${Array.from({ length: 20 }, (_, i) =>
            Array.from({ length: 20 }, (_, j) => {
              const shouldFill = (i + j + text.length) % 3 === 0
              return shouldFill ? `<rect x="${i * 10}" y="${j * 10}" width="10" height="10"/>` : ""
            }).join(""),
          ).join("")}
        </g>
        <text x="100" y="190" textAnchor="middle" fontSize="8" fill="black">${text}</text>
      </svg>
    `
  }

  const downloadQRCode = (code) => {
    const svg = generateQRCodeSVG(code.qrCode)
    const blob = new Blob([svg], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `qr-code-${code.memberId}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                Member Codes Management
              </CardTitle>
              <CardDescription>Manage QR codes and barcodes for attendance tracking</CardDescription>
            </div>
            <Button onClick={() => onGenerateCode && onGenerateCode()}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search member codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredCodes.length} of {memberCodes.length} codes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Member Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Member Codes Directory</CardTitle>
          <CardDescription>All generated QR codes and barcodes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCodes.map((code, index) => (
                  <motion.tr
                    key={code.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{code.memberName}</p>
                        <p className="text-sm text-muted-foreground">{code.memberId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(code.memberType)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <QrCode className="w-4 h-4 text-muted-foreground" />
                        <code className="text-xs bg-muted px-2 py-1 rounded">{code.qrCode}</code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Barcode className="w-4 h-4 text-muted-foreground" />
                        <code className="text-xs bg-muted px-2 py-1 rounded">{code.barcode}</code>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(code.isActive)}</TableCell>
                    <TableCell>{new Date(code.generatedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewQR(code)}>
                          <QrCode className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => downloadQRCode(code)}>
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onToggleStatus(code.id)}>
                          {code.isActive ? (
                            <ToggleRight className="w-3 h-3 mr-1 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-3 h-3 mr-1 text-red-600" />
                          )}
                          {code.isActive ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <QrCode className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No member codes found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
            <DialogDescription>
              {selectedCode?.memberName} ({selectedCode?.memberId})
            </DialogDescription>
          </DialogHeader>

          {selectedCode && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div
                  className="border rounded-lg p-4 bg-white"
                  dangerouslySetInnerHTML={{
                    __html: generateQRCodeSVG(selectedCode.qrCode),
                  }}
                />
              </div>

              <div className="space-y-2 text-center">
                <p className="text-sm font-medium">QR Code: {selectedCode.qrCode}</p>
                <p className="text-sm text-muted-foreground">Barcode: {selectedCode.barcode}</p>
                <div className="flex justify-center">{getStatusBadge(selectedCode.isActive)}</div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQRModalOpen(false)}>
              Close
            </Button>
            <Button onClick={() => selectedCode && downloadQRCode(selectedCode)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
