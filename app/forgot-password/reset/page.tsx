"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Check if the hash contains the recovery token
    const hashParams = window.location.hash.substring(1)
    if (!hashParams.includes("access_token")) {
      setError("Invalid or expired reset link. Please request a new one.")
    }
  }, [])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) throw error

      setSubmitted(true)
      toast.success("Password reset successfully!")
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen pt-24 pb-20 bg-background flex items-center justify-center">
          <div className="mx-auto max-w-md px-4 text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Reset Link Invalid</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button asChild className="rounded-full">
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  if (submitted) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen pt-24 pb-20 bg-background flex items-center justify-center">
          <div className="mx-auto max-w-md px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">Password Reset!</h1>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. Redirecting to login...
              </p>
              <Button asChild className="rounded-full">
                <Link href="/login">Go to Login</Link>
              </Button>
            </motion.div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-24 pb-20 bg-background">
        <div className="mx-auto max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-xl backdrop-blur-xl"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Create New Password</h1>
              <p className="text-muted-foreground">
                Enter your new password below.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder=""
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 border-border/60 bg-background/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder=""
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 border-border/60 bg-background/50"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
