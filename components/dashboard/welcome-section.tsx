import { formatDate } from "@/lib/utils"

export default function WelcomeSection({ user }: { user: any }) {
  const firstName = user.name?.split(" ")[0] || "User"
  const currentTime = new Date()
  const timeOfDay = currentTime.getHours() < 12 ? "morning" : currentTime.getHours() < 18 ? "afternoon" : "evening"

  return (
    <div className="glass-card p-8 rounded-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, <span className="gradient-text">{firstName}</span>!
          </h1>
          <p className="text-foreground/70">Good {timeOfDay}! Here's your parking dashboard overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-foreground/70">{formatDate(new Date())}</p>
          <p className="text-lg text-primary font-semibold">{currentTime.toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  )
}
