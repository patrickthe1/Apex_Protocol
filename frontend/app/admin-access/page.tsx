"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, Key, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

export default function AdminAccessPage() {
  const { user, grantAdminRole } = useAuth()
  const router = useRouter()
  const [adminCode, setAdminCode] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setStatus("error")
      setMessage("You must be logged in to request admin access.")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      await grantAdminRole(adminCode)
      setStatus("success")
      setMessage("Admin privileges successfully granted. You now have full administrative access.")
    } catch (error) {
      setStatus("error")
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage("Failed to grant admin access. Please check your admin code and try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/dashboard" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Apex Protocol</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-slate-400">Enter administrative credentials to access system controls</p>
        </div>

        {/* Admin Access Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Administrative Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === "idle" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="adminCode" className="text-slate-300">
                    Admin Secret Code
                  </Label>
                  <Input
                    id="adminCode"
                    type="password"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-red-500 text-center tracking-widest"
                    placeholder="Enter admin code..."
                    required
                  />
                  <p className="text-slate-500 text-sm text-center">
                    Administrative codes are restricted to authorized personnel only
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
                  disabled={!adminCode.trim()}
                >
                  Activate Admin Access
                </Button>
              </form>
            )}

            {status === "loading" && (
              <div className="text-center space-y-4">
                <Loader2 className="h-16 w-16 text-blue-400 mx-auto animate-spin" />
                <h3 className="text-xl font-semibold text-white">Processing Request</h3>
                <p className="text-slate-300">Validating admin credentials...</p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white">Admin Access Granted</h3>
                <p className="text-slate-300">{message}</p>
                <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">
                    ✓ Admin role successfully assigned to your account
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    // Force a complete page refresh to ensure updated auth state
                    window.location.href = "/dashboard";
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Return to Dashboard
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="text-center space-y-4">
                <XCircle className="h-16 w-16 text-red-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white">Access Denied</h3>
                <p className="text-slate-300">{message}</p>
                <Button
                  onClick={() => {
                    setStatus("idle")
                    setAdminCode("")
                    setMessage("")
                  }}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Try Again
                </Button>
              </div>
            )}

            <div className="mt-6 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
              <h4 className="text-red-400 font-medium mb-2">⚠️ Security Notice</h4>
              <p className="text-slate-400 text-sm">
                Administrative access provides full system control including user management, content moderation, and
                system configuration. Unauthorized access attempts are logged and monitored.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
