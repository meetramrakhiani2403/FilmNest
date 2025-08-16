"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Cast } from "@/lib/tmdb"
import { tmdb } from "@/lib/tmdb"
import { useState } from "react"

interface CastSectionProps {
  cast: Cast[]
}

export function CastSection({ cast }: CastSectionProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const handleImageError = (castId: number) => {
    setImageErrors((prev) => new Set(prev).add(castId))
  }

  const displayCast = cast.slice(0, 12) // Show top 12 cast members

  if (displayCast.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-serif font-bold">Cast</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {displayCast.map((person) => {
          const profileUrl = imageErrors.has(person.id)
            ? "/diverse-group.png"
            : tmdb.getProfileUrl(person.profile_path)

          return (
            <Card key={person.id} className="overflow-hidden">
              <div className="relative aspect-[2/3]">
                <Image
                  src={profileUrl || "/placeholder.svg"}
                  alt={person.name}
                  fill
                  className="object-cover"
                  onError={() => handleImageError(person.id)}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2 mb-1">{person.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{person.character}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
