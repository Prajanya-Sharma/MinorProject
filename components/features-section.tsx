import FeatureCard from "./feature-card"

const features = [
  {
    title: "Real-time Availability",
    description: "See available parking spots instantly across your city",
    icon: "📍",
    color: "from-blue-500",
  },
  {
    title: "One-Click Booking",
    description: "Reserve your parking spot in just seconds",
    icon: "⚡",
    color: "from-cyan-500",
  },
  {
    title: "Smart Navigation",
    description: "Get turn-by-turn directions to your reserved spot",
    icon: "🧭",
    color: "from-violet-500",
  },
  {
    title: "Instant Payment",
    description: "Secure digital payments integrated with all major methods",
    icon: "💳",
    color: "from-emerald-500",
  },
]

export default function FeaturesSection() {
  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-white">Powerful Features for </span>
            <span className="gradient-text">Smart Parking</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to find, book, and park with confidence
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
