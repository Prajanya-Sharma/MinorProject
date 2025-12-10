"use client"

import { useState } from "react"
import { Heart, AlertCircle, Loader } from "lucide-react"

interface BookingFormProps {
  lotId: string
  pricePerHour: number
}

export default function BookingForm({ lotId, pricePerHour }: BookingFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateCost = () => {
    const start = Number.parseInt(startTime.split(":")[0])
    const end = Number.parseInt(endTime.split(":")[0])
    const hours = Math.max(1, end - start)
    return hours * pricePerHour
  }

  const handleBooking = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lotId,
          date,
          startTime,
          endTime,
          totalCost: calculateCost(),
        }),
      })

      if (!response.ok) throw new Error("Booking failed")
      // Redirect or show success message
      alert("Booking confirmed!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const estimatedCost = calculateCost()

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
        <div className="text-3xl font-bold text-primary">${estimatedCost}</div>
        <div className="text-xs text-gray-400 mt-2">
          {Math.max(1, Number.parseInt(endTime.split(":")[0]) - Number.parseInt(startTime.split(":")[0]))} hours × $
          {pricePerHour}/hr
        </div>
      </div>

      {/* Book Button */}
      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader className="w-4 h-4 animate-spin" />}
        {loading ? "Booking..." : "Book Now"}
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
