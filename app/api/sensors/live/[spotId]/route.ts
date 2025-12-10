import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ spotId: string }> }) {
  try {
    const { spotId } = await params
    const supabase = await createClient()

    // Get the latest sensor event for this spot
    const { data: latestEvent, error } = await supabase
      .from("parking_events")
      .select("*, parking_lots(name, address)")
      .eq("spot_number", spotId)
      .order("detected_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return NextResponse.json({ error: "Spot not found" }, { status: 404 })
    }

    return NextResponse.json(latestEvent)
  } catch (error) {
    console.error("[v0] Error fetching live sensor data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
