export default function LoadingSkeleton() {
  return (
    <div className="glass-card rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-white/5" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-white/10 rounded w-3/4" />

        {/* Address */}
        <div className="h-4 bg-white/10 rounded w-full" />

        {/* Rating */}
        <div className="h-4 bg-white/10 rounded w-1/2" />

        {/* Availability bar */}
        <div className="space-y-1">
          <div className="h-3 bg-white/10 rounded w-full" />
          <div className="h-2 bg-white/5 rounded w-full" />
        </div>

        {/* Amenities */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-white/10 rounded w-16" />
          <div className="h-6 bg-white/10 rounded w-16" />
          <div className="h-6 bg-white/10 rounded w-16" />
        </div>

        {/* Button */}
        <div className="h-10 bg-white/10 rounded w-full mt-4" />
      </div>
    </div>
  )
}
