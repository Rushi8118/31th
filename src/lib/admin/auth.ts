import { createHmac, timingSafeEqual } from "node:crypto"
import { NextResponse, type NextRequest } from "next/server"

const COOKIE_NAME = "svo_admin_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "development-admin-session-secret"
  )
}

function signPayload(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex")
}

export function verifyAdminCredentials(username: string, password: string) {
  const expectedUsername = process.env.ADMIN_USERNAME || "admin"
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin"

  return username === expectedUsername && password === expectedPassword
}

export function setAdminSession(response: NextResponse) {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  const payload = `admin:${expiresAt}`
  const signature = signPayload(payload)

  response.cookies.set(COOKIE_NAME, `admin.${expiresAt}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })

  return response
}

export function clearAdminSession(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })

  return response
}

export function isAdminRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return false

  const [role, expiresAtRaw, signature] = token.split(".")
  if (!role || !expiresAtRaw || !signature) return false

  const normalizedPayload = `${role}:${expiresAtRaw}`
  const expiresAt = Number(expiresAtRaw)

  if (role !== "admin" || !Number.isFinite(expiresAt)) {
    return false
  }

  if (Date.now() > expiresAt) return false

  const expectedSignature = signPayload(normalizedPayload)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  return (
    actualBuffer.length === expectedBuffer.length &&
    timingSafeEqual(actualBuffer, expectedBuffer)
  )
}

export function requireAdmin(request: NextRequest) {
  if (isAdminRequest(request)) return null

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
