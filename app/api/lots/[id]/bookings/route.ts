import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lotId = params.id
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

    return NextResponse.json(bookings || [])
  } catch (error) {
    console.error("[v0] Error in bookings route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
