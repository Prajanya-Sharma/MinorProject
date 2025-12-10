import { NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    // const { db } = await connectToDatabase()

    // In a full app, you'd get userId from auth middleware
    // const user = await db.collection("users").findOne({ id: "user-1" })

    const user = {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      profilePic: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[v0] Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
