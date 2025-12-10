export default function CTASection() {
  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter opacity-30 blur-3xl animate-pulse"></div>
        </div>

        {/* CTA Card */}
        <div className="relative glass-card rounded-3xl p-12 md:p-16 text-center space-y-8 border border-blue-500/20">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="text-white">Ready to</span>
            <br />
            <span className="gradient-text font-sans font-extrabold">Park Smart?</span>
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join thousands of users enjoying hassle-free parking with real-time availability and instant booking
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-8 py-4 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105">
              Download App Now
            </button>
            <button className="glass-button px-8 py-4 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-300">
              View Demo
            </button>
          </div>

          {/* App Store Badges */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <div className="glass-card rounded-lg px-6 py-3 hover:bg-white/20 transition-all cursor-pointer">
              <p className="text-sm text-gray-300">Available on</p>
              <p className="text-white font-semibold">App Store</p>
            </div>
            <div className="glass-card rounded-lg px-6 py-3 hover:bg-white/20 transition-all cursor-pointer">
              <p className="text-sm text-gray-300">Available on</p>
              <p className="text-white font-semibold">Google Play</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
