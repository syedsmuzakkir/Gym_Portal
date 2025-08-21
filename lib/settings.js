// System settings and configuration data
export const getSystemSettings = () => ({
  general: {
    portalName: "FitZone Gym Management",
    logo: "/gym-logo.png",
    contactEmail: "admin@fitzonegym.com",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Fitness Street, Gym City, GC 12345",
    timezone: "America/New_York",
    language: "en",
    currency: "USD",
  },

  subscription: {
    defaultPlan: "basic-monthly",
    allowCustomPlans: true,
    autoRenewal: true,
    gracePeriod: 7, // days
    prorationEnabled: true,
    trialPeriod: 14, // days
  },

  payments: {
    enabledGateways: ["razorpay", "stripe", "cash"],
    defaultGateway: "razorpay",
    razorpay: {
      enabled: true,
      testMode: true,
      keyId: "rzp_test_xxxxxxxxxx",
    },
    stripe: {
      enabled: true,
      testMode: true,
      publishableKey: "pk_test_xxxxxxxxxx",
    },
    cash: {
      enabled: true,
      requireApproval: true,
    },
  },

  attendance: {
    enabled: true,
    requireMemberCode: true,
    allowManualEntry: true,
    trackingMethod: "qr", // qr, barcode, both
    autoCheckout: true,
    maxSessionDuration: 240, // minutes
  },

  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    reminderSettings: {
      paymentDue: 3, // days before
      membershipExpiry: 7, // days before
      classReminder: 60, // minutes before
    },
  },

  security: {
    sessionTimeout: 30, // minutes
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    twoFactorAuth: false,
    loginAttempts: 5,
  },
})

export const getUserRoles = () => [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access and management",
    permissions: [
      "manage_users",
      "manage_settings",
      "view_reports",
      "manage_payments",
      "manage_subscriptions",
      "manage_attendance",
      "manage_meetings",
      "manage_communication",
    ],
    color: "#ef4444",
  },
  {
    id: "manager",
    name: "Manager",
    description: "Operational management and oversight",
    permissions: [
      "manage_users",
      "view_reports",
      "manage_payments",
      "manage_subscriptions",
      "manage_attendance",
      "manage_meetings",
      "manage_communication",
    ],
    color: "#f59e0b",
  },
  {
    id: "trainer",
    name: "Personal Trainer",
    description: "Member training and consultation",
    permissions: ["view_members", "manage_attendance", "manage_meetings", "view_communication"],
    color: "#10b981",
  },
  {
    id: "receptionist",
    name: "Receptionist",
    description: "Front desk and member services",
    permissions: ["view_members", "manage_attendance", "view_payments", "view_communication"],
    color: "#06b6d4",
  },
  {
    id: "maintenance",
    name: "Maintenance Staff",
    description: "Equipment and facility maintenance",
    permissions: ["view_communication", "manage_meetings"],
    color: "#8b5cf6",
  },
]

export const getSubscriptionPlans = () => [
  {
    id: "basic-monthly",
    name: "Basic Monthly",
    price: 29.99,
    duration: 30,
    features: ["Gym Access", "Basic Equipment", "Locker Access"],
    isDefault: true,
  },
  {
    id: "premium-monthly",
    name: "Premium Monthly",
    price: 49.99,
    duration: 30,
    features: ["Gym Access", "All Equipment", "Classes", "Personal Training (2 sessions)", "Locker Access"],
    isDefault: false,
  },
  {
    id: "basic-annual",
    name: "Basic Annual",
    price: 299.99,
    duration: 365,
    features: ["Gym Access", "Basic Equipment", "Locker Access", "2 Months Free"],
    isDefault: false,
  },
  {
    id: "premium-annual",
    name: "Premium Annual",
    price: 499.99,
    duration: 365,
    features: [
      "Gym Access",
      "All Equipment",
      "Classes",
      "Personal Training (24 sessions)",
      "Locker Access",
      "2 Months Free",
    ],
    isDefault: false,
  },
]
