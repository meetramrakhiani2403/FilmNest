import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Film, Search, Heart, Star } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <header className="container mx-auto px-4 py-4 flex justify-end">
        <ThemeToggle />
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center mb-6">
            <Film className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground">FilmNest</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your next favorite film. Search thousands of movies, read reviews, and build your personal
            watchlist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader>
              <Search className="h-12 w-12 text-secondary mx-auto mb-4" />
              <CardTitle className="font-serif">Discover Movies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Search through thousands of movies with our powerful search engine. Find exactly what you're looking
                for.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader>
              <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
              <CardTitle className="font-serif">Save Favorites</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Build your personal collection of favorite movies. Never lose track of films you want to watch.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardHeader>
              <Star className="h-12 w-12 text-secondary mx-auto mb-4" />
              <CardTitle className="font-serif">Read Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get detailed information about each movie including ratings, reviews, and cast information.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
