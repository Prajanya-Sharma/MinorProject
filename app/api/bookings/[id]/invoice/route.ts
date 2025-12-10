import { type NextRequest, NextResponse } from "next/server"
import { mockBookings, mockParkingLots } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookingId = params.id
    const booking = mockBookings.find((b) => b.id === bookingId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const lot = mockParkingLots.find((l) => l.id === booking.lotId)

    const invoice = {
      id: `INV-${bookingId}`,
      bookingId,
      date: new Date().toISOString().split("T")[0],
      lot: lot ? { name: lot.name, address: lot.address } : null,
      booking,
      subtotal: booking.totalCost,
      tax: booking.totalCost * 0.08,
      total: booking.totalCost * 1.08,
      paymentMethod: "Credit Card",
      status: booking.status === "completed" ? "paid" : "pending",
    }

    return NextResponse.json(invoice)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
