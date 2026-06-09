// middleware.ts
import { auth } from "./auth"

export async function middleware(request: Request) {
  // better-auth handles all /api/auth routes
  return await auth.handler(request)
}

export const config = {
  matcher: [
    // Match API auth routes
    "/api/auth/:path*",
    // Match any page routes that might need auth
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}