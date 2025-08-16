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
    const page = Number.parseInt(searchParams.get("page") || "1", 10)

    console.log("[v0] Popular movies API - calling TMDB with page:", page)
    console.log("[v0] Environment check:", {
      hasTmdbKey: !!process.env.TMDB_API_KEY,
      tmdbKeyLength: process.env.TMDB_API_KEY?.length || 0,
    })

    const data = await tmdb.getPopularMovies(page)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Popular movies API error:", error)
    return NextResponse.json({ error: "Failed to fetch popular movies" }, { status: 500 })
  }
}
