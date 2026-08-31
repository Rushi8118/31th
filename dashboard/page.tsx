"use client"

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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const { user, profile, signOut, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
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
              { label: "Applications", value: "0", icon: FileText, color: "text-blue-500" },
              { label: "Consultations", value: "0", icon: Calendar, color: "text-emerald-500" },
              { label: "Saved Places", value: "0", icon: Bookmark, color: "text-amber-500" },
              { label: "Notifications", value: "0", icon: Bell, color: "text-rose-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/60 bg-card/50 p-4 transition hover:border-primary/30"
              >
                <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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
                    href="/contact"
                    className="flex items-center gap-3 rounded-xl border border-border/40 bg-background p-4 transition hover:border-primary/40"
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Book Consultation</p>
                      <p className="text-xs text-muted-foreground">Free 30-min session</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>

              {/* Application Status */}
              <div className="rounded-2xl border border-border/60 bg-card/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-lg font-semibold">Recent Applications</h2>
                  <span className="text-xs text-muted-foreground">No active applications</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background py-12">
                  <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                  <Button asChild className="mt-4 btn-glow rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/countries">Start Application</Link>
                  </Button>
                </div>
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
