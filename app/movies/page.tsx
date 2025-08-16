"use client"

import { useState, useEffect } from "react"
import { SearchBar } from "@/components/movies/search-bar"
import { MovieGrid } from "@/components/movies/movie-grid"
import { MovieGridSkeleton } from "@/components/movies/movie-grid-skeleton"
import { Pagination } from "@/components/movies/pagination"
import { ClientLayout } from "@/components/layout/client-layout"
import type { Movie, TMDBResponse } from "@/lib/tmdb"

interface User {
  id: string
  name: string
  email: string
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserData = async () => {
      const savedFavorites = localStorage.getItem("movie-favorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const endpoint = searchQuery
          ? `/api/movies/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}`
          : `/api/movies/popular?page=${currentPage}`

        console.log("[v0] Fetching from endpoint:", endpoint)
        const response = await fetch(endpoint)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.log("[v0] API Error Response:", response.status, errorData)

          if (response.status === 401) {
            setError("Please log in to view movies")
          } else if (response.status === 500) {
            setError("Server error - please check if TMDB_API_KEY is configured")
          } else {
            setError(errorData.error || `Failed to fetch movies (${response.status})`)
          }
          setMovies([])
          return
        }

        const data: TMDBResponse = await response.json()
        console.log("[v0] Movies loaded successfully:", data.results.length, "movies")
        setMovies(data.results)
        setTotalPages(Math.min(data.total_pages, 500))
      } catch (error) {
        console.error("[v0] Failed to load movies:", error)
        setError("Network error - please check your connection")
        setMovies([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMovies()
  }, [currentPage, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleToggleFavorite = (movieId: number) => {
    const newFavorites = favorites.includes(movieId)
      ? favorites.filter((id) => id !== movieId)
      : [...favorites, movieId]

    setFavorites(newFavorites)
    localStorage.setItem("movie-favorites", JSON.stringify(newFavorites))
  }

  return (
    <ClientLayout>
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif font-black">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Popular Movies"}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {searchQuery
                ? "Discover movies that match your search"
                : "Discover the most popular movies trending right now"}
            </p>
          </div>

          <SearchBar
            onSearch={handleSearch}
            onClear={handleClearSearch}
            initialQuery={searchQuery}
            isLoading={isLoading}
          />

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
              <p className="text-destructive font-medium">{error}</p>
              {error.includes("TMDB_API_KEY") && (
                <p className="text-sm text-muted-foreground mt-2">
                  Please add your TMDB API key to the environment variables
                </p>
              )}
              {error.includes("log in") && (
                <p className="text-sm text-muted-foreground mt-2">You need to be authenticated to access the movies</p>
              )}
            </div>
          )}

          {isLoading ? (
            <MovieGridSkeleton />
          ) : (
            <>
              <MovieGrid movies={movies} favorites={favorites} onToggleFavorite={handleToggleFavorite} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      </main>
    </ClientLayout>
  )
}
