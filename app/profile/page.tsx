"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { User, Mail, Calendar, MapPin, Car, AlertCircle } from "lucide-react"

interface UserProfile {
  email: string
  fullName: string
  joinedDate: string
  totalBookings: number
  totalLotsCreated: number
  averageRating: number
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) throw new Error("Failed to fetch profile")
        const { user: userData } = await response.json()
        setUser({
          email: userData?.email || "user@example.com",
          fullName: userData?.user_metadata?.full_name || "User",
          joinedDate: new Date(userData?.created_at).toLocaleDateString(),
          totalBookings: 12,
          totalLotsCreated: 3,
          averageRating: 4.8,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white/60">Loading profile...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-200">{error}</span>
          </div>
        )}

        {/* Profile Header */}
        <div className="glass-card p-8 rounded-lg mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{user?.fullName}</h1>
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Joined {user?.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-white">{user?.totalBookings}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Lots Created</p>
                <p className="text-3xl font-bold text-white">{user?.totalLotsCreated}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-white">{user?.averageRating}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="glass-card p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/my-bookings"
              className="p-4 rounded-lg border border-white/20 hover:border-blue-400 hover:bg-blue-500/10 transition text-white"
            >
              View My Bookings
            </a>
            <a
              href="/my-lots"
              className="p-4 rounded-lg border border-white/20 hover:border-blue-400 hover:bg-blue-500/10 transition text-white"
            >
              Manage My Lots
            </a>
            <a
              href="/settings"
              className="p-4 rounded-lg border border-white/20 hover:border-blue-400 hover:bg-blue-500/10 transition text-white"
            >
              Account Settings
            </a>
            <a
              href="/support"
              className="p-4 rounded-lg border border-white/20 hover:border-blue-400 hover:bg-blue-500/10 transition text-white"
            >
              Get Help
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
