import { Car, Clock, DollarSign, Heart } from "lucide-react"

export default function StatsCards({ stats }: { stats: any }) {
  const statCards = [
    {
      icon: Car,
      label: "Active Bookings",
      value: stats.activeBookings || 0,
      color: "text-blue-400",
    },
    {
      icon: Clock,
      label: "Total Hours Parked",
      value: `${stats.totalHours || 0}h`,
      color: "text-purple-400",
    },
    {
      icon: DollarSign,
      label: "Amount Spent",
      value: `$${(stats.amountSpent || 0).toFixed(2)}`,
      color: "text-green-400",
    },
    {
      icon: Heart,
      label: "Favorite Lots",
      value: stats.favoriteLots || 0,
      color: "text-red-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {statCards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="glass-card p-6 rounded-xl hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground/70 text-sm mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
              <Icon className={`w-10 h-10 ${card.color}`} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
