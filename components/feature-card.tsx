interface Feature {
  title: string
  description: string
  icon: string
  color: string
}

interface FeatureCardProps {
  feature: Feature
  index: number
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <div
      className="glass-card rounded-2xl p-8 group hover:shadow-2xl transition-all duration-500"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="space-y-4">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} to-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}
        >
          {feature.icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>

        {/* Bottom Accent Line */}
        <div className="h-1 w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-500 rounded-full mt-4"></div>
      </div>
    </div>
  )
}
