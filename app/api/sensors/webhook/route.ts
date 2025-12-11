import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface SensorDistances {
  center_distance: number
  left_distance: number
  right_distance: number
  timestamp?: number
}

interface ParkingAnalysis {
  status: "occupied" | "empty" | "entering" | "exiting"
  alignment: "centered" | "left_biased" | "right_biased" | "severely_misaligned"
  quality_score: number
  is_misparked: boolean
  warnings: string[]
  metrics: {
    center_offset_cm: number
    angle_deviation_deg: number
    space_utilization: number
  }
}

function analyzeParkingQuality(distances: SensorDistances): ParkingAnalysis {
  const { center_distance, left_distance, right_distance } = distances;

  const warnings: string[] = [];

  // ===== STATUS LOGIC =====
  // Only center sensor determines empty/occupied
  const status: ParkingAnalysis["status"] =
    center_distance <= 80 ? "occupied" : "empty";

  // ===== ALIGNMENT LOGIC =====
  const alignmentDiff = Math.abs(left_distance - right_distance);
  const alignmentThreshold = 15; // Default threshold
  const severeMisalignThreshold = 80; // Updated severe threshold

  let alignment: ParkingAnalysis["alignment"];

  if (alignmentDiff <= alignmentThreshold) {
    alignment = "centered";
  } else if (alignmentDiff <= alignmentThreshold * 2) {
    alignment =
      left_distance < right_distance ? "left_biased" : "right_biased";
    warnings.push(
      `Vehicle is ${alignment.replace("_", " ")} by ${alignmentDiff.toFixed(1)}cm`
    );
  } else if (alignmentDiff < severeMisalignThreshold) {
    // Still biased but not severe
    alignment =
      left_distance < right_distance ? "left_biased" : "right_biased";
    warnings.push(
      `Vehicle is ${alignment.replace("_", " ")} by ${alignmentDiff.toFixed(1)}cm`
    );
  } else {
    alignment = "severely_misaligned";
    warnings.push(
      `Severe misalignment detected: ${alignmentDiff.toFixed(1)}cm difference`
    );
  }

  // ===== MISPARKED LOGIC =====
  const is_misparked = alignment === "severely_misaligned";

  // ===== MINIMAL METRICS RETURNED =====
  return {
    status,
    alignment,
    is_misparked,
    quality_score: is_misparked ? 0 : 100, // keep field for compatibility
    warnings,
    metrics: {
      center_offset_cm: center_distance, // simply return raw values
      angle_deviation_deg: 0,            // ignored
      space_utilization: 0               // ignored
    },
  };
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sensor_id, api_key, spot_number, center_distance, left_distance, right_distance, timestamp } = body

    console.log("[v0] Sensor webhook received:", {
      sensor_id,
      spot_number,
      distances: { center_distance, left_distance, right_distance },
    })

    if (
      !sensor_id ||
      !api_key ||
      !spot_number ||
      center_distance === undefined ||
      left_distance === undefined ||
      right_distance === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: sensor_id, api_key, spot_number, center_distance, left_distance, right_distance",
        },
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
    await supabase
      .from("sensor_configs")
      .update({
        last_heartbeat: new Date().toISOString(),
      })
      .eq("id", sensorConfig.id)

    const lotId = sensorConfig.lot_id

    // Analyze parking quality
    const analysis = analyzeParkingQuality({
      center_distance,
      left_distance,
      right_distance,
      timestamp,
    })

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

    // Determine event type based on status transition
    let event_type = "sensor_update"
    if (analysis.status === "entering") event_type = "entry"
    if (analysis.status === "exiting") event_type = "exit"
    if (analysis.is_misparked && analysis.status === "occupied") event_type = "misparked"

    // Create parking event with full analysis
    const { data: event, error: eventError } = await supabase
      .from("parking_events")
      .insert({
        lot_id: lotId,
        booking_id: activeBooking?.id || null,
        spot_number,
        event_type,
        sensor_data: {
          raw_distances: { center_distance, left_distance, right_distance },
          analysis,
          timestamp: timestamp || Date.now(),
        },
      })
      .select()
      .single()

    if (eventError) {
      console.error("[v0] Error creating parking event:", eventError)
      return NextResponse.json({ error: "Failed to create parking event" }, { status: 500 })
    }

    // Handle misparking
    if (analysis.is_misparked && activeBooking) {
      // Update booking parking status
      await supabase
        .from("bookings")
        .update({
          parking_status: "misparked",
        })
        .eq("id", activeBooking.id)

      // Check if penalty already exists for this booking
      const { data: existingPenalty } = await supabase
        .from("penalties")
        .select("*")
        .eq("booking_id", activeBooking.id)
        .eq("penalty_type", "misparking")
        .eq("status", "pending")
        .single()

      if (!existingPenalty) {
        const penaltyAmount = 50.0
        const { data: penalty } = await supabase
          .from("penalties")
          .insert({
            booking_id: activeBooking.id,
            lot_id: lotId,
            user_id: activeBooking.user_id,
            penalty_type: "misparking",
            amount: penaltyAmount,
            reason: `Parking quality score: ${analysis.quality_score}/100. ${analysis.warnings.join(". ")}`,
            status: "pending",
          })
          .select()
          .single()

        // Send notifications
        await Promise.all([
          sendPushNotification(activeBooking.user_id, {
            title: "Misparking Detected!",
            body: `Quality score: ${analysis.quality_score}/100. Please reposition your vehicle. Penalty: $${penaltyAmount}`,
            data: { type: "misparking", bookingId: activeBooking.id, penaltyId: penalty?.id },
          }),
          sendPushNotification(sensorConfig.parking_lots.user_id, {
            title: "Misparking Alert",
            body: `Vehicle misparked at ${sensorConfig.parking_lots.name}, Spot ${spot_number}. Quality: ${analysis.quality_score}/100`,
            data: { type: "misparking_owner", bookingId: activeBooking.id, lotId },
          }),
        ])
      }
    } else if (!analysis.is_misparked && activeBooking?.parking_status === "misparked") {
      // Car was repositioned correctly
      await supabase
        .from("bookings")
        .update({
          parking_status: "normal",
        })
        .eq("id", activeBooking.id)

      await sendPushNotification(activeBooking.user_id, {
        title: "Parking Corrected",
        body: `Thank you for repositioning your vehicle. Quality score: ${analysis.quality_score}/100`,
        data: { type: "parking_corrected", bookingId: activeBooking.id },
      })
    }

    // Handle entry
    if (event_type === "entry" && activeBooking) {
      if (activeBooking.status === "upcoming") {
        await supabase.from("bookings").update({ status: "active" }).eq("id", activeBooking.id)
      }

      await sendPushNotification(sensorConfig.parking_lots.user_id, {
        title: "Vehicle Entry",
        body: `Vehicle entered ${sensorConfig.parking_lots.name}, Spot ${spot_number}`,
        data: { type: "entry", bookingId: activeBooking.id, lotId },
      })
    }

    // Handle exit
    if (event_type === "exit" && activeBooking) {
      await supabase.from("bookings").update({ status: "completed" }).eq("id", activeBooking.id)

      await supabase
        .from("parking_lots")
        .update({
          available_spots: supabase.raw("available_spots + 1"),
        })
        .eq("id", lotId)

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

    return NextResponse.json({
      success: true,
      event,
      analysis,
      message: analysis.warnings.length > 0 ? analysis.warnings.join(". ") : "Parking data recorded successfully",
    })
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
