export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter opacity-20 blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white font-sans">Find, Book </span>
                <span className="gradient-text font-sans">&</span>
                <span className="text-white font-sans"> Park</span>
                <br />
                <span className="gradient-text font-sans">Smart</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Revolutionary smart parking solution with real-time availability, instant booking, and seamless payment
                integration.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105">
                Get Started
              </button>
              <button className="glass-button px-8 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-2xl font-bold gradient-text">500K+</p>
                <p className="text-sm text-gray-400">Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">50K+</p>
                <p className="text-sm text-gray-400">Parking Spots</p>
              </div>
              <div>
                <p className="text-2xl font-bold gradient-text">24/7</p>
                <p className="text-sm text-gray-400">Support</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 md:h-full flex items-center justify-center">
            <div className="absolute inset-0 glass-card rounded-2xl"></div>
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Animated Illustration */}
                <div className="float-animation">
                  <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Car Illustration */}
                    <circle cx="200" cy="200" r="150" fill="url(#gradient)" opacity="0.1" />
                    <path
                      d="M150 220 Q150 240 170 240 L230 240 Q250 240 250 220 L250 180 Q250 170 240 170 L160 170 Q150 170 150 180 Z"
                      fill="#3B82F6"
                      opacity="0.8"
                    />
                    <circle cx="170" cy="245" r="15" fill="#1a2a5a" opacity="0.6" />
                    <circle cx="230" cy="245" r="15" fill="#1a2a5a" opacity="0.6" />
                    <path
                      d="M160 180 L160 160 Q160 150 170 150 L230 150 Q240 150 240 160 L240 180"
                      fill="#60A5FA"
                      opacity="0.6"
                    />

                    {/* Parking Spots */}
                    <g opacity="0.5">
                      <rect x="80" y="280" width="40" height="50" fill="none" stroke="#3B82F6" strokeWidth="2" />
                      <text x="100" y="315" textAnchor="middle" fill="#3B82F6" fontSize="20" fontWeight="bold">
                        P
                      </text>

                      <rect x="280" y="280" width="40" height="50" fill="none" stroke="#60A5FA" strokeWidth="2" />
                      <text x="300" y="315" textAnchor="middle" fill="#60A5FA" fontSize="20" fontWeight="bold">
                        P
                      </text>
                    </g>

                    {/* GPS Marker */}
                    <circle cx="200" cy="120" r="8" fill="#3B82F6" />
                    <path d="M200 128 L200 140" stroke="#3B82F6" strokeWidth="2" />

                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#60A5FA" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
