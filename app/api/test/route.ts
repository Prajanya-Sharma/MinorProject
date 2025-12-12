import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface SensorDistances {
  centre_distance: number
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
  const { centre_distance, left_distance, right_distance } = distances;

  const warnings: string[] = [];

  // ===== STATUS LOGIC =====
  // New logic:
  // - If all distances are large (>= UNOCCUPIED_DISTANCE) and roughly equal -> empty
  // - If centre is close (<= OCCUPIED_THRESHOLD) and left/right are symmetric -> occupied
  // - If centre indicates occupied but left/right are noticeably asymmetric -> misparked
  const UNOCCUPIED_DISTANCE = 200 // cm - distances this large indicate no vehicle
  const UNOCCUPIED_TOLERANCE = 10 // cm tolerance for 'equal' when unoccupied
  const OCCUPIED_THRESHOLD = 80 // cm - centre distance below this indicates vehicle present

  // Quick empty check: all distances large and roughly equal
  const maxDist = Math.max(centre_distance, left_distance, right_distance)
  const minDist = Math.min(centre_distance, left_distance, right_distance)
  if (minDist >= UNOCCUPIED_DISTANCE && (maxDist - minDist) <= UNOCCUPIED_TOLERANCE) {
    return {
      status: "empty",
      alignment: "centered",
      is_misparked: false,
      quality_score: 100,
      warnings: [],
      metrics: {
        center_offset_cm: centre_distance,
        angle_deviation_deg: 0,
        space_utilization: 0,
      },
    }
  }

  // If centre indicates occupied, proceed to alignment checks
  const status: ParkingAnalysis["status"] = centre_distance <= OCCUPIED_THRESHOLD ? "occupied" : "empty";

  // ===== ALIGNMENT LOGIC =====
  const alignmentDiff = Math.abs(left_distance - right_distance);
  const alignmentThreshold = 10; // distances within 10cm considered symmetric
  const MISPARK_THRESHOLD = 25; // above this considered misparked
  const severeMisalignThreshold = 80; // keep severe threshold for extreme cases

  let alignment: ParkingAnalysis["alignment"];


  if (alignmentDiff <= alignmentThreshold) {
    alignment = "centered";
  } else if (alignmentDiff <= MISPARK_THRESHOLD) {
    // Some bias but still acceptable parking (slightly off-center)
    alignment = left_distance < right_distance ? "left_biased" : "right_biased";
    warnings.push(`Vehicle slightly ${alignment.replace("_", " ")} by ${alignmentDiff.toFixed(1)}cm`);
  } else if (alignmentDiff < severeMisalignThreshold) {
    // Significant bias - treat as misparked
    alignment = left_distance < right_distance ? "left_biased" : "right_biased";
    warnings.push(`Misparking suspected: ${alignment.replace("_", " ")} by ${alignmentDiff.toFixed(1)}cm`);
  } else {
    alignment = "severely_misaligned";
    warnings.push(`Severe misalignment detected: ${alignmentDiff.toFixed(1)}cm difference`);
  }

  // ===== MISPARKED LOGIC =====
  const is_misparked = alignment === "severely_misaligned" || alignmentDiff >= MISPARK_THRESHOLD

  // ===== MINIMAL METRICS RETURNED =====
  return {
    status,
    alignment,
    is_misparked,
    quality_score: is_misparked ? 0 : 100, // keep field for compatibility
    warnings,
    metrics: {
      center_offset_cm: centre_distance, // simply return raw values
      angle_deviation_deg: 0,            // ignored
      space_utilization: 0               // ignored
    },
  };
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Distances MUST come in the JSON body with these exact keys:
    // `left_distance`, `centre_distance`, `right_distance` (all in cm)
    const left_distance = body.left_distance !== undefined ? Number(body.left_distance) : undefined
    const centre_distance = body.centre_distance !== undefined ? Number(body.centre_distance) : undefined
    const right_distance = body.right_distance !== undefined ? Number(body.right_distance) : undefined

    // The ESP32 will POST only the three distances in the JSON body.
    // Identify the lot and spot via headers when available (x-lot-id, x-spot-number).
    const spot_number = request.headers.get("x-spot-number") || "A36"
    const lotId = request.headers.get("x-lot-id") || "4a41c3f7-015d-44eb-8d63-c22f101c1c36"
    const timestamp = body.timestamp || Date.now()

    console.log("[v0] Sensor webhook received:", {
      spot_number,
      lotId,
      distances: { centre_distance, left_distance, right_distance },
    })

    if (
      centre_distance === undefined ||
      left_distance === undefined ||
      right_distance === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required distance fields in body: left_distance, centre_distance, right_distance",
        },
        { status: 400 },
      )
    }

    const supabase = await createClient()

    // Require lot identification via header `x-lot-id` (or body fallback). Without lotId
    // we cannot insert a parking_events row because `lot_id` is required by the schema.
    if (!lotId) {
      return NextResponse.json({ error: "Missing lot identification header: x-lot-id" }, { status: 400 })
    }

    if (!spot_number) {
      return NextResponse.json({ error: "Missing spot identification header: x-spot-number" }, { status: 400 })
    }

    // Fetch lot info for push notifications and available_spots
    const { data: lot, error: lotError } = await supabase.from("parking_lots").select("*").eq("id", lotId).single()
    if (lotError || !lot) {
      console.error("[v0] Lot not found:", lotError)
      return NextResponse.json({ error: "Invalid lot id" }, { status: 400 })
    }

    // Fetch last two sensor events for this lot & spot to determine stability
    const { data: prevEvents } = await supabase
      .from("parking_events")
      .select("sensor_data")
      .eq("lot_id", lotId)
      .eq("spot_number", spot_number)
      .order("detected_at", { ascending: false })
      .limit(2)

    // parse last two raw distances if available
    const prevReadings: SensorDistances[] = []
    if (prevEvents && Array.isArray(prevEvents)) {
      for (const ev of prevEvents) {
        try {
          const raw = (ev as any).sensor_data?.raw_distances
          if (raw && raw.left_distance !== undefined && raw.centre_distance !== undefined && raw.right_distance !== undefined) {
            prevReadings.push({
              left_distance: Number(raw.left_distance),
              centre_distance: Number(raw.centre_distance),
              right_distance: Number(raw.right_distance),
            })
          }
        } catch {}
      }
    }

    const lastTwoSame = prevReadings.length === 2 &&
      prevReadings[0].left_distance === prevReadings[1].left_distance &&
      prevReadings[0].centre_distance === prevReadings[1].centre_distance &&
      prevReadings[0].right_distance === prevReadings[1].right_distance

    // Compute current analysis using the canonical keys
    const analysis = analyzeParkingQuality({
      centre_distance: Number(centre_distance),
      left_distance: Number(left_distance),
      right_distance: Number(right_distance),
      timestamp,
    })

    // Map analysis.status/alignment to simplified parking_status: misparked | parked | empty
    let parking_status: "misparked" | "parked" | "empty" = "empty"
    if (analysis.is_misparked && analysis.status === "occupied") parking_status = "misparked"
    else if (analysis.status === "occupied") parking_status = "parked"
    else parking_status = "empty"

    // Determine last stable status (if last two readings were stable)
    let lastStableStatus: "misparked" | "parked" | "empty" | null = null
    if (lastTwoSame) {
      const last = prevReadings[0]
      const lastAnalysis = analyzeParkingQuality(last)
      if (lastAnalysis.is_misparked && lastAnalysis.status === "occupied") lastStableStatus = "misparked"
      else if (lastAnalysis.status === "occupied") lastStableStatus = "parked"
      else lastStableStatus = "empty"
    }

    // Detect transition only when prior state was stable. If prior state unstable, ignore transitions.
    let transition: "entry" | "exit" | "none" = "none"
    if (lastStableStatus !== null) {
      if (lastStableStatus === "empty" && parking_status !== "empty") transition = "entry"
      else if (lastStableStatus !== "empty" && parking_status === "empty") transition = "exit"
    }

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

    // Capture prior booking parking_status (fetched from DB) for before/after logging
    const priorBookingStatus = activeBooking?.parking_status ?? null
    if (activeBooking) {
      console.log("[v0] Prior booking.parking_status from DB:", { bookingId: activeBooking.id, priorBookingStatus })
    }

    // Determine event type based on detected transition and parking status
    let event_type: "sensor_update" | "entry" | "exit" | "misparked" = "sensor_update"
    if (transition === "entry") event_type = "entry"
    else if (transition === "exit") event_type = "exit"
    else if (parking_status === "misparked") event_type = "misparked"

    // Create parking event with full analysis
    // Log final calculated parameters using the JSON keys the ESP32 sends
    console.log("[v0] Computed sensor params:", {
      left_distance,
      centre_distance,
      right_distance,
      stable: lastTwoSame,
      transition,
      parking_status,
      event_type,
      spot_number,
      lotId,
      timestamp,
    })

    const { data: event, error: eventError } = await supabase
      .from("parking_events")
      .insert({
        lot_id: lotId,
        booking_id: activeBooking?.id || null,
        spot_number,
        event_type,
        sensor_data: {
          raw_distances: { centre_distance: Number(centre_distance), left_distance: Number(left_distance), right_distance: Number(right_distance) },
          analysis,
          stable: lastTwoSame,
          transition,
          parking_status,
          timestamp,
        },
      })
      .select()
      .single()

    if (eventError) {
      console.error("[v0] Error creating parking event:", eventError)
      return NextResponse.json({ error: "Failed to create parking event" }, { status: 500 })
    }

    // Update booking.parking_status for the active booking (if one exists)
    if (activeBooking) {
      let bookingParkingStatus: string | null = null
      if (parking_status === "misparked") bookingParkingStatus = "misparked"
      else if (parking_status === "parked") bookingParkingStatus = "normal"
      else if (parking_status === "empty") bookingParkingStatus = "normal"

      if (bookingParkingStatus && activeBooking.parking_status !== bookingParkingStatus) {
        try {
          await supabase
            .from("bookings")
            .update({ parking_status: bookingParkingStatus })
            .eq("id", activeBooking.id)
        } catch (err) {
          console.error("[v0] Failed to update booking parking_status:", err)
        }
      }
    }

    // After processing, fetch latest parking_status from DB and log before/after
    if (activeBooking) {
      try {
        const { data: latestBooking } = await supabase
          .from("bookings")
          .select("parking_status")
          .eq("id", activeBooking.id)
          .single()

        console.log("[v0] Booking.parking_status before/after:", {
          bookingId: activeBooking.id,
          before: priorBookingStatus,
          after: latestBooking?.parking_status ?? null,
        })
      } catch (err) {
        console.error("[v0] Failed to fetch latest booking.parking_status:", err)
      }
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
          sendPushNotification(lot.user_id, {
            title: "Misparking Alert",
            body: `Vehicle misparked at ${lot.name}, Spot ${spot_number}. Quality: ${analysis.quality_score}/100`,
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

      await sendPushNotification(lot.user_id, {
        title: "Vehicle Entry",
        body: `Vehicle entered ${lot.name}, Spot ${spot_number}`,
        data: { type: "entry", bookingId: activeBooking.id, lotId },
      })
    }

    // Handle exit
    if (event_type === "exit" && activeBooking) {
      await supabase.from("bookings").update({ status: "completed" }).eq("id", activeBooking.id)

      // Increment available_spots safely using the last-known lot value from sensorConfig
      try {
        const currentAvailable = Number(lot.available_spots ?? 0)
        await supabase
          .from("parking_lots")
          .update({
            available_spots: currentAvailable + 1,
          })
          .eq("id", lotId)
      } catch (err) {
        // Fallback: attempt plain update without raw arithmetic
        await supabase.from("parking_lots").update({}).eq("id", lotId)
      }

      await Promise.all([
        sendPushNotification(activeBooking.user_id, {
          title: "Parking Session Completed",
          body: `Thank you for using ${lot.name}`,
          data: { type: "exit", bookingId: activeBooking.id },
        }),
        sendPushNotification(lot.user_id, {
          title: "Vehicle Exit",
          body: `Vehicle exited ${lot.name}, Spot ${spot_number}`,
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

