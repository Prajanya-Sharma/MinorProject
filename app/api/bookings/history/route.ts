import { NextResponse } from "next/server"
import { mockBookings } from "@/lib/mock-data"

export async function GET() {
  try {
    const formattedActivity = mockBookings.map((booking) => ({
      id: booking.id,
      type: booking.status === "completed" ? "parking_ended" : "parking_started",
      description: `${booking.status === "completed" ? "Ended" : "Started"} parking at ${booking.lotName}, Spot ${booking.spotNumber}`,
      timestamp: booking.createdAt,
      lotName: booking.lotName,
    }))

    return NextResponse.json({ data: formattedActivity })
  } catch (error) {
    console.error("[v0] Error fetching activity history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
