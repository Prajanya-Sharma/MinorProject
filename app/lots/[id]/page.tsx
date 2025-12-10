"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ChevronLeft, MapPin, Star, DollarSign, AlertCircle, Loader } from "lucide-react"
import BookingForm from "@/components/booking-form"
import ReviewsSection from "@/components/reviews-section"
import AmenitiesGrid from "@/components/amenities-grid"
import PhotoGallery from "@/components/photo-gallery"
import MapView from "@/components/map-view"

interface LotDetails {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  rating: number
  reviewCount: number
  pricePerHour: number
  peakHoursPrice?: number
  dailyRate: number
  monthlyRate?: number
  description: string
  amenities: string[]
  photos: string[]
  houseRules: string[]
  availability?: {
    availableSpots: number
    totalSpots: number
  }
}

export default function LotDetailsPage() {
  const params = useParams()
  const lotId = params.id as string
  const [lot, setLot] = useState<LotDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLotDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/lots/${lotId}`)
        if (!response.ok) throw new Error("Failed to fetch lot details")
        const data = await response.json()
        setLot(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchLotDetails()
  }, [lotId])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader className="w-8 h-8 text-primary animate-spin" />
        </div>
      </main>
    )
  }

  if (error || !lot) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="glass-card p-6 flex items-center gap-3 bg-red-500/10 border-red-500/30">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-100">{error || "Lot not found"}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <Image
          src={lot.photos[0] || "/placeholder.svg?height=400&width=1200&query=parking lot"}
          alt={lot.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 glass-card p-2 hover:bg-white/20 z-10 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-400">
        <span className="hover:text-primary cursor-pointer">Browse Lots</span>
        <span className="mx-2">/</span>
        <span className="text-primary">{lot.name}</span>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - 70% */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div>
              <h1 className="text-4xl font-bold mb-3">{lot.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(lot.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">{lot.rating}</span>
                </div>
                <span className="text-gray-400">({lot.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>{lot.address}</span>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Pricing</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30">
                  <div className="text-sm text-gray-400 mb-1">Per Hour</div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">{lot.pricePerHour}</span>
                  </div>
                </div>
                {lot.peakHoursPrice && (
                  <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/30">
                    <div className="text-sm text-gray-400 mb-1">Peak Hours</div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <span className="text-2xl font-bold text-orange-500">{lot.peakHoursPrice}</span>
                    </div>
                  </div>
                )}
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                  <div className="text-sm text-gray-400 mb-1">Daily Rate</div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <span className="text-2xl font-bold text-blue-500">{lot.dailyRate}</span>
                  </div>
                </div>
                {lot.monthlyRate && (
                  <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/30">
                    <div className="text-sm text-gray-400 mb-1">Monthly</div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-500" />
                      <span className="text-2xl font-bold text-purple-500">{lot.monthlyRate}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            {lot.availability && (
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Availability</h3>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-primary">{lot.availability.availableSpots}</div>
                  <div>
                    <p className="text-gray-300">Available Spots</p>
                    <p className="text-sm text-gray-400">out of {lot.availability.totalSpots} total</p>
                  </div>
                </div>
                <div className="mt-4 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full"
                    style={{
                      width: `${(lot.availability.availableSpots / lot.availability.totalSpots) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-green-400 font-semibold">Available Now</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3">About</h3>
              <p className="text-gray-300 leading-relaxed">{lot.description}</p>
            </div>

            {/* Amenities */}
            <AmenitiesGrid amenities={lot.amenities} />

            {/* Photo Gallery */}
            <PhotoGallery photos={lot.photos} lotName={lot.name} />

            {/* Map View */}
            <MapView latitude={lot.latitude} longitude={lot.longitude} name={lot.name} address={lot.address} />

            {/* House Rules */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-4">House Rules</h3>
              <ul className="space-y-2">
                {lot.houseRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <span className="text-primary mt-1">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Section - 30% */}
          <div className="lg:col-span-1 space-y-8">
            {/* Booking Form */}
            <div className="sticky top-24">
              <BookingForm lotId={lotId} pricePerHour={lot.pricePerHour} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <ReviewsSection lotId={lotId} />
        </div>
      </div>

      <Footer />
    </main>
  )
}
