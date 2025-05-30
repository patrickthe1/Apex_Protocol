"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"

export default function NewMessagePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Message title is required"
    }
    if (!formData.content.trim()) {
      newErrors.content = "Message content is required"
    } else if (formData.content.trim().length < 50) {
      newErrors.content = "Message content must be at least 50 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Mock message creation - in real app, this would call an API
      alert("Message published successfully!")
      router.push("/dashboard")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Apex Protocol</span>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Share Strategic Insight</h1>
          <p className="text-slate-400">Contribute to the collective intelligence of the Protocol</p>
        </div>

        {/* Message Form */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">
                  Message Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  placeholder="Enter a compelling title for your insight..."
                />
                {errors.title && <p className="text-red-400 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-300">
                  Message Content
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 min-h-[200px] resize-none"
                  placeholder="Share your strategic insight, analysis, or intelligence. Be specific and actionable..."
                />
                <div className="flex justify-between items-center">
                  {errors.content && <p className="text-red-400 text-sm">{errors.content}</p>}
                  <p className="text-slate-500 text-sm ml-auto">{formData.content.length} characters (minimum 50)</p>
                </div>
              </div>

              <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/30">
                <h3 className="text-white font-medium mb-2">Publishing Guidelines</h3>
                <ul className="text-slate-400 text-sm space-y-1">
                  <li>• Focus on actionable strategic insights</li>
                  <li>• Provide specific analysis and reasoning</li>
                  <li>• Maintain professional tone and quality</li>
                  <li>• Respect confidentiality and legal boundaries</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!formData.title.trim() || !formData.content.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publish Message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-slate-800/30 border-slate-700 mt-6">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-2">Privacy & Attribution</h3>
            <p className="text-slate-400 text-sm">
              Your message will be visible to all users. Non-members will see the content anonymously, while verified
              members will see your full attribution and can engage directly with you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
