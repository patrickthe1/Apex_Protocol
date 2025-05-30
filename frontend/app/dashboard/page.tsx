"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Plus, Eye, Trash2, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout, messages, isLoadingMessages, deleteMessage } = useAuth();

  // Debug: Log when DashboardPage renders and the state of user
  console.log('DashboardPage rendered. isLoading:', isLoading, 'User from useAuth():', user);

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('DashboardPage useEffect [user, isLoading, router] triggered. isLoading:', isLoading, 'User:', user);
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(messageId);
      } catch (error) {
        console.error('Failed to delete message:', error);
        alert('Failed to delete message. Please try again.');
      }
    }
  }

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
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
    console.log('DashboardPage: No user object, returning null (should be redirected by useEffect).');
    return null;
  }

  const isLoggedIn = !!user;
  // Correctly access membershipStatus and isAdmin from the user object as per TS type
  const isMember = user.membershipStatus; 
  const isAdmin = user.isAdmin;

  // Debug: Log user data and membership status
  console.log('DashboardPage - Calculated isMember:', isMember, 'isAdmin:', isAdmin, 'from user object:', user);

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

        {/* User Status Display */}
        <Card className="bg-slate-800/30 border-slate-700 mb-8">
          <CardContent className="p-4">
            <h3 className="text-white font-medium mb-3">Your Status</h3>
            <div className="flex flex-wrap gap-2">
              <div className={`px-3 py-1 rounded-full text-sm ${
                isMember 
                  ? "bg-purple-600/20 text-purple-400 border border-purple-600/30" 
                  : "bg-slate-600/20 text-slate-400 border border-slate-600/30"
              }`}>
                {isMember ? "✓ Member" : "Guest"}
              </div>
              {isAdmin && (
                <div className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-full text-sm">
                  ✓ Admin
                </div>
              )}
              {!isMember && (
                <Link href="/join-club">
                  <Button size="sm" variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600/10">
                    Join Club
                  </Button>
                </Link>
              )}
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
          {isLoadingMessages ? (
            // Loading state
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4 animate-pulse" />
              <p className="text-slate-400">Loading strategic insights...</p>
            </div>
          ) : messages.length === 0 ? (
            // Empty state
            <Card className="bg-slate-800/30 border-slate-700">
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No Messages Yet</h3>
                <p className="text-slate-400 mb-4">
                  Be the first to share strategic insights with the Protocol community.
                </p>
                <Link href="/new-message">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Message
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            // Messages list
            messages.map((message) => (
              <Card key={message.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {isMember && message.authorFullName ? (
                        <>
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {message.authorFullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="text-white font-medium">{message.authorFullName}</div>
                            <div className="text-slate-400 text-sm">Verified Member</div>
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
                      <span className="text-slate-400 text-sm">
                        {isMember ? formatTimestamp(message.timestamp) : "Time Hidden"}
                      </span>
                      {isAdmin && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">{message.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{message.textContent}</p>

                  {!isMember && (
                    <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                      <p className="text-slate-400 text-sm">
                        🔒 Join as a member to see author identity and engage directly with strategic minds.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More - Hidden for now, can be implemented later with pagination */}
        {messages.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm">
              Showing {messages.length} message{messages.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
