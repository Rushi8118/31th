import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
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

  const body = await request.json().catch(() => ({}))
  const type = body?.type === "work" ? "Work Visa" : body?.type === "study" ? "Study Visa" : "Consultation"
  const preferredCountry = typeof body?.preferred_country === "string" ? body.preferred_country : ""

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single()

  const name = profile?.full_name || user.email.split("@")[0]

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: user.email,
    subject: `We received your ${type} enquiry`,
    html: `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height:1.5">
        <h2 style="margin:0 0 12px">Thanks, ${escapeHtml(name)}!</h2>
        <p style="margin:0 0 12px">
          We’ve received your <b>${escapeHtml(type)}</b> enquiry${preferredCountry ? ` for <b>${escapeHtml(preferredCountry)}</b>` : ""}.
        </p>
        <p style="margin:0 0 12px">
          Our team will contact you shortly with next steps and document checklist.
        </p>
        <p style="margin:16px 0 0;color:#64748b;font-size:12px">
          Siddhivinayak Overseas
        </p>
      </div>
    `,
  })

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

