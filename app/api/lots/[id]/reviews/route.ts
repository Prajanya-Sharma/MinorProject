import { type NextRequest, NextResponse } from "next/server"
import { mockReviews } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const rating = searchParams.get("rating")
    const sort = searchParams.get("sort") || "recent"

    let filtered = mockReviews.filter((review) => review.lotId === params.id)

    if (rating) {
      filtered = filtered.filter((review) => review.rating === Number.parseInt(rating))
    }

    if (sort === "helpful") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    return NextResponse.json(filtered)
  } catch (error) {
    console.error("[v0] Error fetching reviews:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
