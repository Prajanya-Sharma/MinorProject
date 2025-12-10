import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    // Return mock stats for unauthenticated users
    if (userError || !user) {
      return NextResponse.json({
        activeBookings: 0,
        totalHours: 0,
        amountSpent: 0,
        favoriteLots: 0,
      })
    }

    const { data: bookings, error } = await supabase.from("bookings").select("*").eq("user_id", user.id).throwOnError()

    const activeBookings = bookings?.filter((b) => b.status === "active").length || 0
    const totalHours = bookings?.reduce((sum, b) => sum + (b.duration || 0), 0) || 0
    const amountSpent = bookings?.reduce((sum, b) => sum + (b.total_cost || 0), 0) || 0
    const favoriteLots = 5 // TODO: Implement favorites tracking

    return NextResponse.json({
      activeBookings,
      totalHours,
      amountSpent,
      favoriteLots,
    })
  } catch (error) {
    console.error("[v0] Stats endpoint error:", error)
    return NextResponse.json({
      activeBookings: 0,
      totalHours: 0,
      amountSpent: 0,
      favoriteLots: 0,
    })
  }
}
