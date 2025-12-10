interface MapViewProps {
  latitude: number
  longitude: number
  name: string
  address: string
}

export default function MapView({ latitude, longitude, name, address }: MapViewProps) {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${latitude},${longitude}`

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Location</h3>
      <div className="space-y-3 mb-4">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-400">{address}</p>
      </div>
      <div className="relative h-80 rounded-lg overflow-hidden bg-white/5 border border-white/10">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <p className="mb-2">Map View</p>
            <p className="text-xs">
              Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
