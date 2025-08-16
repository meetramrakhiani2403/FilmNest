"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star } from "lucide-react"
import type { Movie } from "@/lib/tmdb"
import { tmdb } from "@/lib/tmdb"
import { useState } from "react"

interface MovieCardProps {
  movie: Movie
  isFavorite?: boolean
  onToggleFavorite?: (movieId: number) => void
}

export function MovieCard({ movie, isFavorite = false, onToggleFavorite }: MovieCardProps) {
  const [imageError, setImageError] = useState(false)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite?.(movie.id)
  }

  const posterUrl = imageError ? "/abstract-movie-poster.png" : tmdb.getImageUrl(movie.poster_path)

  return (
    <Link href={`/movies/${movie.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card border-border">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={posterUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
          </Button>

          {/* Rating Badge */}
          <Badge className="absolute top-2 left-2 bg-black/70 text-white border-none">
            <Star className="h-3 w-3 mr-1 fill-secondary text-secondary" />
            {movie.vote_average.toFixed(1)}
          </Badge>
        </div>

        <CardContent className="p-4">
          <h3 className="font-serif font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBA"}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-3">{movie.overview}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
