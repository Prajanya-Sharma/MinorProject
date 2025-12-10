"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { BookingActions } from "@/components/booking-actions"

interface Booking {
  id: string
  lotName: string
  address: string
  startDate: string
  endDate: string
  duration: string
  totalCost: number
  spotNumber: string
  status: "active" | "upcoming" | "completed" | "cancelled"
  createdAt: string
}

const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  upcoming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
}

export function BookingCard({ booking }: { booking: Booking }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card
      onClick={() => setIsExpanded(!isExpanded)}
      className="glass-card p-6 rounded-lg cursor-pointer transition-all hover:bg-white/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{booking.lotName}</h3>
              <p className="text-white/60">{booking.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-white/50 text-sm mb-1">Date & Time</p>
              <p className="text-white font-medium">{booking.startDate}</p>
              <p className="text-white/70 text-sm">{booking.endDate.split(" ")[1]}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-1">Duration</p>
              <p className="text-white font-medium">{booking.duration}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-1">Spot Number</p>
              <p className="text-white font-medium">{booking.spotNumber}</p>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-1">Total Cost</p>
              <p className="text-green-400 font-semibold text-lg">${booking.totalCost}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <span className="text-white/50 text-sm">ID: {booking.id}</span>
          </div>
        </div>

        <BookingActions booking={booking} />
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-white/50 text-sm mb-2">Booking Details</p>
              <div className="space-y-2 text-sm text-white/70">
                <p>Entry: {booking.startDate}</p>
                <p>Exit: {booking.endDate}</p>
              </div>
            </div>

            <div>
              <p className="text-white/50 text-sm mb-2">Location</p>
              <div className="space-y-2 text-sm text-white/70">
                <p>Spot: {booking.spotNumber}</p>
                <p>{booking.address}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
