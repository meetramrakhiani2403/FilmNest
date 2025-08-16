import { Skeleton } from "@/components/ui/skeleton"
import { MovieGridSkeleton } from "@/components/movies/movie-grid-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b border-border" />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="max-w-2xl mx-auto">
            <Skeleton className="h-12 w-full" />
          </div>

          {/* Movies Grid Skeleton */}
          <MovieGridSkeleton />
        </div>
      </main>
    </div>
  )
}
