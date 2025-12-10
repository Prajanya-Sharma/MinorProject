"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader, Upload, X } from "lucide-react"
import Link from "next/link"

interface LotFormState {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  totalSpots: string
  pricePerHour: string
  description: string
  amenities: {
    lighting: boolean
    cctv: boolean
    covered: boolean
    evCharging: boolean
  }
  imageUrl: string | null
  errors: Record<string, string>
  isLoading: boolean
  isSuccess: boolean
}

export default function AddLotPage() {
  const [formState, setFormState] = useState<LotFormState>({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    totalSpots: "",
    pricePerHour: "",
    description: "",
    amenities: {
      lighting: false,
      cctv: false,
      covered: false,
      evCharging: false,
    },
    imageUrl: null,
    errors: {},
    isLoading: false,
    isSuccess: false,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formState.name.trim()) newErrors.name = "Lot name is required"
    if (!formState.address.trim()) newErrors.address = "Address is required"
    if (!formState.city.trim()) newErrors.city = "City is required"
    if (!formState.state.trim()) newErrors.state = "State is required"
    if (!formState.zipCode.trim()) newErrors.zipCode = "Zip code is required"
    if (!formState.totalSpots.trim()) newErrors.totalSpots = "Total spots is required"
    else if (isNaN(Number(formState.totalSpots)) || Number(formState.totalSpots) <= 0)
      newErrors.totalSpots = "Must be a positive number"
    if (!formState.pricePerHour.trim()) newErrors.pricePerHour = "Price per hour is required"
    else if (isNaN(Number(formState.pricePerHour)) || Number(formState.pricePerHour) <= 0)
      newErrors.pricePerHour = "Must be a positive number"

    setFormState((prev) => ({ ...prev, errors: newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: "" },
    }))
  }

  const handleAmenityChange = (amenity: keyof LotFormState["amenities"]) => {
    setFormState((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, image: "Please select a valid image file" },
      }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, image: "File size must be less than 5MB" },
      }))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setIsUploadingImage(true)
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/lots/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to upload image")
      }

      const data = await response.json()
      setFormState((prev) => ({
        ...prev,
        imageUrl: data.url,
        errors: { ...prev.errors, image: "" },
      }))
    } catch (err) {
      console.error("[v0] Error uploading image:", err)
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, image: err instanceof Error ? err.message : "Failed to upload image" },
      }))
      setImagePreview(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setFormState((prev) => ({ ...prev, imageUrl: null }))
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setFormState((prev) => ({ ...prev, isLoading: true, isSuccess: false }))

      const response = await fetch("/api/lots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          address: formState.address,
          city: formState.city,
          state: formState.state,
          zipCode: formState.zipCode,
          totalSpots: formState.totalSpots,
          pricePerHour: formState.pricePerHour,
          description: formState.description,
          amenities: formState.amenities,
          imageUrl: formState.imageUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create parking lot")
      }

      const data = await response.json()
      console.log("[v0] Parking lot created:", data)

      setFormState((prev) => ({
        ...prev,
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        totalSpots: "",
        pricePerHour: "",
        description: "",
        amenities: {
          lighting: false,
          cctv: false,
          covered: false,
          evCharging: false,
        },
        imageUrl: null,
        isLoading: false,
        isSuccess: true,
      }))
      setImagePreview(null)

      setTimeout(() => {
        window.location.href = "/my-lots"
      }, 2000)
    } catch (err) {
      console.error("[v0] Error submitting form:", err)
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        errors: { submit: "Failed to create parking lot. Please try again." },
      }))
    }
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <Link href="/my-lots" className="text-blue-400 hover:text-blue-300 text-sm font-medium mb-4 inline-block">
            ← Back to My Lots
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Add a New Parking Lot</h1>
          <p className="text-white/60">Fill in the details below to list your parking lot for rent</p>
        </div>

        {/* Success Message */}
        {formState.isSuccess && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg animate-in fade-in">
            <p className="text-green-400">Parking lot created successfully! Redirecting...</p>
          </div>
        )}

        {/* Error Message */}
        {formState.errors.submit && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-200">{formState.errors.submit}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="glass-card p-8 rounded-xl space-y-6">
            <h2 className="text-2xl font-bold text-white">Parking Lot Image</h2>

            {imagePreview || formState.imageUrl ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-blue-400/30 bg-white/5">
                <img
                  src={imagePreview || formState.imageUrl || ""}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploadingImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/30 rounded-lg cursor-pointer hover:bg-white/5 transition">
                {isUploadingImage ? (
                  <Loader className="w-10 h-10 text-blue-400 animate-spin mb-2" />
                ) : (
                  <Upload className="w-10 h-10 text-blue-400 mb-2" />
                )}
                <p className="text-sm text-white">{isUploadingImage ? "Uploading..." : "Click to upload image"}</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF (Max 5MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>
            )}

            {formState.errors.image && <p className="text-red-400 text-sm">{formState.errors.image}</p>}
          </div>

          {/* Basic Information Section */}
          <div className="glass-card p-8 rounded-xl space-y-6">
            <h2 className="text-2xl font-bold text-white">Basic Information</h2>

            {/* Lot Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Parking Lot Name *</label>
              <input
                type="text"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="e.g., Downtown Parking Complex"
                className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none ${
                  formState.errors.name
                    ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                    : "border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
                }`}
              />
              {formState.errors.name && <p className="text-red-400 text-sm mt-1">{formState.errors.name}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Street Address *</label>
              <input
                type="text"
                name="address"
                value={formState.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Main Street"
                className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none ${
                  formState.errors.address
                    ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                    : "border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
                }`}
              />
              {formState.errors.address && <p className="text-red-400 text-sm mt-1">{formState.errors.address}</p>}
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formState.city}
                  onChange={handleInputChange}
                  placeholder="e.g., New York"
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none ${
                    formState.errors.city
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                      : "border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
                  }`}
                />
                {formState.errors.city && <p className="text-red-400 text-sm mt-1">{formState.errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formState.state}
                  onChange={handleInputChange}
                  placeholder="e.g., NY"
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none ${
                    formState.errors.state
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                      : "border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
                  }`}
                />
                {formState.errors.state && <p className="text-red-400 text-sm mt-1">{formState.errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formState.zipCode}
                  onChange={handleInputChange}
                  placeholder="e.g., 10001"
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none ${
                    formState.errors.zipCode
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                      : "border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
                  }`}
                />
                {formState.errors.zipCode && <p className="text-red-400 text-sm mt-1">{formState.errors.zipCode}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Description (Optional)</label>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Add details about your parking lot..."
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
              />
            </div>
          </div>

          {/* Pricing & Capacity Section */}
          <div className="glass-card p-8 rounded-xl space-y-6">
            <h2 className="text-2xl font-bold text-white">Pricing & Capacity</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Spots */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Total Parking Spots *</label>
                <input
                  type="number"
                  name="totalSpots"
                  value={formState.totalSpots}
                  onChange={handleInputChange}
                  placeholder="e.g., 150"
                  min="1"
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none ${
                    formState.errors.totalSpots
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                      : "border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
                  }`}
                />
                {formState.errors.totalSpots && (
                  <p className="text-red-400 text-sm mt-1">{formState.errors.totalSpots}</p>
                )}
              </div>

              {/* Price Per Hour */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Price Per Hour ($) *</label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={formState.pricePerHour}
                  onChange={handleInputChange}
                  placeholder="e.g., 5.00"
                  step="0.01"
                  min="0"
                  className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none ${
                    formState.errors.pricePerHour
                      ? "border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                      : "border-white/20 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
                  }`}
                />
                {formState.errors.pricePerHour && (
                  <p className="text-red-400 text-sm mt-1">{formState.errors.pricePerHour}</p>
                )}
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="glass-card p-8 rounded-xl space-y-6">
            <h2 className="text-2xl font-bold text-white">Amenities</h2>
            <p className="text-white/60 text-sm">Select the amenities available at your lot</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: "lighting", label: "24/7 Lighting", icon: "💡" },
                { id: "cctv", label: "CCTV Security", icon: "📹" },
                { id: "covered", label: "Covered/Roofed", icon: "🏢" },
                { id: "evCharging", label: "EV Charging", icon: "🔌" },
              ].map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => handleAmenityChange(amenity.id as keyof LotFormState["amenities"])}
                  className={`p-4 rounded-lg border-2 transition transform hover:scale-105 ${
                    formState.amenities[amenity.id as keyof LotFormState["amenities"]]
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-white/20 bg-white/5 hover:border-white/40"
                  }`}
                >
                  <div className="text-2xl mb-2">{amenity.icon}</div>
                  <p className="text-white font-medium text-sm">{amenity.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <Link href="/my-lots" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={formState.isLoading || isUploadingImage}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {formState.isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {formState.isLoading ? "Creating Lot..." : "Create Parking Lot"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
