import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM

  if (!resendKey || !fromEmail) {
    return NextResponse.json(
      { error: "Email is not configured (missing RESEND_API_KEY or RESEND_FROM)" },
      { status: 500 }
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr || !user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name,welcome_email_sent_at")
    .eq("id", user.id)
    .single()

  // Idempotent: only send once per user
  if (profile?.welcome_email_sent_at) {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const name = profile?.full_name || user.email.split("@")[0]

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: user.email,
    subject: "Welcome to Siddhivinayak Overseas",
    html: `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5">
        <h2 style="margin:0 0 12px">Hi ${escapeHtml(name)}, welcome!</h2>
        <p style="margin:0 0 12px">
          Your account is ready. You can now explore countries, book a consultation, and track your journey.
        </p>
        <p style="margin:0">
          If you need help, just reply to this email and our team will assist you.
        </p>
        <p style="margin:16px 0 0;color:#64748b;font-size:12px">
          Siddhivinayak Overseas
        </p>
      </div>
    `,
  })

  await supabase
    .from("user_profiles")
    .update({ welcome_email_sent_at: new Date().toISOString() } as any)
    .eq("id", user.id)

  return NextResponse.json({ ok: true })
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

