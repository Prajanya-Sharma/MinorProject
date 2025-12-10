import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, address, city, state, zipCode, totalSpots, pricePerHour, description, amenities, imageUrl } = body

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!name || !address || !city || !state || !zipCode || !totalSpots || !pricePerHour) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("parking_lots")
      .insert({
        user_id: user.id,
        name,
        address,
        city,
        state,
        zip_code: zipCode,
        total_spots: Number(totalSpots),
        available_spots: Number(totalSpots),
        price_per_hour: Number(pricePerHour),
        description,
        image_url: imageUrl,
        amenities: amenities || { lighting: false, cctv: false, covered: false, evCharging: false },
        status: "active",
        occupancy_rate: 0,
        monthly_revenue: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to create lot" }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating lot:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isBrowse = searchParams.get("browse") === "true"

    console.log("[v0] GET /api/lots - isBrowse:", isBrowse)

    const supabase = await createClient()

    if (isBrowse) {
      // Browse all active lots - should be publicly visible to everyone
      let query = supabase.from("parking_lots").select("*").eq("status", "active")

      const priceMin = searchParams.get("price_min")
      const priceMax = searchParams.get("price_max")
      if (priceMin) query = query.gte("price_per_hour", Number(priceMin))
      if (priceMax) query = query.lte("price_per_hour", Number(priceMax))

      const location = searchParams.get("location")
      if (location) {
        query = query.or(`city.ilike.%${location}%,address.ilike.%${location}%`)
      }

      const { data, error } = await query.order("created_at", { ascending: false }).limit(100)

      console.log("[v0] Supabase browse query - data count:", data?.length, "error:", error)

      if (error) {
        console.error("[v0] Supabase browse error details:", JSON.stringify(error))
        return NextResponse.json({ error: "Failed to fetch lots", details: error.message }, { status: 400 })
      }

      if (!data || data.length === 0) {
        console.log("[v0] No data returned from browse query")
        return NextResponse.json([])
      }

      console.log("[v0] Sample lot before conversion:", data[0])

      const convertedLots = data.map((lot: any) => ({
        id: lot.id,
        name: lot.name,
        address: lot.address,
        distance: Math.random() * 10,
        pricePerHour: lot.price_per_hour,
        availableSpots: lot.available_spots,
        totalSpots: lot.total_spots,
        rating: 4.5,
        reviews: 24,
        amenities: convertAmenities(lot.amenities),
        image: lot.image_url || "/busy-city-parking-lot.png",
        lotType: "Lot" as const,
      }))

      console.log("[v0] Returning converted lots:", convertedLots.length, "lots")
      console.log("[v0] Sample converted lot:", convertedLots[0])
      return NextResponse.json(convertedLots, { status: 200 })
    } else {
      // Get current user's lots
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const { data, error } = await supabase
        .from("parking_lots")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Supabase error:", error)
        return NextResponse.json({ error: "Failed to fetch lots" }, { status: 400 })
      }

      return NextResponse.json(data)
    }
  } catch (error) {
    console.error("[v0] Error fetching lots:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to convert amenities object to array
function convertAmenities(amenities: any): string[] {
  const result = []
  if (amenities?.lighting) result.push("Lighting")
  if (amenities?.cctv) result.push("CCTV")
  if (amenities?.covered) result.push("Covered")
  if (amenities?.evCharging) result.push("EV Charging")
  return result
}
