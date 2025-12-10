import { Heart, MapPin } from "lucide-react"

export default function FavoriteLots({ lots }: { lots: any[] }) {
  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="text-lg font-bold text-foreground mb-4">Favorite Lots</h3>
      <div className="space-y-4">
        {lots.slice(0, 4).map((lot, index) => (
          <div
            key={index}
            className="group relative bg-white/5 p-4 rounded-lg hover:bg-white/10 transition border border-white/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground text-sm">{lot.name}</p>
                <div className="flex items-center gap-1 text-xs text-foreground/70 mt-1">
                  <MapPin className="w-3 h-3" />
                  {lot.distance || "0.5"} km away
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition">
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              </button>
            </div>
            <button className="w-full bg-primary/20 text-primary py-2 rounded text-xs font-semibold hover:bg-primary/30 transition">
              Quick Book
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
