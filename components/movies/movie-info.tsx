"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MovieDetails } from "@/lib/tmdb"

interface MovieInfoProps {
  movie: MovieDetails
}

export function MovieInfo({ movie }: MovieInfoProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Movie Details */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Movie Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-muted-foreground">Status:</span>
              <p>{movie.status}</p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Original Language:</span>
              <p>{movie.original_language.toUpperCase()}</p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Original Title:</span>
              <p>{movie.original_title}</p>
            </div>
            <div>
              <span className="font-semibold text-muted-foreground">Popularity:</span>
              <p>{movie.popularity.toFixed(1)}</p>
            </div>
          </div>

          {movie.homepage && (
            <div>
              <span className="font-semibold text-muted-foreground">Homepage:</span>
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-2"
              >
                Visit Official Site
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Production Info */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Production</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {movie.production_companies.length > 0 && (
            <div>
              <span className="font-semibold text-muted-foreground">Companies:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {movie.production_companies.slice(0, 3).map((company) => (
                  <Badge key={company.id} variant="outline">
                    {company.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {movie.production_countries.length > 0 && (
            <div>
              <span className="font-semibold text-muted-foreground">Countries:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {movie.production_countries.map((country) => (
                  <Badge key={country.iso_3166_1} variant="outline">
                    {country.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {movie.spoken_languages.length > 0 && (
            <div>
              <span className="font-semibold text-muted-foreground">Languages:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {movie.spoken_languages.map((language) => (
                  <Badge key={language.iso_639_1} variant="outline">
                    {language.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
