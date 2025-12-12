"use client"

import { useState, useEffect } from "react"
import { X, Calendar, Clock, User, DollarSign, Loader, Car, Activity } from "lucide-react"

interface Booking {
  id: string
  start_date: string
  end_date: string
  duration: string
  total_cost: number
  spot_number: string
  status: string
  parking_status?: string
  user_email: string
}
interface LotBookingsModalProps {
  lotId: string
  lotName: string
  isOpen: boolean
  onClose: () => void
}

const getRealTimeStatus = (booking: Booking) => {
  // Use booking.parking_status (set by sensor webhook) when available.
  // booking.parking_status values: 'normal', 'misparked', 'overstay', etc.
  let parkingStatus = "Empty"
  let timeEntered: string | null = null
  let timeOfExit: string | null = null

  if (booking.parking_status === "misparked") {
    parkingStatus = "Misparked"
  } else if (booking.parking_status === "empty") {
    parkingStatus = "Empty"
  } else if (booking.status === "active") {
    parkingStatus = "Occupied"
    // Optionally show booking start as entered time if available
    timeEntered = booking.start_date || null
  } else if (booking.status === "completed") {
    parkingStatus = "Empty"
    timeEntered = booking.start_date || null
    timeOfExit = booking.end_date || null
  } else if (booking.status === "upcoming") {
    parkingStatus = "Empty"
  }

  return { parkingStatus, timeEntered, timeOfExit }
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

  const getParkingStatusColor = (status: string) => {
    switch (status) {
      case "Occupied":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Misparked":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "Empty":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      case "Entering":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Exiting":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{lotName}</h2>
            <p className="text-gray-400 text-sm mt-1">Bookings Overview with Real-Time Status</p>
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
              {bookings.map((booking) => {
                const realTimeStatus = getRealTimeStatus(booking)

                return (
                  <div
                    key={booking.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition"
                  >
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-4">
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

                    <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-semibold text-white">Real-Time Parking Status</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Parking Status */}
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Current Status</p>
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-gray-400" />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getParkingStatusColor(realTimeStatus.parkingStatus)}`}
                            >
                              {realTimeStatus.parkingStatus}
                            </span>
                          </div>
                        </div>

                        {/* Time Entered */}
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Actual Entry Time</p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-400" />
                            <p className="text-sm text-white">
                              {realTimeStatus.timeEntered
                                ? formatDateTime(realTimeStatus.timeEntered)
                                : "Not entered yet"}
                            </p>
                          </div>
                        </div>

                        {/* Time of Exit */}
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Actual Exit Time</p>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-400" />
                            <p className="text-sm text-white">
                              {realTimeStatus.timeOfExit
                                ? formatDateTime(realTimeStatus.timeOfExit)
                                : realTimeStatus.parkingStatus === "Occupied"
                                  ? "Currently parked"
                                  : "Not exited yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-400">Booked Start</p>
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
                          <p className="text-gray-400">Total Cost</p>
                          <p className="text-green-400 font-semibold">${booking.total_cost}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
