const TMDB_API_KEY = process.env.TMDB_API_KEY || "your-tmdb-api-key"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface TMDBResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[]
  runtime: number
  budget: number
  revenue: number
  production_companies: { id: number; name: string; logo_path: string | null }[]
  production_countries: { iso_3166_1: string; name: string }[]
  spoken_languages: { iso_639_1: string; name: string }[]
  status: string
  tagline: string
  homepage: string
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface VideosResponse {
  results: Video[]
}

class TMDBClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = TMDB_API_KEY
    this.baseUrl = TMDB_BASE_URL
    console.log("[v0] TMDB API Key status:", {
      isSet: !!process.env.TMDB_API_KEY,
      isDefault: this.apiKey === "your-tmdb-api-key",
      keyLength: this.apiKey.length,
      keyPreview: this.apiKey.substring(0, 8) + "...",
    })
  }

  private async request<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.append("api_key", this.apiKey)

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    console.log("[v0] TMDB API Request:", {
      endpoint,
      url: url.toString().replace(this.apiKey, "***API_KEY***"),
      params,
    })

    const response = await fetch(url.toString())

    if (!response.ok) {
      console.error("[v0] TMDB API Error:", {
        status: response.status,
        statusText: response.statusText,
        endpoint,
        apiKeyValid: this.apiKey !== "your-tmdb-api-key",
      })
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getPopularMovies(page = 1): Promise<TMDBResponse> {
    return this.request<TMDBResponse>("/movie/popular", { page: page.toString() })
  }

  async searchMovies(query: string, page = 1): Promise<TMDBResponse> {
    return this.request<TMDBResponse>("/search/movie", {
      query,
      page: page.toString(),
    })
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.request<MovieDetails>(`/movie/${movieId}`)
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.request<Credits>(`/movie/${movieId}/credits`)
  }

  async getMovieVideos(movieId: number): Promise<VideosResponse> {
    return this.request<VideosResponse>(`/movie/${movieId}/videos`)
  }

  getImageUrl(path: string | null, size = "w500"): string {
    if (!path) return "/abstract-movie-poster.png"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  getBackdropUrl(path: string | null, size = "w1280"): string {
    if (!path) return "/movie-backdrop.png"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }

  getProfileUrl(path: string | null, size = "w185"): string {
    if (!path) return "/diverse-group.png"
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
  }
}

export const tmdb = new TMDBClient()
