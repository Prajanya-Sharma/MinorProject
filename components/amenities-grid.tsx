import type React from "react"
import { Shield, Video, Zap, Umbrella, Accessibility, Camera, Clock, Wifi } from "lucide-react"

interface AmenitiesGridProps {
  amenities: string[]
}

const amenityIcons: Record<string, React.ReactNode> = {
  "24/7 Monitoring": <Shield className="w-5 h-5" />,
  CCTV: <Video className="w-5 h-5" />,
  "EV Charging": <Zap className="w-5 h-5" />,
  Covered: <Umbrella className="w-5 h-5" />,
  "Wheelchair Access": <Accessibility className="w-5 h-5" />,
  Security: <Camera className="w-5 h-5" />,
  "24-Hour": <Clock className="w-5 h-5" />,
  WiFi: <Wifi className="w-5 h-5" />,
}

export default function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-6">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {amenities.map((amenity) => (
          <div
            key={amenity}
            className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <div className="text-primary">{amenityIcons[amenity] || <Shield className="w-5 h-5" />}</div>
            <span className="text-xs text-center text-gray-300">{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
