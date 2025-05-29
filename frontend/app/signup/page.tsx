"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const { signup, isLoading: authLoading, error: authError } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (validateForm()) {
      try {
        await signup(formData.firstName, formData.lastName, formData.email, formData.password);
        router.push('/login?signupSuccess=true');
      } catch (err: any) {
        setFormError(err.message || "Failed to create account. Please try again.");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
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
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Join the strategic intelligence network</p>
        </div>

        {/* Sign Up Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-300">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-400 text-sm">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-400 text-sm">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>

              {formError && <p className="text-red-400 text-sm text-center">{formError}</p>} 
              {authError && !formError && <p className="text-red-400 text-sm text-center">{authError}</p>}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" disabled={authLoading}>
                {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {authLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
