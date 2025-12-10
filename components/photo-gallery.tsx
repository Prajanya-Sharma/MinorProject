"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface PhotoGalleryProps {
  photos: string[]
  lotName: string
}

export default function PhotoGallery({ photos, lotName }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const nextPhoto = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % photos.length)
  }

  const prevPhoto = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)
  }

  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Photos</h3>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {photos.slice(0, 8).map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className="relative h-32 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
          >
            <Image
              src={photo || "/placeholder.svg"}
              alt={`${lotName} photo ${idx + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl">
            <Image
              src={photos[selectedIndex] || "/placeholder.svg"}
              alt={`${lotName} photo ${selectedIndex + 1}`}
              width={800}
              height={600}
              className="w-full rounded-lg"
            />

            {/* Navigation Buttons */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
