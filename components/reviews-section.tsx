"use client"

import { useState, useEffect } from "react"
import { Star, Loader } from "lucide-react"

interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

interface ReviewsSectionProps {
  lotId: string
}

export default function ReviewsSection({ lotId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent")

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (filterRating) params.append("rating", filterRating.toString())
        params.append("sort", sortBy)

        const response = await fetch(`/api/lots/${lotId}/reviews?${params}`)
        if (!response.ok) throw new Error("Failed to fetch reviews")
        const data = await response.json()
        setReviews(data)
      } catch (err) {
        console.error("Failed to fetch reviews:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [lotId, filterRating, sortBy])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Reviews</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <label className="text-sm text-gray-400">Filter by rating:</label>
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setFilterRating(filterRating === rating ? null : rating)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                filterRating === rating ? "bg-primary text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {rating}★
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <label className="text-sm text-gray-400">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "recent" | "helpful")}
            className="px-3 py-1 rounded-lg text-sm bg-white/5 text-gray-300 border border-white/20 focus:border-primary outline-none"
          >
            <option value="recent">Recent</option>
            <option value="helpful">Helpful</option>
          </select>
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="glass-card p-6 rounded-xl">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{review.userName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">No reviews yet</div>
        )}
      </div>

      {/* Load More */}
      {reviews.length > 0 && (
        <button className="w-full py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition font-semibold">
          Load More Reviews
        </button>
      )}
    </div>
  )
}
