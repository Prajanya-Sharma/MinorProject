import { ParkingSpotMonitor } from "@/components/parking-spot-monitor"

export default async function MonitorPage({
  params,
}: {
  params: Promise<{ spotId: string }>
}) {
  const { spotId } = await params

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Real-Time Parking Monitor</h1>
      <ParkingSpotMonitor spotNumber={spotId} />
    </div>
  )
}
