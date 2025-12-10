"use client"

import { useRouter } from "next/navigation"
import { MapPin, Star, Shield, Clock, Zap } from "lucide-react"
import { useState } from "react"

interface ParkingLot {
  id: string
  name: string
  address: string
  distance: number
  pricePerHour: number
  availableSpots: number
  totalSpots: number
  rating: number
  reviews: number
  amenities: string[]
  image: string
  lotType: string
}

export default function ParkingLotCard({ lot }: { lot: ParkingLot }) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "CCTV":
        return <Shield className="w-4 h-4" />
      case "24/7":
        return <Clock className="w-4 h-4" />
      case "EV Charging":
        return <Zap className="w-4 h-4" />
      default:
        return null
    }
  }

  const availabilityPercentage = (lot.availableSpots / lot.totalSpots) * 100

  const handleViewDetails = () => {
    router.push(`/lots/${lot.id}`)
  }

  return (
    <div
      className="glass-card rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={lot.image || "/placeholder.svg"}
          alt={lot.name}
          className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
          ${lot.pricePerHour}/hr
        </div>
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-medium">
          {lot.lotType}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="font-display text-lg font-bold text-white truncate">{lot.name}</h3>

        {/* Address and Distance */}
        <div className="flex items-center text-sm text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
          <span className="truncate">
            {lot.address} • {lot.distance} km
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-white font-medium">{lot.rating}</span>
          </div>
          <span className="text-gray-400 text-sm ml-2">({lot.reviews} reviews)</span>
        </div>

        {/* Availability Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-300">Available Spots</span>
            <span className="text-sm font-medium text-primary">
              {lot.availableSpots}/{lot.totalSpots}
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-blue-400 h-full transition-all duration-300"
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          {lot.amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs text-gray-300 hover:bg-white/20 transition-colors"
              title={amenity}
            >
              {getAmenityIcon(amenity)}
              <span className="hidden sm:inline">{amenity}</span>
            </div>
          ))}
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all duration-300 mt-4"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
