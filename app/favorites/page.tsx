"use client"

import { useState, useEffect } from "react"
import { MovieGrid } from "@/components/movies/movie-grid"
import { MovieGridSkeleton } from "@/components/movies/movie-grid-skeleton"
import { Navbar } from "@/components/layout/navbar"
import type { Movie } from "@/lib/tmdb"
import { Heart } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
}

export default function FavoritesPage() {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])

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
          const favoriteIds = JSON.parse(savedFavorites)
          setFavorites(favoriteIds)

          // Fetch movie details for favorites
          if (favoriteIds.length > 0) {
            const moviePromises = favoriteIds.map((id: number) =>
              fetch(`/api/movies/${id}`).then((res) => (res.ok ? res.json() : null)),
            )

            const movies = await Promise.all(moviePromises)
            setFavoriteMovies(movies.filter(Boolean))
          }
        }
      } catch (error) {
        console.error("Failed to load favorites:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleToggleFavorite = (movieId: number) => {
    const newFavorites = favorites.filter((id) => id !== movieId)
    setFavorites(newFavorites)
    setFavoriteMovies((prev) => prev.filter((movie) => movie.id !== movieId))
    localStorage.setItem("movie-favorites", JSON.stringify(newFavorites))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-primary fill-primary" />
            </div>
            <h1 className="text-4xl font-serif font-black">My Favorites</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Your personal collection of favorite movies
            </p>
          </div>

          {isLoading ? (
            <MovieGridSkeleton />
          ) : (
            <>
              {favoriteMovies.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-semibold mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground">
                    Start exploring movies and add them to your favorites to see them here.
                  </p>
                </div>
              ) : (
                <MovieGrid movies={favoriteMovies} favorites={favorites} onToggleFavorite={handleToggleFavorite} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
