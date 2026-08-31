"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, UserRound } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, updateProfile, isLoading } = useAuth()

  const [saving, setSaving] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "")
      setLastName(profile.last_name || "")
      setUsername(profile.username || "")
    }
  }, [profile])

  const defaultUsername = useMemo(() => {
    return `${firstName} ${lastName}`.trim()
  }, [firstName, lastName])

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const updates = {
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        username: username.trim() || defaultUsername || null,
      }

      const { error } = await updateProfile(updates)
      if (error) throw error

      toast.success("Profile updated")
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-24 pb-20 bg-background">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-border/60 bg-card/60 p-6 shadow-xl backdrop-blur-xl md:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <UserRound className="h-5 w-5 text-primary" />
              </span>
              <div>
                <h1 className="font-serif text-2xl font-semibold text-foreground">Profile</h1>
                <p className="text-sm text-muted-foreground">Update your name and username.</p>
              </div>
            </div>

            <form onSubmit={onSave} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    disabled={isLoading || saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    disabled={isLoading || saving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={defaultUsername || "Your username"}
                  disabled={isLoading || saving}
                />
                <p className="text-xs text-muted-foreground">
                  Default username is your first and last name combined.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading || saving || !user}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>

            {!user && !isLoading && (
              <p className="mt-6 text-sm text-muted-foreground">Please sign in to edit your profile.</p>
            )}
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

