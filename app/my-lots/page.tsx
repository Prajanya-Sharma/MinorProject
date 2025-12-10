import { redirect } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { LotCard } from "@/components/lot-card"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

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
}

export default async function MyLotsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: lots, error } = await supabase
    .from("parking_lots")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching lots:", error)
    return (
      <main className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">Failed to load your parking lots</p>
          </div>
        </div>
      </main>
    )
  }

  const typedLots: Lot[] = lots || []
  const totalSpots = typedLots.reduce((sum, lot) => sum + lot.total_spots, 0)
  const totalAvailable = typedLots.reduce((sum, lot) => sum + lot.available_spots, 0)
  const totalRevenue = typedLots.reduce((sum, lot) => sum + lot.monthly_revenue, 0)

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Parking Lots</h1>
          <p className="text-white/60">Manage and monitor your parking facilities</p>
        </div>

        {/* Stats Overview */}
        {typedLots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Total Spots</p>
                  <p className="text-3xl font-bold text-white">{totalSpots}</p>
                  <p className="text-green-400 text-sm mt-2">{totalAvailable} available</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Average Occupancy</p>
                  <p className="text-3xl font-bold text-white">
                    {Math.round(typedLots.reduce((sum, lot) => sum + lot.occupancy_rate, 0) / typedLots.length)}%
                  </p>
                  <p className="text-blue-400 text-sm mt-2">{typedLots.length} active lots</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                  <p className="text-green-400 text-sm mt-2">This month</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lots List */}
        {typedLots.length > 0 ? (
          <div className="space-y-4">
            {typedLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center rounded-lg">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No parking lots yet</h3>
            <p className="text-white/60 mb-6">
              You haven't created any parking lots. Get started by adding your first lot.
            </p>
            <Link href="/add-lot">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Add Parking Lot</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
