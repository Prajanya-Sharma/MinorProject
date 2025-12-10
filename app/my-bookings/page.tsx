"use client"
import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { BookingCard } from "@/components/booking-card"
import { BookingFilters } from "@/components/booking-filters"
import Link from "next/link"

type BookingStatus = "active" | "upcoming" | "completed" | "cancelled"
type SortOption = "date-newest" | "cost-highest"

interface Booking {
  id: string
  lot_name: string
  address: string
  start_date: string
  end_date: string
  duration: string
  total_cost: number
  spot_number: string
  status: BookingStatus
  created_at: string
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [activeStatus, setActiveStatus] = useState<BookingStatus>("active")
  const [sortBy, setSortBy] = useState<SortOption>("date-newest")
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/bookings")
        if (!response.ok) {
          throw new Error("Failed to fetch bookings")
        }
        const data = await response.json()
        setBookings(data)
      } catch (error) {
        console.error("[v0] Error fetching bookings:", error)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  useEffect(() => {
    const filtered = bookings.filter((booking) => booking.status === activeStatus)

    if (sortBy === "date-newest") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === "cost-highest") {
      filtered.sort((a, b) => b.total_cost - a.total_cost)
    }

    setFilteredBookings(filtered)
    setCurrentPage(1)
  }, [bookings, activeStatus, sortBy])

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const convertedBookings = paginatedBookings.map((booking) => ({
    id: booking.id,
    lotName: booking.lot_name,
    address: booking.address,
    startDate: booking.start_date,
    endDate: booking.end_date,
    duration: booking.duration,
    totalCost: booking.total_cost,
    spotNumber: booking.spot_number,
    status: booking.status,
    createdAt: booking.created_at,
  }))

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-white/60">View and manage your parking reservations</p>
        </div>

        {/* Filter Tabs */}
        <BookingFilters
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white/60">Loading your bookings...</p>
            </div>
          </div>
        ) : convertedBookings.length > 0 ? (
          <div className="space-y-4">
            {convertedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-lg">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 16l-4-4m0 0l-4-4m4 4l4-4m-4 4l-4 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No {activeStatus} bookings</h3>
            <p className="text-white/60 mb-6">You don't have any {activeStatus} parking bookings yet.</p>
            <Link href="/browse">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Browse Parking Lots</Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    currentPage === i + 1 ? "bg-blue-500 text-white" : "glass-card text-white/70 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
