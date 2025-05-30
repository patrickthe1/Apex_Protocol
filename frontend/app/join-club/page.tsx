"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function JoinClubPage() {
  const { user, isLoading: authLoading, joinClub, error: authError } = useAuth();
  const router = useRouter();
  const [passcode, setPasscode] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Check if user is already a member (only show after component is mounted and auth is stable)
  useEffect(() => {
    // Wait for auth to complete and give a moment for fresh data
    if (user && user.membershipStatus && !authLoading) {
      setStatus("success");
      setMessage("You are already a member of the Protocol!");
    }
  }, [user?.membershipStatus, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null);
    setStatus("loading");

    try {
      await joinClub(passcode);
      setStatus("success");
      setMessage("Welcome to the Protocol! Your membership has been activated.");
    } catch (err: any) {
      setStatus("error");
      setFormError(err.message || "Failed to join club. Please try again.");
      setMessage("Invalid access key. Please verify your credentials and try again.");
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect handled in useEffect above
  if (!user) {
    return null;
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

                {(authError || formError) && (
                  <p className="text-red-400 text-sm text-center">
                    {formError || authError}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                  disabled={!passcode.trim()}
                >
                  Activate Membership
                </Button>
              </form>
            )}

            {status === "loading" && (
              <div className="text-center space-y-4">
                <Loader2 className="h-16 w-16 text-purple-400 mx-auto animate-spin" />
                <h3 className="text-xl font-semibold text-white">Verifying Access Key</h3>
                <p className="text-slate-300">Please wait while we validate your credentials...</p>
              </div>
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
