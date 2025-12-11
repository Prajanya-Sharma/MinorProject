module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/mock-data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock parking lot data with comprehensive details
__turbopack_context__.s([
    "mockBookings",
    ()=>mockBookings,
    "mockFavorites",
    ()=>mockFavorites,
    "mockParkingLots",
    ()=>mockParkingLots,
    "mockReviews",
    ()=>mockReviews
]);
const mockParkingLots = [
    {
        id: "1",
        name: "Downtown Plaza Garage",
        address: "123 Main St, Downtown",
        distance: 2.5,
        price_per_hour: 8,
        available_spots: 12,
        total_spots: 50,
        rating: 4.5,
        reviews: 234,
        amenities: [
            "CCTV",
            "24/7",
            "EV Charging"
        ],
        image_url: "/placeholder.svg?height=400&width=600",
        lot_type: "Garage",
        latitude: 40.7128,
        longitude: -74.006,
        description: "Modern multi-level garage in the heart of downtown with 24/7 security and fast electric vehicle charging. Perfect for long-term and short-term parking with easy access to shops and restaurants.",
        photos: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600"
        ],
        houseRules: [
            "Maximum height 6.5 feet",
            "No commercial vehicles",
            "Reserved spots not available",
            "24-hour cancellation policy"
        ],
        peakHoursPrice: 12,
        dailyRate: 50,
        monthlyRate: 800
    },
    {
        id: "2",
        name: "Riverside Lot",
        address: "456 Oak Ave, Riverside",
        distance: 1.2,
        price_per_hour: 5,
        available_spots: 28,
        total_spots: 75,
        rating: 4.2,
        reviews: 156,
        amenities: [
            "CCTV",
            "EV Charging"
        ],
        image_url: "/placeholder.svg?height=400&width=600",
        lot_type: "Lot",
        latitude: 40.7138,
        longitude: -74.016,
        description: "Large open-air parking lot near the riverside with excellent rates and spacious spots. Well-lit and monitored with convenient payment options and mobile app booking.",
        photos: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600"
        ],
        houseRules: [
            "Keep parking permit visible",
            "No overnight parking",
            "Report damage immediately",
            "Follow lot markings"
        ],
        dailyRate: 35
    },
    {
        id: "3",
        name: "Tech Center Garage",
        address: "789 Tech Blvd, Innovation District",
        distance: 3.8,
        price_per_hour: 10,
        available_spots: 5,
        total_spots: 120,
        rating: 4.8,
        reviews: 412,
        amenities: [
            "CCTV",
            "24/7",
            "EV Charging"
        ],
        image_url: "/placeholder.svg?height=400&width=600",
        lot_type: "Garage",
        latitude: 40.7148,
        longitude: -74.026,
        description: "Premium parking facility in the tech district with state-of-the-art security, climate-controlled spaces, and fast EV charging. Perfect for tech professionals with convenient access to major tech companies.",
        photos: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600"
        ],
        houseRules: [
            "Valid ID required",
            "No smoking in garage",
            "Designated loading zones",
            "After-hours security check required"
        ],
        peakHoursPrice: 15,
        dailyRate: 75,
        monthlyRate: 1200
    },
    {
        id: "4",
        name: "Harbor Street Parking",
        address: "321 Harbor Rd, Waterfront",
        distance: 0.8,
        price_per_hour: 6,
        available_spots: 18,
        total_spots: 30,
        rating: 4.0,
        reviews: 89,
        amenities: [
            "CCTV"
        ],
        image_url: "/placeholder.svg?height=400&width=600",
        lot_type: "Street",
        latitude: 40.7158,
        longitude: -74.036,
        description: "Prime waterfront street parking with scenic views and close proximity to restaurants and shops. Limited but highly sought-after spots in the heart of the waterfront district.",
        photos: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600"
        ],
        houseRules: [
            "2-hour time limit",
            "Meter required",
            "No weekend parking",
            "Validate parking ticket in shop"
        ],
        dailyRate: 45
    },
    {
        id: "5",
        name: "Shopping District Lot",
        address: "654 Mall Dr, Shopping Center",
        distance: 4.2,
        price_per_hour: 7,
        available_spots: 42,
        total_spots: 200,
        rating: 4.3,
        reviews: 567,
        amenities: [
            "CCTV",
            "24/7"
        ],
        image_url: "/placeholder.svg?height=400&width=600",
        lot_type: "Lot",
        latitude: 40.7168,
        longitude: -74.046,
        description: "Large shopping center parking with abundant spaces, clean facilities, and excellent customer service. Great for shopping trips with free first 30 minutes of parking for shoppers.",
        photos: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600"
        ],
        houseRules: [
            "Get parking validation from stores",
            "No reserved spots for shoppers",
            "Report full at peak hours",
            "Free exit lane available"
        ],
        dailyRate: 40,
        monthlyRate: 500
    },
    {
        id: "6",
        name: "Executive Suites Garage",
        address: "987 Corporate Way, Business Park",
        distance: 5.1,
        price_per_hour: 12,
        available_spots: 8,
        total_spots: 60,
        rating: 4.7,
        reviews: 198,
        amenities: [
            "CCTV",
            "24/7",
            "EV Charging"
        ],
        image_url: "/placeholder.svg?height=400&width=600",
        lot_type: "Garage",
        latitude: 40.7178,
        longitude: -74.056,
        description: "Exclusive parking facility for business professionals with reserved spots, valet service available, and proximity to major corporate offices. Premium amenities and white-glove service.",
        photos: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600"
        ],
        houseRules: [
            "Valid business card required",
            "Reserved spot assignment",
            "Valet parking available",
            "Monthly renewal required"
        ],
        peakHoursPrice: 18,
        dailyRate: 90,
        monthlyRate: 1500
    }
];
const mockReviews = [
    {
        id: "rev-1",
        lotId: "1",
        userName: "Sarah Chen",
        rating: 5,
        date: "2025-12-01",
        title: "Excellent downtown option",
        comment: "Clean, well-maintained, and the app made booking seamless. Will definitely use again!",
        verified: true
    },
    {
        id: "rev-2",
        lotId: "1",
        userName: "James Wilson",
        rating: 4,
        date: "2025-11-28",
        title: "Good but a bit pricey",
        comment: "Great location and security, but the hourly rate is higher than nearby options. Still worth it.",
        verified: true
    },
    {
        id: "rev-3",
        lotId: "1",
        userName: "Emily Rodriguez",
        rating: 4,
        date: "2025-11-25",
        title: "Easy to navigate",
        comment: "Clear signage and helpful staff. The EV charging station worked great too!",
        verified: true
    },
    {
        id: "rev-4",
        lotId: "2",
        userName: "Michael Brown",
        rating: 5,
        date: "2025-11-30",
        title: "Best value in the area",
        comment: "Affordable rates, plenty of spots available, and just minutes from downtown.",
        verified: true
    },
    {
        id: "rev-5",
        lotId: "3",
        userName: "David Park",
        rating: 5,
        date: "2025-12-02",
        title: "Premium experience worth every penny",
        comment: "Modern facility, top-notch security, and the fast charging for EVs is amazing.",
        verified: true
    }
];
const mockBookings = [
    {
        id: "book-1",
        lotId: "1",
        lotName: "Downtown Plaza Garage",
        address: "123 Main St, Downtown",
        startDate: "Dec 10, 2:00 PM",
        endDate: "Dec 10, 6:00 PM",
        duration: "4 hours",
        totalCost: 32,
        spotNumber: "A-12",
        status: "active",
        createdAt: new Date("2025-12-10T14:00:00").toISOString()
    },
    {
        id: "book-2",
        lotId: "3",
        lotName: "Tech Center Garage",
        address: "789 Tech Blvd, Innovation District",
        startDate: "Dec 15, 9:00 AM",
        endDate: "Dec 15, 5:00 PM",
        duration: "8 hours",
        totalCost: 80,
        spotNumber: "C-45",
        status: "upcoming",
        createdAt: new Date("2025-12-08T10:00:00").toISOString()
    },
    {
        id: "book-3",
        lotId: "2",
        lotName: "Riverside Lot",
        address: "456 Oak Ave, Riverside",
        startDate: "Dec 2, 10:00 AM",
        endDate: "Dec 2, 12:30 PM",
        duration: "2.5 hours",
        totalCost: 12.5,
        spotNumber: "B-08",
        status: "completed",
        createdAt: new Date("2025-12-02T10:00:00").toISOString()
    },
    {
        id: "book-4",
        lotId: "5",
        lotName: "Shopping District Lot",
        address: "654 Mall Dr, Shopping Center",
        startDate: "Nov 28, 2:00 PM",
        endDate: "Nov 28, 4:00 PM",
        duration: "2 hours",
        totalCost: 14,
        spotNumber: "D-22",
        status: "completed",
        createdAt: new Date("2025-11-28T14:00:00").toISOString()
    },
    {
        id: "book-5",
        lotId: "4",
        lotName: "Harbor Street Parking",
        address: "321 Harbor Rd, Waterfront",
        startDate: "Nov 20, 6:00 PM",
        endDate: "Nov 20, 8:00 PM",
        duration: "2 hours",
        totalCost: 12,
        spotNumber: "E-05",
        status: "cancelled",
        createdAt: new Date("2025-11-20T18:00:00").toISOString()
    },
    {
        id: "book-6",
        lotId: "6",
        lotName: "Executive Suites Garage",
        address: "987 Corporate Way, Business Park",
        startDate: "Dec 12, 8:00 AM",
        endDate: "Dec 12, 6:00 PM",
        duration: "10 hours",
        totalCost: 120,
        spotNumber: "F-33",
        status: "upcoming",
        createdAt: new Date("2025-12-05T09:00:00").toISOString()
    }
];
const mockFavorites = [
    {
        id: "1",
        name: "Downtown Plaza Garage",
        distance: 2.5,
        rating: 4.5
    },
    {
        id: "2",
        name: "Riverside Lot",
        distance: 1.2,
        rating: 4.2
    }
];
}),
"[project]/app/api/bookings/history/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const formattedActivity = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mockBookings"].map((booking)=>({
                id: booking.id,
                type: booking.status === "completed" ? "parking_ended" : "parking_started",
                description: `${booking.status === "completed" ? "Ended" : "Started"} parking at ${booking.lotName}, Spot ${booking.spotNumber}`,
                timestamp: booking.createdAt,
                lotName: booking.lotName
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: formattedActivity
        });
    } catch (error) {
        console.error("[v0] Error fetching activity history:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d929e754._.js.map