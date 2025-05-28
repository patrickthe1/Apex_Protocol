"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Eye, Users, ArrowRight, Lock, Zap } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const mockMessages = [
    {
      id: 1,
      title: "The Future of Decentralized Finance",
      preview: "Recent developments in DeFi protocols suggest a paradigm shift that most aren't seeing yet...",
      isAnonymous: true,
    },
    {
      id: 2,
      title: "Strategic Market Positioning in Q4",
      preview: "Three key indicators point to an unprecedented opportunity in emerging markets...",
      isAnonymous: true,
    },
    {
      id: 3,
      title: "AI Infrastructure Investment Thesis",
      preview: "The next wave of AI infrastructure will be built on principles that current players are ignoring...",
      isAnonymous: true,
    },
    {
      id: 4,
      title: "Regulatory Arbitrage Opportunities",
      preview: "Cross-jurisdictional analysis reveals significant gaps that sophisticated players can leverage...",
      isAnonymous: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">Apex Protocol</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Strategic Minds.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Anonymous Insights.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            An exclusive platform where verified strategists share high-signal intelligence. Public anonymity meets
            member transparency in the ultimate knowledge exchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Sign Up <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/join-club">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500 text-purple-400 hover:bg-purple-500/10 px-8 py-4 text-lg"
              >
                Join The Protocol <Lock className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Apex Protocol?</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              The intersection of anonymity and accountability creates the perfect environment for authentic strategic
              discourse.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-8 text-center">
                <Eye className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Anonymous by Default</h3>
                <p className="text-slate-300">
                  Share insights without bias. Public viewers see content, not creators, ensuring ideas stand on merit
                  alone.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">Verified Community</h3>
                <p className="text-slate-300">
                  Members see full attribution and can engage directly with verified strategic minds in their network.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-8 text-center">
                <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">High-Signal Content</h3>
                <p className="text-slate-300">
                  Curated insights from proven strategists. No noise, no fluff—only actionable intelligence that
                  matters.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Unlock the Full Protocol</h2>
              <p className="text-xl text-slate-300 mb-8">
                Verified members gain access to the complete strategic intelligence network with full transparency and
                direct engagement.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-4"></div>
                  See author identities and credentials
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-4"></div>
                  Direct messaging with strategic minds
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-4"></div>
                  Access to member-only discussions
                </li>
                <li className="flex items-center text-slate-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-4"></div>
                  Priority access to exclusive insights
                </li>
              </ul>
              <Link href="/join-club">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Request Membership Access
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-2xl"></div>
              <Card className="relative bg-slate-800/80 border-slate-700">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Member View</span>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <div>
                          <div className="text-white font-medium">Sarah Chen, CTO</div>
                          <div className="text-slate-400 text-sm">2 hours ago</div>
                        </div>
                      </div>
                      <p className="text-slate-300">
                        "The convergence of AI and blockchain infrastructure presents a unique arbitrage opportunity
                        that most VCs are missing..."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Anonymous Content Teaser */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Latest Strategic Insights</h2>
            <p className="text-xl text-slate-300">Preview the caliber of intelligence shared within the Protocol</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {mockMessages.map((message) => (
              <Card
                key={message.id}
                className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                        <Eye className="h-4 w-4 text-slate-400" />
                      </div>
                      <span className="text-slate-400 text-sm">Anonymous User</span>
                    </div>
                    <span className="text-slate-500 text-sm">Time Hidden</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{message.title}</h3>
                  <p className="text-slate-300 mb-4">{message.preview}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-sm">Join to see full content & author</span>
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Apex Protocol</span>
          </div>
          <p className="text-slate-400">Strategic intelligence for the discerning mind.</p>
        </div>
      </footer>
    </div>
  )
}
