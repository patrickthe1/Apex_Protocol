"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Plus, Eye, Trash2, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check authentication status from localStorage (mock)
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true")
    setIsMember(localStorage.getItem("isMember") === "true")
    setIsAdmin(localStorage.getItem("isAdmin") === "true")
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("isMember")
    localStorage.removeItem("isAdmin")
    router.push("/")
  }

  const mockMessages = [
    {
      id: 1,
      title: "The Future of Decentralized Finance",
      content:
        "Recent developments in DeFi protocols suggest a paradigm shift that most aren't seeing yet. The convergence of institutional adoption and regulatory clarity is creating unprecedented opportunities for strategic positioning.",
      author: "Sarah Chen",
      authorTitle: "CTO, Blockchain Ventures",
      timestamp: "2 hours ago",
      isOwn: false,
    },
    {
      id: 2,
      title: "Strategic Market Positioning in Q4",
      content:
        "Three key indicators point to an unprecedented opportunity in emerging markets. The correlation between geopolitical stability and tech infrastructure investment is reaching an inflection point.",
      author: "Marcus Rodriguez",
      authorTitle: "Managing Partner, Global Strategy",
      timestamp: "4 hours ago",
      isOwn: false,
    },
    {
      id: 3,
      title: "AI Infrastructure Investment Thesis",
      content:
        "The next wave of AI infrastructure will be built on principles that current players are ignoring. Edge computing combined with specialized hardware creates a moat that's still available to capture.",
      author: "Dr. Emily Watson",
      authorTitle: "Head of AI Research",
      timestamp: "6 hours ago",
      isOwn: true,
    },
    {
      id: 4,
      title: "Regulatory Arbitrage Opportunities",
      content:
        "Cross-jurisdictional analysis reveals significant gaps that sophisticated players can leverage. The window is closing, but there's still time for strategic positioning.",
      author: "James Liu",
      authorTitle: "Regulatory Affairs Director",
      timestamp: "8 hours ago",
      isOwn: false,
    },
    {
      id: 5,
      title: "Supply Chain Disruption Patterns",
      content:
        "Analyzing 15 years of supply chain data reveals predictable patterns that most companies miss. The next disruption is already visible if you know where to look.",
      author: "Anna Kowalski",
      authorTitle: "Supply Chain Strategist",
      timestamp: "12 hours ago",
      isOwn: false,
    },
  ]

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-800/50 border-slate-700 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Required</h2>
            <p className="text-slate-300 mb-6">Please sign in to access the dashboard.</p>
            <Link href="/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Apex Protocol</span>
              <div className="flex items-center space-x-2 ml-4">
                {isMember && (
                  <span className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full border border-purple-600/30">
                    MEMBER
                  </span>
                )}
                {isAdmin && (
                  <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full border border-red-600/30">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/new-message">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Message
                </Button>
              </Link>
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Strategic Intelligence Feed</h1>
          <p className="text-slate-400">
            {isMember
              ? "Full access to verified insights and author identities"
              : "Anonymous insights from strategic minds"}
          </p>
        </div>

        {/* Status Toggle Controls (for demo purposes) */}
        <Card className="bg-slate-800/30 border-slate-700 mb-8">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-3">Demo Controls (Toggle Status)</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={isMember ? "default" : "outline"}
                onClick={() => {
                  const newStatus = !isMember
                  setIsMember(newStatus)
                  localStorage.setItem("isMember", newStatus.toString())
                }}
                className={isMember ? "bg-purple-600" : "border-purple-600 text-purple-400"}
              >
                {isMember ? "✓ Member" : "Become Member"}
              </Button>
              <Button
                size="sm"
                variant={isAdmin ? "default" : "outline"}
                onClick={() => {
                  const newStatus = !isAdmin
                  setIsAdmin(newStatus)
                  localStorage.setItem("isAdmin", newStatus.toString())
                }}
                className={isAdmin ? "bg-red-600" : "border-red-600 text-red-400"}
              >
                {isAdmin ? "✓ Admin" : "Enable Admin"}
              </Button>
              <Link href="/admin-access">
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-400">
                  Admin Access Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Messages Feed */}
        <div className="space-y-6">
          {mockMessages.map((message) => (
            <Card key={message.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {isMember ? (
                      <>
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {message.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="text-white font-medium">{message.author}</div>
                          <div className="text-slate-400 text-sm">{message.authorTitle}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                          <Eye className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="text-slate-400 font-medium">Anonymous User</div>
                          <div className="text-slate-500 text-sm">Identity Hidden</div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-sm">{isMember ? message.timestamp : "Time Hidden"}</span>
                    {isAdmin && (
                      <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{message.title}</h3>
                <p className="text-slate-300 leading-relaxed">{message.content}</p>

                {!isMember && (
                  <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                    <p className="text-slate-400 text-sm">
                      🔒 Join as a member to see author identity and engage directly with strategic minds.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
            Load More Insights
          </Button>
        </div>
      </div>
    </div>
  )
}
