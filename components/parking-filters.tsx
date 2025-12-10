"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FilterProps {
  onApplyFilters: (filters: any) => void
  onClearFilters: () => void
}

export default function ParkingFilters({ onApplyFilters, onClearFilters }: FilterProps) {
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState([5, 50])
  const [availableOnly, setAvailableOnly] = useState(false)
  const [lotTypes, setLotTypes] = useState<string[]>([])
  const [distance, setDistance] = useState("")
  const [rating, setRating] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLotTypeChange = (type: string) => {
    setLotTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleApply = () => {
    onApplyFilters({ location, priceRange, availableOnly, lotTypes, distance, rating })
  }

  const handleClear = () => {
    setLocation("")
    setPriceRange([5, 50])
    setAvailableOnly(false)
    setLotTypes([])
    setDistance("")
    setRating("")
    onClearFilters()
  }

  return (
    <div className="glass-card rounded-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <h2 className="text-lg font-bold text-white">Filters</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-blue-400 transition-colors"
        >
          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className={`space-y-6 ${isExpanded ? "block" : "hidden lg:block"}`}>
        {/* Location Search */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">Location</label>
          <input
            type="text"
            placeholder="Search location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Price Range Slider */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
            className="w-full accent-primary"
          />
        </div>

        {/* Availability Filter */}
        <div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-4 h-4 rounded bg-white/10 border border-white/20 cursor-pointer accent-primary"
            />
            <span className="ml-3 text-sm text-white">Available Now</span>
          </label>
        </div>

        {/* Lot Type Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Lot Type</label>
          <div className="space-y-2">
            {["Street", "Garage", "Lot"].map((type) => (
              <label key={type} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={lotTypes.includes(type)}
                  onChange={() => handleLotTypeChange(type)}
                  className="w-4 h-4 rounded bg-white/10 border border-white/20 cursor-pointer accent-primary"
                />
                <span className="ml-3 text-sm text-white">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Distance Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Distance</label>
          <div className="space-y-2">
            {["1km", "5km", "10km"].map((dist) => (
              <label key={dist} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="distance"
                  value={dist}
                  checked={distance === dist}
                  onChange={(e) => setDistance(e.target.value)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="ml-3 text-sm text-white">{dist}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-white mb-3">Rating</label>
          <div className="space-y-2">
            {["3+", "4+", "5+"].map((rat) => (
              <label key={rat} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  value={rat}
                  checked={rating === rat}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-4 h-4 accent-primary cursor-pointer"
                />
                <span className="ml-3 text-sm text-white">
                  {rat === "3+" && "3+ ⭐"}
                  {rat === "4+" && "4+ ⭐"}
                  {rat === "5+" && "5 ⭐"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <button
            onClick={handleApply}
            className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClear}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-2 rounded-lg transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}
