import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Test endpoint to verify lots can be retrieved without RLS issues
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Query without any auth context
    const { data, error, count } = await supabase
      .from("parking_lots")
      .select("*", { count: "exact" })
      .eq("status", "active")

    return NextResponse.json({
      success: true,
      count: count,
      lotsFound: data?.length || 0,
      lots: data,
      error: error,
      rlsEnabled: true,
      message: "Direct database query test",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        message: "Test endpoint error",
      },
      { status: 500 },
    )
  }
}
