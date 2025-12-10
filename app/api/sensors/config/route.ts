import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const lotId = searchParams.get("lot_id")

    if (!lotId) {
      return NextResponse.json({ error: "lot_id required" }, { status: 400 })
    }

    // Verify user owns this lot
    const { data: lot } = await supabase
      .from("parking_lots")
      .select("*")
      .eq("id", lotId)
      .eq("user_id", user.id)
      .single()

    if (!lot) {
      return NextResponse.json({ error: "Lot not found or unauthorized" }, { status: 404 })
    }

    // Get sensor configs for this lot
    const { data: sensors, error } = await supabase
      .from("sensor_configs")
      .select("*")
      .eq("lot_id", lotId)
      .order("spot_number")

    if (error) {
      console.error("[v0] Error fetching sensor configs:", error)
      return NextResponse.json({ error: "Failed to fetch sensors" }, { status: 500 })
    }

    return NextResponse.json(sensors)
  } catch (error) {
    console.error("[v0] Sensor config GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { lot_id, spot_number } = body

    if (!lot_id || !spot_number) {
      return NextResponse.json({ error: "lot_id and spot_number required" }, { status: 400 })
    }

    // Verify user owns this lot
    const { data: lot } = await supabase
      .from("parking_lots")
      .select("*")
      .eq("id", lot_id)
      .eq("user_id", user.id)
      .single()

    if (!lot) {
      return NextResponse.json({ error: "Lot not found or unauthorized" }, { status: 404 })
    }

    // Generate unique sensor ID and API key
    const sensorId = `ESP32_${lot_id.substring(0, 8)}_${spot_number}`
    const apiKey = randomBytes(32).toString("hex")

    // Create sensor config
    const { data: sensor, error } = await supabase
      .from("sensor_configs")
      .insert({
        lot_id,
        spot_number,
        sensor_id: sensorId,
        api_key: apiKey,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating sensor config:", error)
      return NextResponse.json({ error: "Failed to create sensor" }, { status: 500 })
    }

    return NextResponse.json(sensor)
  } catch (error) {
    console.error("[v0] Sensor config POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
