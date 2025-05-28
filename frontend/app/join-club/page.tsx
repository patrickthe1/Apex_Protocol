"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, Lock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function JoinClubPage() {
  const [passcode, setPasscode] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock passcode validation
    if (passcode === "APEX2024") {
      setStatus("success")
      setMessage("Welcome to the Protocol! Your membership has been activated.")
      localStorage.setItem("isMember", "true")
    } else {
      setStatus("error")
      setMessage("Invalid access key. Please verify your credentials and try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Apex Protocol</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join The Protocol</h1>
          <p className="text-slate-400">Enter your exclusive access key to unlock member privileges</p>
        </div>

        {/* Membership Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center flex items-center justify-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Member Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status === "idle" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="passcode" className="text-slate-300">
                    Access Key
                  </Label>
                  <Input
                    id="passcode"
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 text-center tracking-widest"
                    placeholder="Enter your access key..."
                    required
                  />
                  <p className="text-slate-500 text-sm text-center">
                    Access keys are provided to verified strategic professionals
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                  disabled={!passcode.trim()}
                >
                  Activate Membership
                </Button>
              </form>
            )}

            {status === "success" && (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
                <h3 className="text-xl font-semibold text-white">Access Granted</h3>
                <p className="text-slate-300">{message}</p>
                <Link href="/dashboard">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Enter Dashboard</Button>
                </Link>
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
                    setPasscode("")
                    setMessage("")
                  }}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Try Again
                </Button>
              </div>
            )}

            <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
              <h4 className="text-white font-medium mb-2">Need Access?</h4>
              <p className="text-slate-400 text-sm">
                Membership is by invitation only. Contact your network administrator or reach out through official
                channels for access consideration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
