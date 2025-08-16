"use client"

import { MovieCard } from "./movie-card"
import type { Movie } from "@/lib/tmdb"

interface MovieGridProps {
  movies: Movie[]
  favorites?: number[]
  onToggleFavorite?: (movieId: number) => void
}

export function MovieGrid({ movies, favorites = [], onToggleFavorite }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No movies found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
