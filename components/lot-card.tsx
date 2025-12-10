"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Lot {
  id: string
  name: string
  address: string
  total_spots: number
  available_spots: number
  occupancy_rate: number
  monthly_revenue: number
  status: "active" | "inactive" | "maintenance"
  created_at: string
  image_url?: string
}

const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  inactive: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  maintenance: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
}

export function LotCard({ lot }: { lot: Lot }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card
      onClick={() => setIsExpanded(!isExpanded)}
      className="glass-card rounded-lg cursor-pointer transition-all hover:bg-white/20 overflow-hidden"
    >
      {/* Image Section */}
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 overflow-hidden bg-white/10">
          <img
            src={lot.image_url || "/busy-city-parking-lot.png"}
            alt={lot.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{lot.name}</h3>
              <p className="text-white/60 text-sm">{lot.address}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <div>
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">Total Spots</p>
              <p className="text-xl font-bold text-white">{lot.total_spots}</p>
            </div>

            <div>
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">Available</p>
              <p className="text-xl font-bold text-green-400">{lot.available_spots}</p>
            </div>

            <div>
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">Occupancy</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-white">{lot.occupancy_rate}%</p>
                <div className="w-12 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all"
                    style={{ width: `${lot.occupancy_rate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">Revenue</p>
              <p className="text-xl font-bold text-green-400">${lot.monthly_revenue}</p>
            </div>

            <div>
              <p className="text-white/50 text-xs mb-1 uppercase tracking-wide">Status</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border inline-block ${statusColors[lot.status]}`}
              >
                {lot.status.charAt(0).toUpperCase() + lot.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/50 text-sm">Created: {new Date(lot.created_at).toLocaleDateString()}</span>
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2">View Details</Button>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-sm px-4 py-2 bg-transparent"
              >
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 p-6 border-t border-white/10 animate-in slide-in-from-top duration-200 bg-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-4">Parking Statistics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Peak Hours Occupancy</span>
                  <span className="text-white font-medium">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Average Duration</span>
                  <span className="text-white font-medium">2.5 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Daily Transactions</span>
                  <span className="text-white font-medium">{Math.floor(lot.total_spots * 0.6)}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Actions</h4>
              <div className="space-y-2 flex flex-col">
                <Button className="bg-purple-500 hover:bg-purple-600 text-white text-sm w-full">Manage Rates</Button>
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm w-full">View Bookings</Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 text-sm w-full bg-transparent"
                >
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
