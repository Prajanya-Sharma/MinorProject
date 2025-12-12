import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: lotId } = await params
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the user owns this lot
    const { data: lot, error: lotError } = await supabase
      .from("parking_lots")
      .select("user_id")
      .eq("id", lotId)
      .single()

    if (lotError || !lot) {
      return NextResponse.json({ error: "Lot not found" }, { status: 404 })
    }

    if (lot.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*")
      .eq("lot_id", lotId)
      .order("start_date", { ascending: true })

    if (bookingsError) {
      console.error("[v0] Error fetching bookings:", bookingsError)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    // Fetch recent parking events for this lot so we can surface sensor-derived parking_status
    try {
      const { data: events } = await supabase
        .from("parking_events")
        .select("spot_number, sensor_data")
        .eq("lot_id", lotId)
        .order("detected_at", { ascending: false })
        .limit(500)

      const latestBySpot: Record<string, any> = {}
      if (events && Array.isArray(events)) {
        for (const ev of events) {
          const spot = (ev as any).spot_number
          if (!spot) continue
          if (!latestBySpot[spot]) {
            latestBySpot[spot] = (ev as any).sensor_data || null
          }
        }
      }

      // If a latest sensor-derived parking_status exists for a booking's spot, prefer that
      const enrichedBookings = (bookings || []).map((b: any) => {
        const sensor = latestBySpot[b.spot_number]
        if (sensor && sensor.parking_status) {
          // sensor.parking_status is 'misparked' | 'parked' | 'empty'
          if (sensor.parking_status === 'misparked') {
            return { ...b, parking_status: 'misparked', sensor_parking_status: 'misparked' }
          }
          if (sensor.parking_status === 'empty') {
            // If booking exists but sensor shows empty, surface it so frontend shows Empty
            return { ...b, parking_status: 'empty', sensor_parking_status: 'empty' }
          }
          // for 'parked' or other values, leave booking.parking_status as-is
        }
        return b
      })

      return NextResponse.json(enrichedBookings)
    } catch (err) {
      console.error('[v0] Error enriching bookings with parking events:', err)
      return NextResponse.json(bookings || [])
    }
  } catch (error) {
    console.error("[v0] Error in bookings route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
