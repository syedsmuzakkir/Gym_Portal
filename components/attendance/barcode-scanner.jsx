"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Scan, Camera, CameraOff, CheckCircle, XCircle, Zap } from "lucide-react"

export default function BarcodeScanner({ onScan, isLoading = false, currentUser }) {
  const [isScanning, setIsScanning] = useState(false)
  const [manualCode, setManualCode] = useState("")
  const [scanResult, setScanResult] = useState(null)
  const [error, setError] = useState("")
  const videoRef = useRef(null)

  // Simulate camera access
  const startScanning = async () => {
    setIsScanning(true)
    setError("")
    setScanResult(null)

    // Simulate camera initialization delay
    setTimeout(() => {
      if (videoRef.current) {
        // Create a dummy video stream visualization
        videoRef.current.style.background = "linear-gradient(45deg, #1f2937, #374151)"
        videoRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full text-white">
            <div class="text-center">
              <div class="animate-pulse mb-4">
                <div class="w-16 h-16 border-2 border-white border-dashed rounded-lg mx-auto mb-2"></div>
                <p class="text-sm">Scanning for codes...</p>
              </div>
              <p class="text-xs opacity-75">Point camera at QR/Barcode</p>
            </div>
          </div>
        `
      }
    }, 500)
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (videoRef.current) {
      videoRef.current.innerHTML = ""
      videoRef.current.style.background = "#f3f4f6"
    }
  }

  const handleManualScan = async (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return

    setError("")
    setScanResult(null)

    try {
      const result = await onScan(manualCode.trim(), currentUser?.name || "System")
      setScanResult(result)
      setManualCode("")
    } catch (err) {
      setError(err.message)
    }
  }

  // Simulate successful scan after 3 seconds when scanning
  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        // Simulate scanning a random code
        const dummyCodes = ["QR-EMP001-2024", "QR-CUST001-2024", "123456789012", "123456789014"]
        const randomCode = dummyCodes[Math.floor(Math.random() * dummyCodes.length)]

        onScan(randomCode, currentUser?.name || "System")
          .then((result) => {
            setScanResult(result)
            stopScanning()
          })
          .catch((err) => {
            setError(err.message)
            stopScanning()
          })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isScanning, onScan, currentUser])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Scanner Interface */}
      <Card className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center text-xl sm:text-2xl">
            <div className="bg-primary/10 rounded-full p-2 mr-3">
              <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            Instant Check-In Scanner
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Scan your QR code or barcode to check in/out instantly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Camera View */}
          <div className="relative">
            <div
              ref={videoRef}
              className="w-full h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-muted to-muted/50 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden"
            >
              {!isScanning && (
                <div className="text-center text-muted-foreground">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                  </motion.div>
                  <p className="text-sm sm:text-base font-medium">Ready to scan</p>
                  <p className="text-xs sm:text-sm opacity-75">Camera preview will appear here</p>
                </div>
              )}
            </div>

            {/* Scanning Overlay */}
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl"
              >
                <motion.div
                  animate={{
                    y: [-30, 30, -30],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-3/4 sm:w-2/3 h-1 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg"
                />
              </motion.div>
            )}
          </div>

          {/* Scanner Controls */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            {!isScanning ? (
              <Button
                onClick={startScanning}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button
                onClick={stopScanning}
                variant="outline"
                size="lg"
                className="border-2 border-primary/30 hover:bg-primary/5 px-6 sm:px-8 py-3 rounded-xl bg-transparent"
              >
                <CameraOff className="w-5 h-5 mr-2" />
                Stop Scanning
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <Scan className="w-5 h-5 mr-2 text-primary" />
            Manual Code Entry
          </CardTitle>
          <CardDescription>Enter your member code manually if scanning doesn't work</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualScan} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Enter your member code..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                disabled={isLoading}
                className="flex-1 h-12 text-base rounded-xl border-2 focus:border-primary"
              />
              <Button
                type="submit"
                disabled={isLoading || !manualCode.trim()}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 sm:px-8 rounded-xl"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isLoading ? "Processing..." : "Check In"}
              </Button>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                <strong>Example codes:</strong> QR-EMP001-2024, QR-CUST001-2024, 123456789012
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Alert className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-semibold text-base">
                    {scanResult.type === "checkin" ? "✅ Checked In Successfully!" : "👋 Checked Out Successfully!"}
                  </p>
                  <p className="text-sm font-medium">
                    {scanResult.memberName} ({scanResult.memberId})
                  </p>
                  <p className="text-xs opacity-90">
                    {scanResult.type === "checkin"
                      ? `Checked in at ${new Date(scanResult.checkIn).toLocaleTimeString()}`
                      : `Checked out at ${new Date(scanResult.checkOut).toLocaleTimeString()}`}
                  </p>
                </div>
                <Badge
                  variant="default"
                  className={`${
                    scanResult.type === "checkin"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-blue-100 text-blue-800 border-blue-300"
                  } px-3 py-1 text-sm font-bold`}
                >
                  {scanResult.type === "checkin" ? "CHECKED IN" : "CHECKED OUT"}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Alert variant="destructive" className="shadow-lg">
            <XCircle className="h-5 w-5" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  )
}
