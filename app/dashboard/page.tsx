"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Globe2,
  ArrowRight,
  FileText,
  Calendar,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle2,
  User,
  Phone,
  MessageCircle,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import PhoneInput from "react-phone-number-input"
import { getCountryCallingCode } from "react-phone-number-input/input"
import en from "react-phone-number-input/locale/en"
import "react-phone-number-input/style.css"

type DashboardSummary = {
  total_applications: number | null
  active_applications: number | null
  total_consultations: number | null
  saved_count: number | null
  unread_notifications: number | null
}

type Consultation = {
  id: string
  consultation_type: string
  status: string
  preferred_country: string | null
  visa_category: string | null
  scheduled_at: string
  created_at: string
}

type CountryOption = {
  id: string
  name: string
  slug: string
}

type ProgramOption = {
  id: string
  name: string
  program_type: string
  country_id: string
  country_name: string | null
  country_slug: string | null
}

type BookingForm = {
  fullName: string
  email: string
  phone: string
  whatsapp: string
  consultationType: "work_visa" | "study_visa"
  preferredCountry: string
  selectedProgramId: string
  currentRole: string
  experienceYears: string
  qualification: string
  targetTimeline: string
  budget: string
  message: string
}

const UNSURE_VALUE = "not_sure"
const UNSURE_LABEL = "Not sure - please guide"

const defaultSummary: DashboardSummary = {
  total_applications: 0,
  active_applications: 0,
  total_consultations: 0,
  saved_count: 0,
  unread_notifications: 0,
}

const defaultBookingForm: BookingForm = {
  fullName: "",
  email: "",
  phone: "",
  whatsapp: "",
  consultationType: "work_visa",
  preferredCountry: UNSURE_VALUE,
  selectedProgramId: UNSURE_VALUE,
  currentRole: "",
  experienceYears: "",
  qualification: "",
  targetTimeline: "",
  budget: "",
  message: "",
}

const fallbackCountries: CountryOption[] = [
  { id: "japan", name: "Japan", slug: "japan" },
  { id: "australia", name: "Australia", slug: "australia" },
  { id: "canada", name: "Canada", slug: "canada" },
  { id: "united-kingdom", name: "United Kingdom", slug: "united-kingdom" },
  { id: "germany", name: "Germany", slug: "germany" },
  { id: "new-zealand", name: "New Zealand", slug: "new-zealand" },
  { id: "united-states", name: "United States", slug: "united-states" },
  { id: "united-arab-emirates", name: "United Arab Emirates", slug: "united-arab-emirates" },
]

export default function DashboardPage() {
  const { user, profile, signOut, isLoading } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary>(defaultSummary)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const [countries, setCountries] = useState<CountryOption[]>([])
  const [programs, setPrograms] = useState<ProgramOption[]>([])
  const [bookingForm, setBookingForm] = useState<BookingForm>(defaultBookingForm)
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "done">("idle")
  const [prefilledUserId, setPrefilledUserId] = useState<string | null>(null)
  const [phoneCountry, setPhoneCountry] = useState("")
  const [whatsappCountry, setWhatsappCountry] = useState("")

  useEffect(() => {
    if (!user) {
      setLoadingData(false)
      return
    }

    const supabase = createClient()
    const userId = user.id

    async function loadDashboard() {
      setLoadingData(true)

      const [
        { data: summaryData },
        { data: consultationData },
        { data: countryData },
        { data: programData },
      ] = await Promise.all([
        supabase
          .from("user_dashboard_summary")
          .select("total_applications, active_applications, total_consultations, saved_count, unread_notifications")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("consultations")
          .select("id, consultation_type, status, preferred_country, visa_category, scheduled_at, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("public_countries")
          .select("id, name, slug")
          .order("name", { ascending: true }),
        supabase
          .from("public_visa_programs")
          .select("id, name, program_type, country_id, country_name, country_slug")
          .order("sort_order", { ascending: true }),
      ])

      setSummary(summaryData || defaultSummary)
      setConsultations((consultationData || []) as Consultation[])
      setCountries((countryData || []) as CountryOption[])
      setPrograms((programData || []) as ProgramOption[])
      setLoadingData(false)
    }

    loadDashboard()
  }, [user])

  useEffect(() => {
    if (!user || prefilledUserId === user.id) return

    const fullName =
      profile?.full_name ||
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
      user.user_metadata?.full_name ||
      ""

    setBookingForm((current) => ({
      ...current,
      fullName,
      email: user.email || "",
      phone: profile?.phone || "",
      whatsapp: profile?.whatsapp || profile?.phone || "",
    }))
    setPrefilledUserId(user.id)
  }, [user, profile, prefilledUserId])

  const countryOptions = countries.length > 0 ? countries : fallbackCountries

  const filteredPrograms = useMemo(() => {
    const targetType = bookingForm.consultationType === "work_visa" ? "work" : "study"

    return programs.filter((program) => {
      const typeMatches = program.program_type === targetType
      const countryMatches =
        bookingForm.preferredCountry === UNSURE_VALUE ||
        program.country_name === bookingForm.preferredCountry

      return typeMatches && countryMatches
    })
  }, [bookingForm.consultationType, bookingForm.preferredCountry, programs])

  const selectedProgram = useMemo(
    () => programs.find((program) => program.id === bookingForm.selectedProgramId),
    [bookingForm.selectedProgramId, programs]
  )

  const updateBookingField = (field: keyof BookingForm, value: string) => {
    setBookingForm((current) => ({
      ...current,
      [field]: value,
      ...(field === "preferredCountry" || field === "consultationType"
        ? { selectedProgramId: UNSURE_VALUE }
        : {}),
    }))
  }

  const handleDashboardBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    if (!bookingForm.fullName.trim() || !bookingForm.email.trim() || !bookingForm.phone.trim()) {
      toast.error("Please add your name, email, and phone number.")
      return
    }

    setBookingStatus("loading")

    const supabase = createClient()
    const preferredCountry =
      bookingForm.preferredCountry === UNSURE_VALUE ? UNSURE_LABEL : bookingForm.preferredCountry
    const visaCategory = selectedProgram?.name || UNSURE_LABEL

    const profileUpdate = {
      id: user.id,
      email: bookingForm.email.trim(),
      full_name: bookingForm.fullName.trim(),
      phone: bookingForm.phone.trim(),
      whatsapp: bookingForm.whatsapp.trim() || null,
    }

    const payload = {
      user_id: user.id,
      consultation_type: bookingForm.consultationType,
      status: "requested",
      scheduled_at: new Date().toISOString(),
      phone_number: bookingForm.phone.trim(),
      whatsapp_number: bookingForm.whatsapp.trim() || null,
      preferred_country: preferredCountry,
      visa_category: visaCategory,
      user_notes: {
        source: "dashboard_booking",
        contact_name: bookingForm.fullName.trim(),
        contact_email: bookingForm.email.trim(),
        selected_program_id: selectedProgram?.id || null,
        current_role_or_field: bookingForm.currentRole.trim() || null,
        experience_years: bookingForm.experienceYears.trim() || null,
        highest_qualification: bookingForm.qualification.trim() || null,
        target_timeline: bookingForm.targetTimeline.trim() || null,
        budget: bookingForm.budget.trim() || null,
        message: bookingForm.message.trim() || null,
        submitted_at: new Date().toISOString(),
      },
    }

    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert(profileUpdate, { onConflict: "id" })

    if (profileError) {
      setBookingStatus("idle")
      toast.error(profileError.message)
      return
    }

    const { data, error } = await supabase
      .from("consultations")
      .insert(payload)
      .select("id, consultation_type, status, preferred_country, visa_category, scheduled_at, created_at")
      .single()

    if (error) {
      setBookingStatus("idle")
      toast.error(error.message)
      return
    }

    setConsultations((current) => [data as Consultation, ...current].slice(0, 5))
    setSummary((current) => ({
      ...current,
      total_consultations: (current.total_consultations || 0) + 1,
    }))
    setBookingStatus("done")
    toast.success("Consultation booked. Your details are saved.")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border border-border/60 bg-card/70 p-6 text-center">
          <h1 className="font-serif text-2xl font-semibold text-foreground">Please sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to view your dashboard, consultations, and application progress.
          </p>
          <Button asChild className="mt-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
              <Globe2 className="h-5 w-5 text-primary" />
            </span>
            <span className="font-serif text-base font-semibold">Siddhivinayak</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/countries"
              className="hidden text-sm font-medium text-foreground/70 hover:text-foreground md:block"
            >
              Countries
            </Link>
            <Button
              onClick={signOut}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "Traveler"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage your visa applications, consultations, and saved destinations.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Applications", value: summary.total_applications || 0, icon: FileText, color: "text-blue-500" },
              { label: "Consultations", value: summary.total_consultations || 0, icon: Calendar, color: "text-emerald-500" },
              { label: "Saved Places", value: summary.saved_count || 0, icon: Bookmark, color: "text-amber-500" },
              { label: "Notifications", value: summary.unread_notifications || 0, icon: Bell, color: "text-rose-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/60 bg-card/50 p-4 transition hover:border-primary/30"
              >
                <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{loadingData ? "..." : stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
                <h2 className="mb-4 font-serif text-lg font-semibold">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Link
                    href="/countries"
                    className="flex items-center gap-3 rounded-xl border border-border/40 bg-background p-4 transition hover:border-primary/40"
                  >
                    <Globe2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Explore Countries</p>
                      <p className="text-xs text-muted-foreground">Browse visa programs</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="#book-consultation"
                    className="flex items-center gap-3 rounded-xl border border-border/40 bg-background p-4 transition hover:border-primary/40"
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Book Consultation</p>
                      <p className="text-xs text-muted-foreground">Stay on dashboard</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>

              {/* Book Consultation */}
              <div id="book-consultation" className="scroll-mt-24 rounded-2xl border border-border/60 bg-card/50 p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-serif text-lg font-semibold">Book Consultation</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Your saved profile is pre-filled. Update anything before submitting.
                    </p>
                  </div>
                  {bookingStatus === "done" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Saved
                    </span>
                  )}
                </div>

                <form onSubmit={handleDashboardBooking} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DashboardField id="booking-name" label="Full name">
                    <Input
                      id="booking-name"
                      value={bookingForm.fullName}
                      onChange={(event) => updateBookingField("fullName", event.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </DashboardField>

                  <DashboardField id="booking-email" label="Email">
                    <Input
                      id="booking-email"
                      type="email"
                      value={bookingForm.email}
                      onChange={(event) => updateBookingField("email", event.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </DashboardField>

                  <DashboardField id="booking-phone" label="Mobile number">
                    <DashboardPhoneInput
                      id="booking-phone"
                      icon="phone"
                      value={bookingForm.phone}
                      onChange={(value) => updateBookingField("phone", value)}
                      onCountryChange={setPhoneCountry}
                      detectedCountry={phoneCountry}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </DashboardField>

                  <DashboardField id="booking-whatsapp" label="WhatsApp number">
                    <DashboardPhoneInput
                      id="booking-whatsapp"
                      icon="whatsapp"
                      value={bookingForm.whatsapp}
                      onChange={(value) => updateBookingField("whatsapp", value)}
                      onCountryChange={setWhatsappCountry}
                      detectedCountry={whatsappCountry}
                      placeholder="+91 98765 43210"
                    />
                  </DashboardField>

                  <DashboardField id="booking-type" label="Consultation type">
                    <Select
                      value={bookingForm.consultationType}
                      onValueChange={(value) => updateBookingField("consultationType", value)}
                    >
                      <SelectTrigger id="booking-type" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work_visa">Work Visa</SelectItem>
                        <SelectItem value="study_visa">Study Visa</SelectItem>
                      </SelectContent>
                    </Select>
                  </DashboardField>

                  <DashboardField id="booking-country" label="Preferred country">
                    <Select
                      value={bookingForm.preferredCountry}
                      onValueChange={(value) => updateBookingField("preferredCountry", value)}
                    >
                      <SelectTrigger id="booking-country" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UNSURE_VALUE}>{UNSURE_LABEL}</SelectItem>
                        {countryOptions.map((country) => (
                          <SelectItem key={country.id} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </DashboardField>

                  <DashboardField id="booking-program" label="Visa program / category" full>
                    <Select
                      value={bookingForm.selectedProgramId}
                      onValueChange={(value) => updateBookingField("selectedProgramId", value)}
                    >
                      <SelectTrigger id="booking-program" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UNSURE_VALUE}>{UNSURE_LABEL}</SelectItem>
                        {filteredPrograms.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.country_name ? `${program.country_name} - ${program.name}` : program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </DashboardField>

                  <DashboardField
                    id="booking-role"
                    label={bookingForm.consultationType === "work_visa" ? "Current role / industry" : "Target course / field"}
                  >
                    <Input
                      id="booking-role"
                      value={bookingForm.currentRole}
                      onChange={(event) => updateBookingField("currentRole", event.target.value)}
                      placeholder={bookingForm.consultationType === "work_visa" ? "e.g. Nurse, Welder, IT" : "e.g. Data Science, Nursing"}
                    />
                  </DashboardField>

                  <DashboardField id="booking-experience" label="Experience">
                    <Input
                      id="booking-experience"
                      value={bookingForm.experienceYears}
                      onChange={(event) => updateBookingField("experienceYears", event.target.value)}
                      placeholder="e.g. 4 years / Fresher"
                    />
                  </DashboardField>

                  <DashboardField id="booking-qualification" label="Highest qualification">
                    <Input
                      id="booking-qualification"
                      value={bookingForm.qualification}
                      onChange={(event) => updateBookingField("qualification", event.target.value)}
                      placeholder="e.g. B.Sc Nursing"
                    />
                  </DashboardField>

                  <DashboardField id="booking-timeline" label="Target timeline">
                    <Input
                      id="booking-timeline"
                      value={bookingForm.targetTimeline}
                      onChange={(event) => updateBookingField("targetTimeline", event.target.value)}
                      placeholder="e.g. 3 months / Sep 2026"
                    />
                  </DashboardField>

                  <DashboardField id="booking-budget" label="Budget range">
                    <Input
                      id="booking-budget"
                      value={bookingForm.budget}
                      onChange={(event) => updateBookingField("budget", event.target.value)}
                      placeholder="e.g. 3-5 lakh"
                    />
                  </DashboardField>

                  <DashboardField id="booking-message" label="Notes for consultant" full>
                    <Textarea
                      id="booking-message"
                      value={bookingForm.message}
                      onChange={(event) => updateBookingField("message", event.target.value)}
                      rows={3}
                      placeholder="Tell us about your goal, documents, IELTS/JLPT, job offer, admission status, or any question."
                    />
                  </DashboardField>

                  <div className="md:col-span-2">
                    <Button
                      type="submit"
                      disabled={bookingStatus === "loading"}
                      className="btn-glow w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {bookingStatus === "loading" ? "Saving..." : "Book consultation"}
                      {bookingStatus !== "loading" && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Application Status */}
              <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-semibold">Recent Consultations</h2>
                  <span className="text-xs text-muted-foreground">{consultations.length} saved</span>
                </div>
                {consultations.length > 0 ? (
                  <div className="space-y-3">
                    {consultations.map((item) => (
                      <div key={item.id} className="rounded-xl border border-border/50 bg-background p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.consultation_type.replace("_", " ").toUpperCase()}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {[item.preferred_country, item.visa_category].filter(Boolean).join(" / ") || "General enquiry"}
                            </p>
                          </div>
                          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background py-12">
                    <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">No consultations yet</p>
                    <Button asChild className="mt-4 btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link href="#book-consultation">Book Consultation</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-primary/5 hover:text-foreground"
                  >
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </div>
              </div>

              {/* Progress */}
              <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                <h3 className="mb-3 font-medium text-foreground">Profile Completion</h3>
                <div className="mb-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary transition-all" style={{ width: "30%" }} />
                </div>
                <p className="text-xs text-muted-foreground">30% complete - Add more details for better recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function DashboardPhoneInput({
  id,
  value,
  onChange,
  onCountryChange,
  detectedCountry,
  placeholder,
  required,
  icon,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  onCountryChange: (value: string) => void
  detectedCountry: string
  placeholder: string
  required?: boolean
  icon: "phone" | "whatsapp"
}) {
  const Icon = icon === "phone" ? Phone : MessageCircle
  const iconClass = icon === "phone" ? "text-blue-500" : "text-green-500"

  return (
    <>
      {detectedCountry && (
        <p className="mb-1 text-xs font-medium text-muted-foreground">
          Detected: {detectedCountry}
        </p>
      )}
      <div className="relative phone-input-container">
        <Icon className={`pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 ${iconClass}`} />
        <PhoneInput
          id={id}
          international
          displayInitialValueAsLocalNumber={false}
          defaultCountry="IN"
          value={value || undefined}
          onChange={(nextValue) => onChange(nextValue || "")}
          onCountryChange={(country) => onCountryChange(country ? en[country] : "")}
          countrySelectComponent={CountrySelectWithCode}
          placeholder={placeholder}
          required={required}
          className="flex h-10 w-full rounded-md border border-border/70 bg-background px-3 py-2 pl-10 text-sm"
        />
      </div>
    </>
  )
}

function CountrySelectWithCode({ value, onChange, options, ...rest }: any) {
  const { iconComponent, ...domProps } = rest

  return (
    <div className="relative mr-3 flex h-full min-w-[70px] items-center border-r border-border/40 pr-2">
      <select
        {...domProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="z-20 cursor-pointer appearance-none bg-transparent py-1 pl-2 pr-6 text-xs font-bold text-primary focus:outline-none"
      >
        <option value="">Code</option>
        {options.map(({ value: optionValue }: any) => {
          if (!optionValue) return null

          let callingCode = ""
          try {
            callingCode = getCountryCallingCode(optionValue)
          } catch {}

          return (
            <option key={optionValue} value={optionValue} className="bg-background text-foreground">
              {optionValue} {callingCode ? `(+${callingCode})` : ""}
            </option>
          )
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-primary" />
    </div>
  )
}

function DashboardField({
  id,
  label,
  children,
  full,
}: {
  id: string
  label: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      <style jsx global>{`
        .phone-input-container .PhoneInputInput {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          padding: 0;
          color: inherit;
        }
        .phone-input-container .PhoneInputCountry {
          margin: 0;
          display: flex;
          align-items: center;
          height: 100%;
        }
        .phone-input-container .PhoneInput {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .phone-input-container select option {
          background-color: hsl(var(--background));
          color: hsl(var(--foreground));
          padding: 8px;
        }
      `}</style>
    </div>
  )
}
