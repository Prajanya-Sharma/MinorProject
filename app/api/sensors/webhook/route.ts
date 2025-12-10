import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sensor_id, api_key, event_type, spot_number, sensor_data } = body

    console.log("[v0] Sensor webhook received:", { sensor_id, event_type, spot_number })

    // Validate required fields
    if (!sensor_id || !api_key || !event_type || !spot_number) {
      return NextResponse.json(
        { error: "Missing required fields: sensor_id, api_key, event_type, spot_number" },
        { status: 400 },
      )
    }

    const supabase = await createClient()

    // Verify sensor credentials
    const { data: sensorConfig, error: sensorError } = await supabase
      .from("sensor_configs")
      .select("*, parking_lots(*)")
      .eq("sensor_id", sensor_id)
      .eq("api_key", api_key)
      .eq("status", "active")
      .single()

    if (sensorError || !sensorConfig) {
      console.error("[v0] Invalid sensor credentials:", sensorError)
      return NextResponse.json({ error: "Invalid sensor credentials" }, { status: 401 })
    }

    // Update sensor heartbeat
    await supabase.from("sensor_configs").update({ last_heartbeat: new Date().toISOString() }).eq("id", sensorConfig.id)

    const lotId = sensorConfig.lot_id

    // Find active booking for this spot
    const now = new Date().toISOString()
    const { data: activeBooking } = await supabase
      .from("bookings")
      .select("*")
      .eq("lot_id", lotId)
      .eq("spot_number", spot_number)
      .eq("status", "active")
      .lte("start_date", now)
      .gte("end_date", now)
      .single()

    // Create parking event
    const { data: event, error: eventError } = await supabase
      .from("parking_events")
      .insert({
        lot_id: lotId,
        booking_id: activeBooking?.id || null,
        spot_number,
        event_type,
        sensor_data: sensor_data || {},
      })
      .select()
      .single()

    if (eventError) {
      console.error("[v0] Error creating parking event:", eventError)
      return NextResponse.json({ error: "Failed to create parking event" }, { status: 500 })
    }

    // Handle different event types
    if (event_type === "misparked" && activeBooking) {
      // Update booking parking status
      await supabase.from("bookings").update({ parking_status: "misparked" }).eq("id", activeBooking.id)

      // Create penalty
      const penaltyAmount = 50.0 // $50 misparking fee
      const { data: penalty } = await supabase
        .from("penalties")
        .insert({
          booking_id: activeBooking.id,
          lot_id: lotId,
          user_id: activeBooking.user_id,
          penalty_type: "misparking",
          amount: penaltyAmount,
          reason: "Vehicle detected as misparked by sensor",
          status: "pending",
        })
        .select()
        .single()

      // Send notifications to both renter and owner
      await Promise.all([
        sendPushNotification(activeBooking.user_id, {
          title: "Misparking Detected!",
          body: `Your vehicle at ${sensorConfig.parking_lots.name} is misparked. Please correct immediately. Penalty: $${penaltyAmount}`,
          data: { type: "misparking", bookingId: activeBooking.id, penaltyId: penalty?.id },
        }),
        sendPushNotification(sensorConfig.parking_lots.user_id, {
          title: "Misparking Alert",
          body: `Vehicle misparked at ${sensorConfig.parking_lots.name}, Spot ${spot_number}`,
          data: { type: "misparking_owner", bookingId: activeBooking.id, lotId },
        }),
      ])

      return NextResponse.json({
        success: true,
        message: "Misparking detected and penalty applied",
        penalty: penaltyAmount,
      })
    }

    if (event_type === "entry" && activeBooking) {
      // Update booking status to active if it was upcoming
      if (activeBooking.status === "upcoming") {
        await supabase.from("bookings").update({ status: "active" }).eq("id", activeBooking.id)
      }

      // Notify owner of entry
      await sendPushNotification(sensorConfig.parking_lots.user_id, {
        title: "Vehicle Entry",
        body: `Vehicle entered ${sensorConfig.parking_lots.name}, Spot ${spot_number}`,
        data: { type: "entry", bookingId: activeBooking.id, lotId },
      })
    }

    if (event_type === "exit" && activeBooking) {
      // Update booking status to completed
      await supabase.from("bookings").update({ status: "completed" }).eq("id", activeBooking.id)

      // Update available spots
      await supabase
        .from("parking_lots")
        .update({
          available_spots: supabase.raw("available_spots + 1"),
        })
        .eq("id", lotId)

      // Notify both parties
      await Promise.all([
        sendPushNotification(activeBooking.user_id, {
          title: "Parking Session Completed",
          body: `Thank you for using ${sensorConfig.parking_lots.name}`,
          data: { type: "exit", bookingId: activeBooking.id },
        }),
        sendPushNotification(sensorConfig.parking_lots.user_id, {
          title: "Vehicle Exit",
          body: `Vehicle exited ${sensorConfig.parking_lots.name}, Spot ${spot_number}`,
          data: { type: "exit_owner", bookingId: activeBooking.id, lotId },
        }),
      ])
    }

    return NextResponse.json({ success: true, event })
  } catch (error) {
    console.error("[v0] Sensor webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to send push notifications
async function sendPushNotification(
  userId: string,
  payload: {
    title: string
    body: string
    data?: any
  },
) {
  try {
    const supabase = await createClient()

    // Get user's push subscriptions
    const { data: subscriptions } = await supabase.from("push_subscriptions").select("*").eq("user_id", userId)

    if (!subscriptions || subscriptions.length === 0) {
      console.log("[v0] No push subscriptions found for user:", userId)
      return
    }

    // Note: In production, you would use web-push library here
    // For now, this is a placeholder that logs the notification
    console.log("[v0] Would send push notification to user:", userId, payload)

    // TODO: Implement actual web push using web-push library
    // const webpush = require('web-push')
    // for (const subscription of subscriptions) {
    //   await webpush.sendNotification(
    //     {
    //       endpoint: subscription.endpoint,
    //       keys: {
    //         p256dh: subscription.p256dh,
    //         auth: subscription.auth
    //       }
    //     },
    //     JSON.stringify(payload)
    //   )
    // }
  } catch (error) {
    console.error("[v0] Error sending push notification:", error)
  }
}
