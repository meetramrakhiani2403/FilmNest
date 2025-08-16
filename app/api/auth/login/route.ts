import { type NextRequest, NextResponse } from "next/server"
import { createToken } from "@/lib/auth"
import { cookies } from "next/headers"

// Simple in-memory user store for demo purposes
// In production, use a proper database
const users = [
  { id: "1", email: "demo@example.com", password: "password123", name: "Demo User" },
  { id: "2", email: "john@example.com", password: "password123", name: "John Doe" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()


    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create JWT token
    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    // Set httpOnly cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
