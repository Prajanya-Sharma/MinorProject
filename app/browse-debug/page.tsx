"use client"

import { useEffect, useState } from "react"

export default function BrowseDebugPage() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function testBrowseAPI() {
      try {
        const url = "/api/lots?browse=true"
        console.log("[v0] Fetching from:", url)

        const response = await fetch(url)
        console.log("[v0] Response status:", response.status)
        console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

        const text = await response.text()
        console.log("[v0] Raw response:", text)

        const data = JSON.parse(text)
        console.log("[v0] Parsed data:", data)
        console.log("[v0] Number of lots:", Array.isArray(data) ? data.length : "not an array")

        setApiResponse(data)
      } catch (err: any) {
        console.error("[v0] Error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    testBrowseAPI()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Browse API Debug Page</h1>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="bg-red-900 p-4 rounded mb-4">
          <h2 className="font-bold">Error:</h2>
          <pre>{error}</pre>
        </div>
      )}

      {apiResponse && (
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="font-bold mb-2">API Response:</h2>
          <p className="mb-2">
            Type: {Array.isArray(apiResponse) ? `Array (${apiResponse.length} items)` : typeof apiResponse}
          </p>
          <pre className="overflow-auto max-h-96 text-xs bg-gray-950 p-4 rounded">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Check the browser console (F12) for detailed logs</li>
          <li>Verify the API is returning data</li>
          <li>Check if RLS policies are allowing the query</li>
          <li>Compare with /api/lots/test endpoint</li>
        </ol>
      </div>
    </div>
  )
}
