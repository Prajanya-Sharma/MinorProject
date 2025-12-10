import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("[v0] GET /api/lots/[id] - Fetching lot:", id)
    const supabase = await createClient()

    const { data: lot, error } = await supabase.from("parking_lots").select("*").eq("id", id).single()

    if (error || !lot) {
      console.error("[v0] Error fetching lot:", error)
      return NextResponse.json({ error: "Lot not found" }, { status: 404 })
    }

    console.log("[v0] Lot fetched successfully:", lot.name)

    const formattedLot = {
      id: lot.id,
      name: lot.name,
      address: lot.address,
      latitude: 40.7128,
      longitude: -74.006,
      rating: 4.5,
      reviewCount: 24,
      pricePerHour: lot.price_per_hour,
      peakHoursPrice: lot.price_per_hour * 1.5,
      dailyRate: lot.price_per_hour * 24 * 0.8,
      monthlyRate: lot.price_per_hour * 24 * 30 * 0.6,
      description: lot.description || "Beautiful and secure parking lot with excellent amenities.",
      amenities: Array.isArray(lot.amenities) ? lot.amenities : convertAmenities(lot.amenities),
      photos: lot.image_url ? [lot.image_url] : ["/busy-city-parking-lot.png"],
      houseRules: [
        "Maximum stay: 30 days",
        "No commercial vehicles",
        "Clean parking discipline required",
        "24/7 surveillance active",
      ],
      availability: {
        availableSpots: lot.available_spots,
        totalSpots: lot.total_spots,
      },
    }

    return NextResponse.json(formattedLot)
  } catch (error) {
    console.error("[v0] Error fetching lot:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function convertAmenities(amenities: any): string[] {
  // Handle null or undefined
  if (!amenities) return ["Standard Amenities"]

  // Handle object format from database
  if (typeof amenities === "object" && !Array.isArray(amenities)) {
    const result = []
    if (amenities.lighting) result.push("24/7 Lighting")
    if (amenities.cctv) result.push("CCTV")
    if (amenities.covered) result.push("Covered Parking")
    if (amenities.evCharging) result.push("EV Charging")
    return result.length > 0 ? result : ["Standard Amenities"]
  }

  // Return default if format is unexpected
  return ["Standard Amenities"]
}
