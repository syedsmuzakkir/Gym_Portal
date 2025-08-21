"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, CreditCard, Banknote } from "lucide-react"
import { getSystemSettings } from "@/lib/settings"

export default function PaymentSettings() {
  const systemSettings = getSystemSettings()
  const [settings, setSettings] = useState(systemSettings.payments)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleGatewayChange = (gateway, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [gateway]: { ...prev[gateway], [field]: value },
    }))
    setHasChanges(true)
  }

  const toggleGateway = (gateway) => {
    const isEnabled = settings.enabledGateways.includes(gateway)
    const newGateways = isEnabled
      ? settings.enabledGateways.filter((g) => g !== gateway)
      : [...settings.enabledGateways, gateway]

    handleChange("enabledGateways", newGateways)
  }

  const handleSave = () => {
    console.log("[v0] Saving payment settings:", settings)
    setHasChanges(false)
  }

  const paymentMethods = [
    { id: "razorpay", name: "Razorpay", icon: CreditCard, color: "#3395FF" },
    { id: "stripe", name: "Stripe", icon: CreditCard, color: "#635BFF" },
    { id: "cash", name: "Cash Payment", icon: Banknote, color: "#10b981" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Default Gateway */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Payment Gateway</h3>
          <Select value={settings.defaultGateway} onValueChange={(value) => handleChange("defaultGateway", value)}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  <div className="flex items-center gap-2">
                    <method.icon className="h-4 w-4" style={{ color: method.color }} />
                    {method.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <div className="space-y-4">
            {paymentMethods.map((method) => {
              const isEnabled = settings.enabledGateways.includes(method.id)
              const gatewaySettings = settings[method.id]

              return (
                <Card key={method.id} className={`${isEnabled ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <method.icon className="h-6 w-6" style={{ color: method.color }} />
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-gray-600">
                            {method.id === "razorpay" && "Indian payment gateway with UPI, cards, and wallets"}
                            {method.id === "stripe" && "Global payment processing with cards and digital wallets"}
                            {method.id === "cash" && "In-person cash payments with manual verification"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isEnabled ? "default" : "secondary"}>
                          {isEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Switch checked={isEnabled} onCheckedChange={() => toggleGateway(method.id)} />
                      </div>
                    </div>

                    {isEnabled && gatewaySettings && (
                      <div className="space-y-3 pt-3 border-t">
                        {method.id === "razorpay" && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>Test Mode</Label>
                                <Switch
                                  checked={gatewaySettings.testMode}
                                  onCheckedChange={(checked) => handleGatewayChange("razorpay", "testMode", checked)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="razorpayKey">Key ID</Label>
                                <Input
                                  id="razorpayKey"
                                  value={gatewaySettings.keyId}
                                  onChange={(e) => handleGatewayChange("razorpay", "keyId", e.target.value)}
                                  placeholder="rzp_test_xxxxxxxxxx"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {method.id === "stripe" && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>Test Mode</Label>
                                <Switch
                                  checked={gatewaySettings.testMode}
                                  onCheckedChange={(checked) => handleGatewayChange("stripe", "testMode", checked)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="stripeKey">Publishable Key</Label>
                                <Input
                                  id="stripeKey"
                                  value={gatewaySettings.publishableKey}
                                  onChange={(e) => handleGatewayChange("stripe", "publishableKey", e.target.value)}
                                  placeholder="pk_test_xxxxxxxxxx"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {method.id === "cash" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Require Manager Approval</Label>
                              <Switch
                                checked={gatewaySettings.requireApproval}
                                onCheckedChange={(checked) => handleGatewayChange("cash", "requireApproval", checked)}
                              />
                            </div>
                            <p className="text-sm text-gray-600">
                              When enabled, cash payments require manager approval before being processed.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={!hasChanges} className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
