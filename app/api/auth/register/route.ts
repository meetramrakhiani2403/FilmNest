import { type NextRequest, NextResponse } from "next/server"
import { createToken } from "@/lib/auth"
import { cookies } from "next/headers"

// Simple in-memory user store for demo purposes
// In production, use a proper database with password hashing
const users = [
  { id: "1", email: "demo@example.com", password: "password123", name: "Demo User" },
  { id: "2", email: "john@example.com", password: "password123", name: "John Doe" },
]

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password, // In production, hash this password
      name,
    }

    users.push(newUser)

    // Create JWT token
    const token = await createToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
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
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
