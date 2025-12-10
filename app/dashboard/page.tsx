"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WelcomeSection from "@/components/dashboard/welcome-section"
import StatsCards from "@/components/dashboard/stats-cards"
import ActiveBookingCard from "@/components/dashboard/active-booking-card"
import UpcomingBookings from "@/components/dashboard/upcoming-bookings"
import RecentActivity from "@/components/dashboard/recent-activity"
import FavoriteLots from "@/components/dashboard/favorite-lots"
import QuickActions from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  const [userData, setUserData] = useState(null)
  const [stats, setStats] = useState(null)
  const [activeBooking, setActiveBooking] = useState(null)
  const [upcomingBookings, setUpcomingBookings] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [favoriteLots, setFavoriteLots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[v0] Starting dashboard data fetch...")

        const [userRes, statsRes, activeRes, upcomingRes, activityRes, favoritesRes] = await Promise.all([
          fetch("/api/auth/me").catch((err) => {
            console.error("[v0] Error fetching /api/auth/me:", err)
            throw err
          }),
          fetch("/api/bookings/stats").catch((err) => {
            console.error("[v0] Error fetching /api/bookings/stats:", err)
            throw err
          }),
          fetch("/api/bookings?status=active").catch((err) => {
            console.error("[v0] Error fetching active bookings:", err)
            throw err
          }),
          fetch("/api/bookings?status=upcoming").catch((err) => {
            console.error("[v0] Error fetching upcoming bookings:", err)
            throw err
          }),
          fetch("/api/bookings/history").catch((err) => {
            console.error("[v0] Error fetching history:", err)
            throw err
          }),
          fetch("/api/favorites").catch((err) => {
            console.error("[v0] Error fetching favorites:", err)
            throw err
          }),
        ])

        console.log("[v0] User response status:", userRes.status)
        console.log("[v0] Stats response status:", statsRes.status)

        if (!statsRes.ok) {
          throw new Error(`Stats fetch failed with status ${statsRes.status}`)
        }

        const userData = userRes.ok ? await userRes.json() : null
        const stats = await statsRes.json()
        const activeData = activeRes.ok ? await activeRes.json() : { data: [] }
        const upcomingData = upcomingRes.ok ? await upcomingRes.json() : { data: [] }
        const activityData = activityRes.ok ? await activityRes.json() : { data: [] }
        const favoritesData = favoritesRes.ok ? await favoritesRes.json() : { data: [] }

        console.log("[v0] Dashboard data fetched successfully")

        setUserData(userData?.user || userData)
        setStats(stats)
        setActiveBooking(Array.isArray(activeData) ? activeData[0] : activeData.data?.[0] || null)
        setUpcomingBookings(Array.isArray(upcomingData) ? upcomingData : upcomingData.data || [])
        setRecentActivity(Array.isArray(activityData) ? activityData : activityData.data || [])
        setFavoriteLots(Array.isArray(favoritesData) ? favoritesData : favoritesData.data || [])
      } catch (err) {
        console.error("[v0] Dashboard fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <main className="w-full min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading your dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="w-full min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-8 max-w-md text-center">
            <p className="text-destructive mb-4">Error loading dashboard: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {userData && <WelcomeSection user={userData} />}
        {stats && <StatsCards stats={stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            {activeBooking ? (
              <ActiveBookingCard booking={activeBooking} />
            ) : (
              <div className="glass-card p-8 text-center">
                <p className="text-foreground/70 mb-4">No active bookings at the moment</p>
                <a
                  href="/browse"
                  className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  Browse Lots
                </a>
              </div>
            )}

            {upcomingBookings.length > 0 && (
              <div className="mt-8">
                <UpcomingBookings bookings={upcomingBookings} />
              </div>
            )}

            {recentActivity.length > 0 && (
              <div className="mt-8">
                <RecentActivity activities={recentActivity} />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">{favoriteLots.length > 0 && <FavoriteLots lots={favoriteLots} />}</div>
        </div>

        <div className="mt-12">
          <QuickActions />
        </div>
      </div>
      <Footer />
    </main>
  )
}
