import { NextResponse } from "next/server"
import { setAdminSession, verifyAdminCredentials } from "@/lib/admin/auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const username = typeof body?.username === "string" ? body.username : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 })
  }

  return setAdminSession(NextResponse.json({ ok: true }))
}
