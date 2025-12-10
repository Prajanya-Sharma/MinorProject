"use client"

import { useState, useEffect } from "react"
import { Heart, AlertCircle, Loader, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface BookingFormProps {
  lotId: string
  pricePerHour: number
}

export default function BookingForm({ lotId, pricePerHour }: BookingFormProps) {
  const router = useRouter()
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [lotDetails, setLotDetails] = useState<{ name: string; address: string } | null>(null)

  useEffect(() => {
    const fetchLotDetails = async () => {
      try {
        const response = await fetch(`/api/lots/${lotId}`)
        if (!response.ok) throw new Error("Failed to fetch lot details")
        const data = await response.json()
        setLotDetails({ name: data.name, address: data.address })
      } catch (err) {
        console.error("[v0] Error fetching lot details:", err)
      }
    }
    fetchLotDetails()
  }, [lotId])

  const calculateHours = () => {
    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)
    const start = startHour + startMin / 60
    const end = endHour + endMin / 60
    return Math.max(0.5, end - start)
  }

  const calculateCost = () => {
    const hours = calculateHours()
    return Math.round(hours * pricePerHour * 100) / 100
  }

  const handleBooking = async () => {
    if (endTime <= startTime) {
      setError("End time must be after start time")
      return
    }

    if (!lotDetails) {
      setError("Loading lot details...")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const startDateTime = new Date(`${date}T${startTime}:00`)
      const endDateTime = new Date(`${date}T${endTime}:00`)
      const hours = calculateHours()

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotId,
          lotName: lotDetails.name,
          address: lotDetails.address,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
          duration: `${hours} hour${hours !== 1 ? "s" : ""}`,
          totalCost: calculateCost(),
          spotNumber: `A${Math.floor(Math.random() * 100) + 1}`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Booking failed")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/my-bookings")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const estimatedCost = calculateCost()
  const hours = calculateHours()

  if (success) {
    return (
      <div className="glass-card p-6 rounded-xl space-y-5">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-center mb-2">Booking Confirmed!</h3>
          <p className="text-gray-400 text-center">Redirecting to your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-card p-6 rounded-xl space-y-5">
      <h3 className="text-2xl font-bold">Book Now</h3>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-200">{error}</span>
        </div>
      )}

      {/* Date Picker */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none transition"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Time Pickers */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-primary outline-none transition"
          />
        </div>
      </div>

      {/* Estimated Cost */}
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
        <div className="text-sm text-gray-400 mb-1">Estimated Cost</div>
        <div className="text-3xl font-bold text-primary">${estimatedCost.toFixed(2)}</div>
        <div className="text-xs text-gray-400 mt-2">
          {hours.toFixed(1)} hour{hours !== 1 ? "s" : ""} × ${pricePerHour}/hr
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={handleBooking}
        disabled={loading || !lotDetails}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? "Booking..." : "Confirm Booking"}
      </button>

      {/* Save to Favorites */}
      <button
        onClick={() => setIsSaved(!isSaved)}
        className={`w-full border border-white/20 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
          isSaved ? "bg-primary/20 border-primary text-primary" : "hover:bg-white/5"
        }`}
      >
        <Heart className={`w-4 h-4 ${isSaved ? "fill-primary" : ""}`} />
        {isSaved ? "Saved to Favorites" : "Save to Favorites"}
      </button>
    </div>
  )
}
