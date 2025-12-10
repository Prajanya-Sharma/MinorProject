import { Calendar, Clock } from "lucide-react"

export default function UpcomingBookings({ bookings }: { bookings: any[] }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-foreground mb-4">Upcoming Bookings</h3>
      <div className="space-y-3">
        {bookings.slice(0, 3).map((booking, index) => (
          <div key={index} className="glass-card p-4 rounded-lg hover:bg-white/15 transition">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{booking.lotName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-foreground/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {booking.time}
                  </span>
                </div>
              </div>
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
      {bookings.length > 3 && (
        <a href="/bookings" className="text-primary hover:underline text-sm mt-4 block">
          View All Bookings
        </a>
      )}
    </div>
  )
}
