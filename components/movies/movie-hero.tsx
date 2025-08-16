"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Play, Calendar, Clock } from "lucide-react"
import type { MovieDetails } from "@/lib/tmdb"
import { tmdb } from "@/lib/tmdb"
import { useState } from "react"

interface MovieHeroProps {
  movie: MovieDetails
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function MovieHero({ movie, isFavorite, onToggleFavorite }: MovieHeroProps) {
  const [backdropError, setBackdropError] = useState(false)
  const [posterError, setPosterError] = useState(false)

  const backdropUrl = backdropError ? "/movie-backdrop.png" : tmdb.getBackdropUrl(movie.backdrop_path)
  const posterUrl = posterError ? "/abstract-movie-poster.png" : tmdb.getImageUrl(movie.poster_path)

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="relative">
      {/* Backdrop Image */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src={backdropUrl || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
          onError={() => setBackdropError(true)}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-end">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={posterUrl || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  onError={() => setPosterError(true)}
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 space-y-4 text-white">
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-6xl font-serif font-black leading-tight">{movie.title}</h1>
                {movie.tagline && <p className="text-xl text-gray-300 italic">{movie.tagline}</p>}
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge className="bg-black/50 text-white border-none">
                  <Star className="h-3 w-3 mr-1 fill-secondary text-secondary" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(movie.release_date).getFullYear()}
                </div>
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatRuntime(movie.runtime)}
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="outline" className="bg-black/30 text-white border-white/30">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Overview */}
              <p className="text-lg leading-relaxed max-w-3xl text-gray-100">{movie.overview}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="text-lg px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onToggleFavorite}
                  className="text-lg px-8 bg-black/30 border-white/30 text-white hover:bg-black/50"
                >
                  <Heart className={`mr-2 h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              </div>

              {/* Additional Info */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="flex flex-wrap gap-8 pt-4 text-sm text-gray-300">
                  {movie.budget > 0 && (
                    <div>
                      <span className="font-semibold">Budget:</span> {formatCurrency(movie.budget)}
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <span className="font-semibold">Revenue:</span> {formatCurrency(movie.revenue)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
