// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { motion } from "framer-motion"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { authenticateUser, setCurrentUser, getCurrentUser } from "@/lib/auth"
// import { Dumbbell, Mail, Phone, Lock } from "lucide-react"

// export default function LoginPage() {
//   const [identifier, setIdentifier] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [loginType, setLoginType] = useState("email")
//   const router = useRouter()

//   useEffect(() => {
//     // Redirect if already authenticated
//     const user = getCurrentUser()
//     if (user) {
//       router.push("/dashboard")
//     }
//   }, [router])

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError("")

//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     const user = authenticateUser(identifier, password)

//     if (user) {
//       setCurrentUser(user)
//       router.push("/dashboard")
//     } else {
//       setError("Invalid credentials. Please try again.")
//     }

//     setIsLoading(false)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-3 sm:p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="w-full max-w-sm sm:max-w-md"
//       >
//         <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
//           <CardHeader className="text-center space-y-4 px-4 sm:px-6">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
//               className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
//             >
//               <Dumbbell className="w-8 h-8 text-white" />
//             </motion.div>
//             <div>
//               <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">FitGym Pro</CardTitle>
//               <CardDescription className="text-slate-600 text-sm">Gym Management System</CardDescription>
//             </div>
//           </CardHeader>

//           <CardContent className="space-y-6 px-4 sm:px-6 pb-6">
//             {error && (
//               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
//                 <Alert variant="destructive">
//                   <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//               </motion.div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="identifier" className="text-sm font-medium text-slate-700">
//                   Email or Phone
//                 </Label>
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                     {loginType === "email" ? (
//                       <Mail className="w-4 h-4 text-slate-400" />
//                     ) : (
//                       <Phone className="w-4 h-4 text-slate-400" />
//                     )}
//                   </div>
//                   <Input
//                     id="identifier"
//                     type={loginType === "email" ? "email" : "tel"}
//                     placeholder={loginType === "email" ? "admin@fitgym.com" : "+1234567890"}
//                     value={identifier}
//                     onChange={(e) => {
//                       setIdentifier(e.target.value)
//                       setLoginType(e.target.value.includes("@") ? "email" : "phone")
//                     }}
//                     className="pl-10 h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-sm font-medium text-slate-700">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//                     <Lock className="w-4 h-4 text-slate-400" />
//                   </div>
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10 h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
//                     required
//                   />
//                 </div>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>Signing in...</span>
//                   </div>
//                 ) : (
//                   "Sign In"
//                 )}
//               </Button>
//             </form>

//             <div className="text-center text-slate-600">
//               <p className="mb-2 text-sm font-medium">Demo Credentials:</p>
//               <div className="space-y-1 text-xs bg-slate-50 rounded-lg p-3">
//                 <p>
//                   <strong>Admin:</strong> admin@gmail.com / admin123
//                 </p>
//                 <p>
//                   <strong>Manager:</strong> manager@gmail.com / manager123
//                 </p>
//                 <p>
//                   <strong>Trainer:</strong> trainer@gmail.com / trainer123
//                 </p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   )
// }





"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { authenticateUser, setCurrentUser, getCurrentUser } from "@/lib/auth"
import { Dumbbell, Mail, Phone, Lock } from "lucide-react"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginType, setLoginType] = useState("email")
  const router = useRouter()

  useEffect(() => {
    // Redirect if already authenticated
    const user = getCurrentUser()
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = authenticateUser(identifier, password)

    if (user) {
      setCurrentUser(user)
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Please try again.")
    }

    setIsLoading(false)
  }

  // Determine input type based on content
  const getInputType = (value) => {
    // If empty, default to email type
    if (!value) return "email"
    
    // If it contains @, it's definitely an email
    if (value.includes("@")) return "email"
    
    // If it contains letters, treat as email (to avoid numeric keyboard)
    if (/[a-zA-Z]/.test(value)) return "email"
    
    // Otherwise, treat as phone but use text input to avoid numeric keyboard
    return "text"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 px-4 sm:px-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <Dumbbell className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">FitGym Pro</CardTitle>
              <CardDescription className="text-slate-600 text-sm">Gym Management System</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-4 sm:px-6 pb-6">
            {error && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium text-slate-700">
                  Email or Phone
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    {getInputType(identifier) === "email" ? (
                      <Mail className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Phone className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <Input
                    id="identifier"
                    type={getInputType(identifier)}
                    inputMode={getInputType(identifier) === "text" ? "tel" : "email"}
                    placeholder="Enter email or phone number"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value)
                      setLoginType(getInputType(e.target.value))
                    }}
                    className="pl-10 h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center text-slate-600">
              <p className="mb-2 text-sm font-medium">Demo Credentials:</p>
              <div className="space-y-1 text-xs bg-slate-50 rounded-lg p-3">
                <p>
                  <strong>Admin:</strong> admin@gmail.com / admin123
                </p>
                <p>
                  <strong>Manager:</strong> manager@gmail.com / manager123
                </p>
                <p>
                  <strong>Trainer:</strong> trainer@gmail.com / trainer123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}