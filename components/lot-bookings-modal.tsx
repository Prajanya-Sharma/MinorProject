"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, User, DollarSign, Loader } from "lucide-react"

interface Booking {
  id: string
  start_date: string
  end_date: string
  duration: string
  total_cost: number
  spot_number: string
  status: string
  user_email: string // Updated to use user_email instead of nested users object
}

interface LotBookingsModalProps {
  lotId: string
  lotName: string
  isOpen: boolean
  onClose: () => void
}

export default function LotBookingsModal({ lotId, lotName, isOpen, onClose }: LotBookingsModalProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchBookings()
    }
  }, [isOpen, lotId])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/lots/${lotId}/bookings`)
      if (!response.ok) throw new Error("Failed to fetch bookings")
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      console.error("[v0] Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{lotName}</h2>
            <p className="text-gray-400 text-sm mt-1">Bookings Overview</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
              <p className="text-gray-400">This parking lot hasn't received any bookings yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{booking.user_email}</p>
                        <p className="text-sm text-gray-400">Spot: {booking.spot_number}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-400">Start</p>
                        <p className="text-white">{formatDateTime(booking.start_date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-400">Duration</p>
                        <p className="text-white">{booking.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-400">Cost</p>
                        <p className="text-green-400 font-semibold">${booking.total_cost}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
