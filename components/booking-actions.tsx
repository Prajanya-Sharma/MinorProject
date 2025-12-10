"use client"

import { useState } from "react"
import Link from "next/link"

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

export function BookingActions({ booking }: { booking: Booking }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: string) => {
    setIsLoading(true)
    try {
      if (action === "extend") {
        // Handle extend booking
        console.log("Extending booking:", booking.id)
      } else if (action === "end") {
        // Handle end parking
        const response = await fetch(`/api/bookings/${booking.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed" }),
        })
        if (response.ok) {
          window.location.reload()
        }
      } else if (action === "cancel") {
        // Handle cancel booking
        const response = await fetch(`/api/bookings/${booking.id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          window.location.reload()
        }
      }
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const getActions = () => {
    switch (booking.status) {
      case "active":
        return [
          { label: "Extend", action: "extend" },
          { label: "End Parking", action: "end" },
          { label: "View Lot", action: "view" },
        ]
      case "upcoming":
        return [
          { label: "Modify", action: "modify" },
          { label: "Cancel", action: "cancel" },
          { label: "View Lot", action: "view" },
        ]
      case "completed":
        return [
          { label: "Rebook", action: "rebook" },
          { label: "Review", action: "review" },
          { label: "Invoice", action: "invoice" },
        ]
      case "cancelled":
        return [{ label: "Rebook", action: "rebook" }]
      default:
        return []
    }
  }

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-2 rounded-lg glass-card hover:bg-white/20 transition-all"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg overflow-hidden z-50 shadow-lg">
          {getActions().map((action, index) => (
            <div key={action.action}>
              {action.action === "view" ? (
                <Link href={`/lots/${booking.id}`}>
                  <button className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 transition-all text-sm">
                    {action.label}
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => handleAction(action.action)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 transition-all text-sm disabled:opacity-50"
                >
                  {action.label}
                </button>
              )}
              {index < getActions().length - 1 && <div className="h-px bg-white/10" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
