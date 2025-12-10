import { MapPin, Clock, DollarSign } from "lucide-react"

export default function ActiveBookingCard({ booking }: { booking: any }) {
  const timeRemaining = booking.timeRemaining || "2h 15m"
  const spotNumber = booking.spotNumber || "A-42"

  return (
    <div className="glass-card p-8 rounded-2xl border-2 border-primary/30">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{booking.lotName}</h2>
          <div className="flex items-center text-foreground/70 gap-2">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">{booking.address}</p>
          </div>
        </div>
        <span className="bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
          In Progress
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-white/10">
        <div>
          <p className="text-foreground/60 text-sm mb-1">Time Remaining</p>
          <p className="text-xl font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {timeRemaining}
          </p>
        </div>
        <div>
          <p className="text-foreground/60 text-sm mb-1">Spot Number</p>
          <p className="text-xl font-bold text-foreground">{spotNumber}</p>
        </div>
        <div>
          <p className="text-foreground/60 text-sm mb-1">Cost/Hour</p>
          <p className="text-xl font-bold text-primary flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {booking.costPerHour || "2.50"}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition">
          View Lot Details
        </button>
        <button className="flex-1 border border-white/20 text-foreground font-semibold py-3 rounded-lg hover:bg-white/5 transition">
          Extend Parking
        </button>
        <button className="flex-1 border border-red-500/30 text-red-400 font-semibold py-3 rounded-lg hover:bg-red-500/10 transition">
          End Early
        </button>
      </div>
    </div>
  )
}
