"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Car } from "lucide-react"
import { Progress } from "@/components/ui/progress"

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

interface SensorData {
  raw_distances: {
    center_distance: number
    left_distance: number
    right_distance: number
  }
  analysis: ParkingAnalysis
  timestamp: number
}

interface ParkingEvent {
  id: string
  spot_number: string
  event_type: string
  sensor_data: SensorData
  detected_at: string
  parking_lots: {
    name: string
    address: string
  }
}

export function ParkingSpotMonitor({ spotNumber, lotId }: { spotNumber: string; lotId?: string }) {
  const [event, setEvent] = useState<ParkingEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLatestData()
    const interval = setInterval(fetchLatestData, 5000) // Poll every 5 seconds
    return () => clearInterval(interval)
  }, [spotNumber])

  const fetchLatestData = async () => {
    try {
      const response = await fetch(`/api/sensors/live/${spotNumber}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      }
    } catch (error) {
      console.error("Error fetching sensor data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">Loading sensor data...</CardContent>
      </Card>
    )
  }

  if (!event || !event.sensor_data?.analysis) {
    return (
      <Card>
        <CardContent className="p-6">No sensor data available</CardContent>
      </Card>
    )
  }

  const { raw_distances, analysis } = event.sensor_data
  const { quality_score, status, alignment, is_misparked, warnings, metrics } = analysis

  const getStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-blue-500"
      case "empty":
        return "bg-green-500"
      case "entering":
        return "bg-yellow-500"
      case "exiting":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Spot {spotNumber}
            </CardTitle>
            <CardDescription>{event.parking_lots?.name}</CardDescription>
          </div>
          <Badge className={getStatusColor(status)}>{status.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Parking Quality Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Parking Quality</span>
            <span className={`text-2xl font-bold ${getQualityColor(quality_score)}`}>{quality_score}/100</span>
          </div>
          <Progress value={quality_score} className="h-3" />
          {is_misparked && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">MISPARKED - Repositioning Required</span>
            </div>
          )}
        </div>

        {/* Distance Sensors Visualization */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Sensor Readings</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Left</div>
              <div className="text-lg font-bold">
                {raw_distances.left_distance.toFixed(1)}
                <span className="text-xs ml-1">cm</span>
              </div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg border-2 border-primary">
              <div className="text-xs text-muted-foreground mb-1">Center</div>
              <div className="text-lg font-bold">
                {raw_distances.center_distance.toFixed(1)}
                <span className="text-xs ml-1">cm</span>
              </div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Right</div>
              <div className="text-lg font-bold">
                {raw_distances.right_distance.toFixed(1)}
                <span className="text-xs ml-1">cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alignment Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Alignment</h4>
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm">{alignment.replace(/_/g, " ").toUpperCase()}</span>
            {alignment === "centered" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Center Offset</div>
            <div className="text-lg font-bold">
              {metrics.center_offset_cm}
              <span className="text-xs ml-1">cm</span>
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Angle Deviation</div>
            <div className="text-lg font-bold">
              {metrics.angle_deviation_deg}
              <span className="text-xs ml-1">°</span>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-yellow-600">Warnings</h4>
            <ul className="space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {new Date(event.detected_at).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  )
}
