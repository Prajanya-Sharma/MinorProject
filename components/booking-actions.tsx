"use client"

import { useState } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  const [showExtendDialog, setShowExtendDialog] = useState(false)
  const [extendHours, setExtendHours] = useState(1)

  const lotId = (booking as any).lot_id || booking.id

  const handleAction = async (action: string) => {
    setIsLoading(true)
    try {
      if (action === "extend") {
        setShowExtendDialog(true)
        setIsOpen(false)
        return
      } else if (action === "end") {
        const response = await fetch(`/api/bookings/${booking.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "end" }),
        })
        if (response.ok) {
          window.location.reload()
        } else {
          const error = await response.json()
          alert(error.error || "Failed to end parking")
        }
      } else if (action === "cancel") {
        if (confirm("Are you sure you want to cancel this booking?")) {
          const response = await fetch(`/api/bookings/${booking.id}`, {
            method: "DELETE",
          })
          if (response.ok) {
            window.location.reload()
          }
        }
      }
    } catch (error) {
      console.error("Action failed:", error)
      alert("Action failed. Please try again.")
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const handleExtend = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extend", extendHours: Number(extendHours) }),
      })

      if (response.ok) {
        alert(`Booking extended by ${extendHours} hour(s)`)
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to extend booking")
      }
    } catch (error) {
      console.error("Extend failed:", error)
      alert("Failed to extend booking")
    } finally {
      setIsLoading(false)
      setShowExtendDialog(false)
    }
  }

  const getActions = () => {
    switch (booking.status) {
      case "active":
        return [
          { label: "Extend Parking", action: "extend" },
          { label: "End Parking", action: "end" },
          { label: "View Lot", action: "view", href: `/lots/${lotId}` },
        ]
      case "upcoming":
        return [
          { label: "Cancel", action: "cancel" },
          { label: "View Lot", action: "view", href: `/lots/${lotId}` },
        ]
      case "completed":
        return [
          { label: "Rebook", action: "rebook", href: `/lots/${lotId}` },
          { label: "View Lot", action: "view", href: `/lots/${lotId}` },
        ]
      case "cancelled":
        return [{ label: "Rebook", action: "rebook", href: `/lots/${lotId}` }]
      default:
        return []
    }
  }

  return (
    <>
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
                {action.href ? (
                  <Link href={action.href} onClick={() => setIsOpen(false)}>
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

      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent className="glass-card border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Extend Parking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Extend by (hours)</label>
              <Input
                type="number"
                min="1"
                max="24"
                value={extendHours}
                onChange={(e) => setExtendHours(Number(e.target.value))}
                className="bg-white/5 border-white/20 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleExtend}
                disabled={isLoading || extendHours < 1}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? "Extending..." : "Confirm"}
              </Button>
              <Button
                onClick={() => setShowExtendDialog(false)}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
