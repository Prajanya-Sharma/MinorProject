"use client"

type BookingStatus = "active" | "upcoming" | "completed" | "cancelled"
type SortOption = "date-newest" | "cost-highest"

interface BookingFiltersProps {
  activeStatus: BookingStatus
  onStatusChange: (status: BookingStatus) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

const statusTabs = [
  { id: "active" as BookingStatus, label: "Active", icon: "🟢" },
  { id: "upcoming" as BookingStatus, label: "Upcoming", icon: "🔵" },
  { id: "completed" as BookingStatus, label: "Completed", icon: "⚪" },
  { id: "cancelled" as BookingStatus, label: "Cancelled", icon: "🔴" },
]

export function BookingFilters({ activeStatus, onStatusChange, sortBy, onSortChange }: BookingFiltersProps) {
  return (
    <div className="mb-8">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onStatusChange(tab.id)}
            className={`px-4 py-2 rounded-lg transition-all font-medium ${
              activeStatus === tab.id
                ? "glass-card bg-blue-500/30 border-blue-400/50 text-white"
                : "glass-card text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex gap-3 items-center">
        <span className="text-white/60 text-sm">Sort by:</span>
        <button
          onClick={() => onSortChange("date-newest")}
          className={`px-3 py-1 text-sm rounded-lg transition-all ${
            sortBy === "date-newest"
              ? "glass-card bg-blue-500/30 border-blue-400/50 text-white"
              : "glass-card text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          Newest First
        </button>
        <button
          onClick={() => onSortChange("cost-highest")}
          className={`px-3 py-1 text-sm rounded-lg transition-all ${
            sortBy === "cost-highest"
              ? "glass-card bg-blue-500/30 border-blue-400/50 text-white"
              : "glass-card text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          Highest Cost
        </button>
      </div>
    </div>
  )
}
