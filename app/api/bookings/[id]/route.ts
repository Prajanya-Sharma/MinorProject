import { type NextRequest, NextResponse } from "next/server"
import { mockBookings } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = mockBookings.find((b) => b.id === params.id)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error fetching booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, endDate } = body

    const booking = mockBookings.find((b) => b.id === params.id)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    booking.status = status
    if (endDate) booking.endDate = endDate

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error updating booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = mockBookings.find((b) => b.id === params.id)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    booking.status = "cancelled"

    return NextResponse.json({ success: true, message: "Booking cancelled" })
  } catch (error) {
    console.error("[v0] Error cancelling booking:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
