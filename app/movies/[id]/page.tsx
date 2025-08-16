"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { MovieHero } from "@/components/movies/movie-hero"
import { CastSection } from "@/components/movies/cast-section"
import { MovieInfo } from "@/components/movies/movie-info"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import type { MovieDetails, Credits, Video } from "@/lib/tmdb"

interface User {
  id: string
  name: string
  email: string
}

interface MovieDetailsWithCredits extends MovieDetails {
  credits: Credits
  videos: Video[]
}

function MovieDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <div className="relative h-[70vh]">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-16">
            <div className="flex flex-col lg:flex-row gap-8 items-end">
              <Skeleton className="w-64 h-96 rounded-lg" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 space-y-16">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MovieDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [movie, setMovie] = useState<MovieDetailsWithCredits | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const movieId = Number.parseInt(params.id as string, 10)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user
        const userResponse = await fetch("/api/auth/me")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem("movie-favorites")
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
        }

        // Load movie details
        const movieResponse = await fetch(`/api/movies/${movieId}`)
        if (!movieResponse.ok) {
          throw new Error("Failed to fetch movie details")
        }

        const movieData = await movieResponse.json()
        setMovie(movieData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (!Number.isNaN(movieId)) {
      loadData()
    } else {
      setError("Invalid movie ID")
      setIsLoading(false)
    }
  }, [movieId])

  const handleToggleFavorite = () => {
    if (!movie) return

    const newFavorites = favorites.includes(movie.id)
      ? favorites.filter((id) => id !== movie.id)
      : [...favorites, movie.id]

    setFavorites(newFavorites)
    localStorage.setItem("movie-favorites", JSON.stringify(newFavorites))
  }

  const handleBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>
        </div>
        <MovieDetailSkeleton />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || "The requested movie could not be found."}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const isFavorite = favorites.includes(movie.id)

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Movies
        </Button>
      </div>

      {/* Movie Hero Section */}
      <MovieHero movie={movie} isFavorite={isFavorite} onToggleFavorite={handleToggleFavorite} />

      {/* Movie Content */}
      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Cast Section */}
        {movie.credits.cast.length > 0 && <CastSection cast={movie.credits.cast} />}

        {/* Movie Info */}
        <MovieInfo movie={movie} />
      </div>
    </div>
  )
}
