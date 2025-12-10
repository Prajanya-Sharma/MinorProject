"use client"

import { useState, useCallback, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ParkingFilters from "@/components/parking-filters"
import ParkingLotCard from "@/components/parking-lot-card"
import LoadingSkeleton from "@/components/loading-skeleton"

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
  lotType: "Street" | "Garage" | "Lot"
}

interface Filters {
  location: string
  priceRange: [number, number]
  availableOnly: boolean
  lotTypes: string[]
  distance: string
  rating: string
}

export default function BrowsePage() {
  const [lots, setLots] = useState<ParkingLot[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    location: "",
    priceRange: [5, 50],
    availableOnly: false,
    lotTypes: [],
    distance: "",
    rating: "",
  })
  const [displayedCount, setDisplayedCount] = useState(6)

  const fetchLots = useCallback(async (filterParams: Filters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append("browse", "true")

      if (filterParams.location) params.append("location", filterParams.location)
      params.append("price_min", filterParams.priceRange[0].toString())
      params.append("price_max", filterParams.priceRange[1].toString())

      console.log("[v0] Fetching lots with params:", params.toString())
      const response = await fetch(`/api/lots?${params.toString()}`)
      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        console.log("[v0] Response not OK:", response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Fetched lots data:", data)
      console.log("[v0] Number of lots received:", data.length)
      setLots(data)
      setDisplayedCount(6)
    } catch (error) {
      console.log("[v0] Error fetching lots:", error)
      setLots([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log("[v0] BrowsePage mounted, fetching lots...")
    fetchLots(filters)
  }, []) // Empty dependency array - only fetch on mount

  const applyFilters = useCallback(
    (newFilters: Filters) => {
      setFilters(newFilters)
      fetchLots(newFilters)
    },
    [fetchLots],
  )

  const clearFilters = useCallback(() => {
    const defaultFilters: Filters = {
      location: "",
      priceRange: [5, 50],
      availableOnly: false,
      lotTypes: [],
      distance: "",
      rating: "",
    }
    setFilters(defaultFilters)
    fetchLots(defaultFilters)
  }, [fetchLots])

  const displayedLots = lots.slice(0, displayedCount)
  const hasMore = displayedCount < lots.length

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        {/* Header Section */}
        <div className="px-4 md:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">Find Your Perfect Spot</h1>
            <p className="text-gray-400 text-lg">Browse available parking lots near you and book instantly</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <ParkingFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <LoadingSkeleton key={i} />
                  ))}
                </div>
              ) : lots.length === 0 ? (
                <div className="glass-card rounded-lg p-12 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h2 className="text-2xl font-bold text-white mb-2">No Parking Lots Found</h2>
                  <p className="text-gray-400 mb-6">Try adjusting your filters to find available parking spots</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Debug: Fetched {lots.length} lots. Check console for details.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-gray-400">
                    Found {lots.length} parking lot{lots.length !== 1 ? "s" : ""}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedLots.map((lot) => (
                      <ParkingLotCard key={lot.id} lot={lot} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={() => setDisplayedCount((prev) => prev + 3)}
                        className="px-8 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Load More Lots
                      </button>
                    </div>
                  )}

                  {!hasMore && lots.length > 0 && (
                    <div className="mt-8 text-center text-gray-400">
                      <p>Showing all {lots.length} parking lots</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
