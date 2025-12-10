import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lotId, lotName, address, startDate, endDate, duration, totalCost, spotNumber } = body

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!lotId || !lotName || !address || !startDate || !endDate || !duration || !totalCost || !spotNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: overlappingBookings, error: overlapError } = await supabase
      .from("bookings")
      .select("*")
      .eq("lot_id", lotId)
      .eq("spot_number", spotNumber)
      .neq("status", "cancelled")
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`)

    if (overlapError) {
      console.error("[v0] Error checking overlaps:", overlapError)
    }

    if (overlappingBookings && overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: "This spot is already booked for the selected time. Please choose a different time or spot." },
        { status: 409 },
      )
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        user_email: user.email,
        lot_id: lotId,
        lot_name: lotName,
        address,
        start_date: startDate,
        end_date: endDate,
        duration,
        total_cost: Number(totalCost),
        spot_number: spotNumber,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json([])
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = supabase.from("bookings").select("*").eq("user_id", user.id)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("[v0] Error fetching bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
