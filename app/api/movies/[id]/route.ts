import { type NextRequest, NextResponse } from "next/server"
import { tmdb } from "@/lib/tmdb"
import { getUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const movieId = Number.parseInt(params.id, 10)

    if (Number.isNaN(movieId)) {
      return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 })
    }

    // Fetch movie details, credits, and videos in parallel
    const [movieDetails, credits, videos] = await Promise.all([
      tmdb.getMovieDetails(movieId),
      tmdb.getMovieCredits(movieId),
      tmdb.getMovieVideos(movieId),
    ])

    return NextResponse.json({
      ...movieDetails,
      credits,
      videos: videos.results,
    })
  } catch (error) {
    console.error("Movie details API error:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
