import { Car, CreditCard, MapPin, CheckCircle } from "lucide-react"

export default function RecentActivity({ activities }: { activities: any[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "parking_started":
        return <Car className="w-5 h-5 text-blue-400" />
      case "parking_ended":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "payment":
        return <CreditCard className="w-5 h-5 text-yellow-400" />
      default:
        return <MapPin className="w-5 h-5 text-primary" />
    }
  }

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "parking_started":
        return "Parking started"
      case "parking_ended":
        return "Parking ended"
      case "payment":
        return "Payment processed"
      default:
        return "Activity"
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.slice(0, 6).map((activity, index) => (
          <div key={index} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
            <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">{getActivityLabel(activity.type)}</p>
              <p className="text-foreground/70 text-sm">{activity.description}</p>
              <p className="text-foreground/50 text-xs mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="/history" className="text-primary hover:underline text-sm mt-4 block">
        View History
      </a>
    </div>
  )
}
