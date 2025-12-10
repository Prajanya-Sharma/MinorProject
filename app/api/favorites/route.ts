import { NextResponse } from "next/server"
import { mockFavorites } from "@/lib/mock-data"

export async function GET() {
  try {
    return NextResponse.json({ data: mockFavorites })
  } catch (error) {
    console.error("[v0] Error fetching favorites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
