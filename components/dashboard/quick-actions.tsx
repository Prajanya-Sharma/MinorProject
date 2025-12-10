export default function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <a
        href="/browse"
        className="flex-1 bg-primary text-white font-semibold py-4 rounded-lg text-center hover:bg-primary/90 transition"
      >
        Browse All Lots
      </a>
      <a
        href="/bookings"
        className="flex-1 border border-white/20 text-foreground font-semibold py-4 rounded-lg text-center hover:bg-white/5 transition"
      >
        My Bookings
      </a>
      <a
        href="/settings"
        className="flex-1 border border-white/20 text-foreground font-semibold py-4 rounded-lg text-center hover:bg-white/5 transition"
      >
        Account Settings
      </a>
    </div>
  )
}
