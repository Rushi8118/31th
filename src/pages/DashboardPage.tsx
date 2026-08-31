
import { useEffect, useState, useCallback } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User as UserIcon, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Send, 
  Phone, 
  MessageCircle, 
  FileText,
  MapPin,
  TrendingUp,
  Bookmark
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase/client"
import { subscribePostgresChanges } from "@/lib/supabase/realtime"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FlagIcon } from "@/components/flag-icon"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { PhoneInputField } from "@/components/ui/phone-input-field"

type Application = {
  id: string
  application_id: string | null
  visa_program_id: string
  country_id: string
  application_type: "work" | "study" | "business" | "tourist" | "investor"
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected" | "withdrawn"
  priority: "low" | "normal" | "high" | "urgent"
  submitted_at: string | null
  estimated_completion: string | null
  countries?: { name: string; flag_emoji: string }
  visa_programs?: { name: string }
}

type Consultation = {
  id: string
  consultation_type: string
  status: "requested" | "scheduled" | "confirmed" | "completed" | "cancelled" | "no_show"
  scheduled_at: string
  duration_minutes: number
  phone_number: string | null
  whatsapp_number: string | null
  preferred_country: string | null
  visa_category: string | null
  user_notes: any
  consultant_notes: string | null
}

export default function DashboardPage() {
  const { user, profile, signOut, updateProfile, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "consultations" | "profile">("overview")
  
  // Data states
  const [applications, setApplications] = useState<Application[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [programs, setPrograms] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Quick Book Consultation Form State
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [bookLoading, setBookLoading] = useState(false)
  const [bookPhone, setBookPhone] = useState<string | undefined>()
  const [bookWhatsapp, setBookWhatsapp] = useState<string | undefined>()
  const [bookType, setBookType] = useState("work_visa")
  const [bookCountry, setBookCountry] = useState("")
  const [bookNotes, setBookNotes] = useState("")

  // Profile Form States
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [nationality, setNationality] = useState("")
  const [educationLevel, setEducationLevel] = useState("")
  const [fieldOfStudy, setFieldOfStudy] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to access your dashboard.")
      navigate("/login?redirect=/dashboard")
    }
  }, [user, authLoading, navigate])

  // Initialize Profile form inputs
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "")
      setPhone(profile.phone || "")
      setWhatsapp(profile.whatsapp || "")
      setNationality(profile.nationality || "")
      setEducationLevel(profile.education_level || "")
      setFieldOfStudy(profile.field_of_study || "")
    }
  }, [profile])

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    if (!user) return
    setLoadingData(true)
    try {
      // 1. Applications with Joins
      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select(`
          *,
          countries(name, flag_emoji),
          visa_programs(name)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (appsError) throw appsError

      // 2. Consultations
      const { data: consData, error: consError } = await supabase
        .from("consultations")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_at", { ascending: false })

      if (consError) throw consError

      // 3. Active Countries for dropdown
      const { data: countriesData } = await supabase
        .from("countries")
        .select("id, name, slug, flag_emoji")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      setApplications(appsData as any[] || [])
      setConsultations(consData as any[] || [])
      setCountries(countriesData || [])
    } catch (err: any) {

      toast.error("Failed to load dashboard data.")
    } finally {
      setLoadingData(false)
    }
  }, [user])

  // Initial Fetch & Realtime Subscription Setup
  useEffect(() => {
    if (!user) return

    fetchDashboardData()

    const unsubscribe = subscribePostgresChanges(
      supabase,
      "dashboard_updates",
      [
        {
          event: "*",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${user.id}`,
        },
        {
          event: "*",
          schema: "public",
          table: "consultations",
          filter: `user_id=eq.${user.id}`,
        },
      ],
      () => {
        fetchDashboardData()
      },
    )

    return unsubscribe
  }, [user, fetchDashboardData])

  // Profile Save handler
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    try {
      const { error } = await updateProfile({
        full_name: fullName,
        phone,
        whatsapp,
        nationality,
        education_level: educationLevel,
        field_of_study: fieldOfStudy,
      })

      if (error) {
        toast.error((error as any)?.message || "Failed to update profile.")
      } else {
        toast.success("Profile saved successfully!")
      }
    } catch (err) {

      toast.error("An unexpected error occurred.")
    } finally {
      setProfileSaving(false)
    }
  }

  // Quick Book Consultation Handler
  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookCountry) {
      toast.error("Please select a target country.")
      return
    }

    setBookLoading(true)
    try {
      const insertData = {
        user_id: user?.id,
        consultation_type: bookType,
        status: "requested",
        scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), // defaults to 2 days later
        phone_number: bookPhone || null,
        whatsapp_number: bookWhatsapp || null,
        preferred_country: bookCountry,
        user_notes: {
          notes: bookNotes,
          source: "user_dashboard",
          submitted_at: new Date().toISOString()
        }
      }

      const { error } = await supabase
        .from("consultations")
        .insert([insertData])

      if (error) throw error

      toast.success("Consultation booked successfully!", {
        description: "A case officer will confirm your slot shortly."
      })
      setBookModalOpen(false)
      setBookNotes("")
      fetchDashboardData()
    } catch (err: any) {

      toast.error(err.message || "Failed to book consultation.")
    } finally {
      setBookLoading(false)
    }
  }

  // Visual Application Status Stepper Helper
  const getStatusStepIndex = (status: string) => {
    switch (status) {
      case "draft":
        return 0
      case "submitted":
        return 1
      case "under_review":
        return 2
      case "approved":
        return 3
      default:
        return 1
    }
  }

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "withdrawn":
        return "bg-muted text-muted-foreground border-border"
      case "under_review":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "submitted":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-primary/10 text-primary border-primary/20"
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader flex />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Applicant Dashboard | Siddhivinayak Overseas</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SiteHeader />

      <main className="min-h-screen bg-background pt-28 pb-16 premium-page px-4 md:px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header Row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6 mb-8">
            <div>
              <h1 className="font-serif text-3xl font-semibold text-foreground md:text-4xl">
                Applicant Dashboard
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Welcome back, <strong className="text-foreground">{profile?.full_name || user.email}</strong>. Manage your pathways in one place.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button 
                onClick={() => setBookModalOpen(true)}
                className="rounded-full bg-primary hover:bg-primary/95 text-primary-foreground btn-glow px-5"
              >
                <Plus className="mr-2 h-4 w-4" /> Book Consultation
              </Button>
              <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="rounded-full border-border/70 text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-2">
              <div className="rounded-2xl border border-border/60 bg-card/65 p-3.5 shadow-lg backdrop-blur-md">
                {[
                  { id: "overview", label: "Overview", icon: ClipboardList },
                  { id: "applications", label: "My Applications", icon: Briefcase },
                  { id: "consultations", label: "Consultations", icon: Calendar },
                  { id: "profile", label: "My Profile", icon: UserIcon },
                ].map((tab) => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                        active 
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                          : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {loadingData ? (
                <div className="rounded-2xl border border-border/60 bg-card/50 p-12 flex justify-center items-center h-[400px]">
                  <Loader />
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Dashboard Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                          <Briefcase className="h-8 w-8 text-primary mb-3" />
                          <h3 className="text-2xl font-bold text-foreground">{applications.length}</h3>
                          <p className="text-xs text-muted-foreground">Applications</p>
                        </div>
                        <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
                          <Calendar className="h-8 w-8 text-primary mb-3" />
                          <h3 className="text-2xl font-bold text-foreground">{consultations.length}</h3>
                          <p className="text-xs text-muted-foreground">Consultations</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/60 bg-card/50 p-5">
                          <TrendingUp className="h-8 w-8 text-primary mb-3" />
                          <h3 className="text-2xl font-bold text-foreground">
                            {applications.filter(a => a.status === "approved").length > 0 ? "Approved" : "In Progress"}
                          </h3>
                          <p className="text-xs text-muted-foreground">Pathway Status</p>
                        </div>
                      </div>

                      {/* Recent Applications Card */}
                      <div className="rounded-2xl border border-border/60 bg-card/65 p-6 shadow-xl backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                          <h2 className="font-serif text-xl font-semibold">Active Applications</h2>
                          <Link to="/countries" className="text-xs font-semibold text-primary hover:underline flex items-center">
                            Explore programs <ChevronRight className="h-3 w-3 ml-0.5" />
                          </Link>
                        </div>

                        {applications.length === 0 ? (
                          <div className="py-12 text-center">
                            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/45 mb-3" />
                            <h3 className="text-sm font-semibold text-foreground">No applications found</h3>
                            <p className="text-xs text-muted-foreground mt-1">You haven&apos;t started any visa program applications yet.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {applications.slice(0, 2).map((app) => (
                              <ApplicationCard key={app.id} app={app} getStatusStepIndex={getStatusStepIndex} getStatusColorClass={getStatusColorClass} />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Recent Consultations Card */}
                      <div className="rounded-2xl border border-border/60 bg-card/65 p-6 shadow-xl backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                          <h2 className="font-serif text-xl font-semibold">Scheduled Consultations</h2>
                        </div>

                        {consultations.length === 0 ? (
                          <div className="py-12 text-center">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/45 mb-3" />
                            <h3 className="text-sm font-semibold text-foreground">No consultations scheduled</h3>
                            <p className="text-xs text-muted-foreground mt-1">Book a free session to discuss your profile with a visa expert.</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-border/40 space-y-4">
                            {consultations.slice(0, 3).map((con, idx) => (
                              <div key={con.id} className={`flex items-start justify-between gap-4 ${idx > 0 ? "pt-4" : ""}`}>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                      {con.consultation_type.replaceAll("_", " ").toUpperCase()}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(con.scheduled_at).toLocaleDateString(undefined, { 
                                        weekday: 'short', month: 'short', day: 'numeric' 
                                      })}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-bold text-foreground">
                                    Target Country: {con.preferred_country || "Not specified"}
                                  </h4>
                                  {con.user_notes?.notes && (
                                    <p className="text-xs text-muted-foreground line-clamp-1 italic">
                                      &ldquo;{con.user_notes.notes}&rdquo;
                                    </p>
                                  )}
                                </div>
                                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                                  con.status === "confirmed" || con.status === "completed" 
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                    : con.status === "cancelled" 
                                      ? "bg-destructive/10 text-destructive border-destructive/20"
                                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                }`}>
                                  {con.status.toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "applications" && (
                    <motion.div
                      key="applications"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-border/60 bg-card/65 p-6 shadow-xl backdrop-blur-md space-y-6"
                    >
                      <div className="border-b border-border/40 pb-4">
                        <h2 className="font-serif text-2xl font-semibold">My Visa Applications</h2>
                        <p className="text-xs text-muted-foreground mt-1">Track the dynamic progress of your MEA immigration files in real-time.</p>
                      </div>

                      {applications.length === 0 ? (
                        <div className="py-20 text-center">
                          <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/45 mb-4" />
                          <h3 className="text-base font-semibold text-foreground">No active applications found</h3>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                            To start a visa application program, first browse our country pages and submit a consultation query.
                          </p>
                          <Button asChild className="rounded-full bg-primary mt-6">
                            <Link to="/countries">Browse Countries</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {applications.map((app) => (
                            <ApplicationCard key={app.id} app={app} getStatusStepIndex={getStatusStepIndex} getStatusColorClass={getStatusColorClass} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "consultations" && (
                    <motion.div
                      key="consultations"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-border/60 bg-card/65 p-6 shadow-xl backdrop-blur-md space-y-6"
                    >
                      <div className="flex items-center justify-between border-b border-border/40 pb-4">
                        <div>
                          <h2 className="font-serif text-2xl font-semibold">My Consultations</h2>
                          <p className="text-xs text-muted-foreground mt-1">Manage scheduled sessions and advisory calls.</p>
                        </div>
                        <Button onClick={() => setBookModalOpen(true)} className="rounded-full bg-primary size-sm">
                          Book New
                        </Button>
                      </div>

                      {consultations.length === 0 ? (
                        <div className="py-20 text-center">
                          <Calendar className="mx-auto h-16 w-16 text-muted-foreground/45 mb-4" />
                          <h3 className="text-base font-semibold text-foreground">No sessions scheduled</h3>
                          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                            Need expert advice? Book a free consultation, and a representative will schedule a video/audio call with you.
                          </p>
                          <Button onClick={() => setBookModalOpen(true)} className="rounded-full bg-primary mt-6">
                            Book Free Session
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          {consultations.map((con) => (
                            <div key={con.id} className="rounded-xl border border-border/50 bg-background/55 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                    {con.consultation_type.replaceAll("_", " ").toUpperCase()}
                                  </span>
                                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                                    con.status === "confirmed" || con.status === "completed" 
                                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                      : con.status === "cancelled" 
                                        ? "bg-destructive/10 text-destructive border-destructive/20"
                                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  }`}>
                                    {con.status.toUpperCase()}
                                  </span>
                                </div>
                                <h3 className="text-base font-bold text-foreground flex items-center">
                                  Target: {con.preferred_country || "Not specified"} {con.visa_category ? `(${con.visa_category})` : ""}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-primary" />
                                    {new Date(con.scheduled_at).toLocaleDateString(undefined, { 
                                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                                    })}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-primary" />
                                    {new Date(con.scheduled_at).toLocaleTimeString(undefined, { 
                                      hour: '2-digit', minute: '2-digit' 
                                    })} ({con.duration_minutes}m)
                                  </span>
                                </div>
                                {con.user_notes?.notes && (
                                  <div className="bg-card/50 p-2.5 rounded-lg border border-border/40 mt-2 text-xs text-muted-foreground">
                                    <strong className="text-foreground font-semibold">Your Notes:</strong> &ldquo;{con.user_notes.notes}&rdquo;
                                  </div>
                                )}
                                {con.consultant_notes && (
                                  <div className="bg-primary/5 p-2.5 rounded-lg border border-primary/20 mt-2 text-xs text-primary">
                                    <strong className="font-semibold text-foreground">Consultant Feedback:</strong> &ldquo;{con.consultant_notes}&rdquo;
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "profile" && (
                    <motion.div
                      key="profile"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-border/60 bg-card/65 p-6 shadow-xl backdrop-blur-md space-y-6"
                    >
                      <div className="border-b border-border/40 pb-4">
                        <h2 className="font-serif text-2xl font-semibold">Applicant Profile</h2>
                        <p className="text-xs text-muted-foreground mt-1">Keep your credentials up-to-date to facilitate quick visa assessments.</p>
                      </div>

                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="prof-name">Full Name</Label>
                            <Input
                              id="prof-name"
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="border-border/70 bg-background/50 focus:border-primary/50 h-10"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="prof-email">Email Address (Read-only)</Label>
                            <Input
                              id="prof-email"
                              type="email"
                              disabled
                              value={user.email || ""}
                              className="border-border/70 bg-muted/40 text-muted-foreground h-10"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="prof-phone">Phone Number</Label>
                            <Input
                              id="prof-phone"
                              type="text"
                              placeholder="e.g. +91 99250 64666"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="border-border/70 bg-background/50 focus:border-primary/50 h-10"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="prof-whatsapp">WhatsApp Number</Label>
                            <Input
                              id="prof-whatsapp"
                              type="text"
                              placeholder="e.g. +91 99250 64666"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              className="border-border/70 bg-background/50 focus:border-primary/50 h-10"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="prof-nation">Nationality</Label>
                            <Input
                              id="prof-nation"
                              type="text"
                              placeholder="e.g. Indian"
                              value={nationality}
                              onChange={(e) => setNationality(e.target.value)}
                              className="border-border/70 bg-background/50 focus:border-primary/50 h-10"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="prof-ed">Highest Education Level</Label>
                            <Select value={educationLevel} onValueChange={setEducationLevel}>
                              <SelectTrigger id="prof-ed" className="border-border/70 bg-background/50 h-10">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high_school">High School Diploma</SelectItem>
                                <SelectItem value="diploma">Associate Degree / Diploma</SelectItem>
                                <SelectItem value="bachelors">Bachelor&apos;s Degree</SelectItem>
                                <SelectItem value="masters">Master&apos;s Degree</SelectItem>
                                <SelectItem value="phd">PhD / Doctorate</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="prof-field">Field of Study / Current Profession</Label>
                            <Input
                              id="prof-field"
                              type="text"
                              placeholder="e.g. Nurse, Mechanical Engineering, IT Professional"
                              value={fieldOfStudy}
                              onChange={(e) => setFieldOfStudy(e.target.value)}
                              className="border-border/70 bg-background/50 focus:border-primary/50 h-10"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={profileSaving}
                          className="rounded-full bg-primary px-6 btn-glow text-primary-foreground"
                        >
                          {profileSaving ? (
                            <>
                              <Clock className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Profile Changes"
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* QUICK BOOK CONSULTATION MODAL */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-border/60 bg-card p-6 shadow-2xl backdrop-blur-xl relative"
          >
            <div className="mb-4">
              <h2 className="font-serif text-2xl font-semibold">Book Consultation</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Schedule a video assessment session with our team.</p>
            </div>

            <form onSubmit={handleBookConsultation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="b-type">Consultation Type</Label>
                  <Select value={bookType} onValueChange={setBookType}>
                    <SelectTrigger id="b-type" className="border-border/70 bg-background/50">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work_visa">Work Visa Assessment</SelectItem>
                      <SelectItem value="study_visa">Study Visa Pathways</SelectItem>
                      <SelectItem value="document_review">Document Audit</SelectItem>
                      <SelectItem value="mock_interview">Mock Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b-country">Target Country</Label>
                  <Select value={bookCountry} onValueChange={setBookCountry}>
                    <SelectTrigger id="b-country" className="border-border/70 bg-background/50">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          <><FlagIcon country={c.name} className="mr-1 inline-block align-[-0.1em]" /> {c.name}</>
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other / Not sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <PhoneInputField
                    defaultCountry="IN"
                    value={bookPhone}
                    onChange={setBookPhone}
                    placeholder="e.g. 98765 43210"
                    icon={<Phone className="h-3.5 w-3.5 text-blue-500" />}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>WhatsApp Number</Label>
                    {bookPhone && bookPhone !== bookWhatsapp && (
                      <button
                        type="button"
                        onClick={() => setBookWhatsapp(bookPhone)}
                        className="text-[11px] text-primary hover:underline font-medium"
                      >
                        Same as Phone
                      </button>
                    )}
                  </div>
                  <PhoneInputField
                    defaultCountry="IN"
                    value={bookWhatsapp}
                    onChange={setBookWhatsapp}
                    placeholder="e.g. 98765 43210"
                    icon={<MessageCircle className="h-3.5 w-3.5 text-emerald-500" />}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="b-notes">Profile Brief & Details</Label>
                <Textarea
                  id="b-notes"
                  rows={3}
                  placeholder="Tell us about your work experience, IELTS scores, academic background, or visa history..."
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  className="border-border/70 bg-background/50"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setBookModalOpen(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={bookLoading}
                  className="rounded-full bg-primary text-primary-foreground btn-glow px-6"
                >
                  {bookLoading ? "Booking slot..." : "Book Session"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <SiteFooter />
    </>
  )
}

/* ---------------- Card Components ---------------- */

function ApplicationCard({ 
  app, 
  getStatusStepIndex, 
  getStatusColorClass 
}: { 
  app: Application
  getStatusStepIndex: (status: string) => number
  getStatusColorClass: (status: string) => string
}) {
  const currentStep = getStatusStepIndex(app.status)
  const steps = ["Draft Created", "File Submitted", "Under MEA Review", "Outcome Decided"]

  return (
    <div className="rounded-xl border border-border/50 bg-background/55 p-5 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            {app.countries?.name && <FlagIcon country={app.countries.name} className="text-2xl" />}
            <span className="font-serif text-lg font-bold text-foreground">
              {app.countries?.name} · {app.visa_programs?.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Application ID: <strong className="text-foreground">{app.application_id || "Draft"}</strong>
          </p>
        </div>
        <span className={`self-start sm:self-center border rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
          getStatusColorClass(app.status)
        }`}>
          {app.status.replace("_", " ")}
        </span>
      </div>

      {/* Dynamic Status Progress Bar */}
      <div className="space-y-2 pt-2">
        <div className="relative h-1.5 w-full bg-border/45 rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-primary rounded-full transition-all duration-500" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] md:text-xs">
          {steps.map((label, idx) => (
            <div 
              key={label} 
              className={`font-medium ${
                idx <= currentStep ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3 mt-2">
        <div>
          Application Type: <span className="text-foreground font-semibold uppercase">{app.application_type}</span>
        </div>
        {app.estimated_completion && (
          <div>
            Est. Completion: <span className="text-foreground font-semibold">{new Date(app.estimated_completion).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Loader({ flex }: { flex?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center ${flex ? "h-full" : ""}`}>
      <Clock className="h-8 w-8 text-primary animate-spin" />
      <p className="mt-3 text-xs text-muted-foreground">Loading dashboard updates...</p>
    </div>
  )
}
