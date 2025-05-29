"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const { login, isLoading: authLoading, error: authError, user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);

  // Handle signup success message
  useEffect(() => {
    if (searchParams.get('signupSuccess') === 'true') {
      setSignupSuccessMessage("Account created successfully! Please log in.");
      router.replace('/login', undefined);
    }
  }, [searchParams, router]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User already authenticated, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  // For now, let's add a manual logout button to clear any stale sessions
  const handleManualLogout = async () => {
    try {
      await logout();
      setFormError(null);
      setSignupSuccessMessage(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSignupSuccessMessage(null);

    if (validateForm()) {
      try {
        await login(formData.email, formData.password);
      } catch (err: any) {
        setFormError(err.message || "Login failed. Please check your credentials.");
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setFormError(null);
    setSignupSuccessMessage(null);
  };

  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">Apex Protocol</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to access your account</p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">Sign In</CardTitle>
            {signupSuccessMessage && (
              <CardDescription className="text-green-400 text-center pt-2">
                {signupSuccessMessage}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  placeholder="john@example.com"
                  required
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>
              
              {(authError || formError) && (
                <p className="text-red-400 text-sm text-center">
                  {formError || authError} 
                </p>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3" disabled={authLoading}>
                {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {authLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400">
                Don\'t have an account?{" "}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
