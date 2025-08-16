import { type NextRequest, NextResponse } from "next/server"
import { tmdb } from "@/lib/tmdb"
import { getUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const page = Number.parseInt(searchParams.get("page") || "1", 10)

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const data = await tmdb.searchMovies(query, page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Search movies API error:", error)
    return NextResponse.json({ error: "Failed to search movies" }, { status: 500 })
  }
}
