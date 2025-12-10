import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase.from("bookings").select("*").eq("id", id).single()

    if (error || !data) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, endDate, extendHours } = body

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch existing booking
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    let updateData: any = {}

    if (action === "end") {
      updateData = {
        status: "completed",
        end_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    } else if (action === "extend" && extendHours) {
      const currentEndDate = new Date(booking.end_date)
      const newEndDate = new Date(currentEndDate.getTime() + extendHours * 60 * 60 * 1000)

      // Calculate additional cost
      const lotResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/lots/${booking.lot_id}`,
      )
      const lotData = await lotResponse.json()
      const additionalCost = extendHours * (lotData.price_per_hour || 0)

      updateData = {
        end_date: newEndDate.toISOString(),
        total_cost: Number(booking.total_cost) + additionalCost,
        duration: `${Math.round(((newEndDate.getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60)) * 10) / 10} hours`,
        updated_at: new Date().toISOString(),
      }
    } else if (endDate) {
      updateData = {
        end_date: endDate,
        updated_at: new Date().toISOString(),
      }
    }

    const { data: updatedBooking, error: updateError } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Failed to update booking" }, { status: 400 })
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error("[v0] Error updating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to cancel booking" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Booking cancelled", data })
  } catch (error) {
    console.error("[v0] Error cancelling booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
