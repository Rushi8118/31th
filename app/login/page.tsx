"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, CheckCircle2, Globe2, ShieldCheck, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreeTerms) {
      toast.error("Please accept the terms and conditions.")
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success("Welcome back! Redirecting...")
      router.push(redirect)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-24 pb-20 bg-background relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: Company Info */}
            <div className="lg:col-span-6 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  TRUSTED BY 10,000+ APPLICANTS
                </div>
                <h1 className="font-serif text-5xl font-bold leading-tight text-foreground mb-6">
                  Unlock your <span className="text-primary">global potential</span> today.
                </h1>
                <p className="text-lg text-muted-foreground mb-10 max-w-lg">
                  Access your dashboard to track visa applications, schedule consultations, and manage your documents in one secure place.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Real-time Tracking</h3>
                      <p className="text-sm text-muted-foreground">Monitor every stage of your visa file.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Expert Support</h3>
                      <p className="text-sm text-muted-foreground">Direct access to our senior case officers.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-card/50 border border-border/60 backdrop-blur-sm relative overflow-hidden">
                  <Globe2 className="absolute -right-8 -bottom-8 h-32 w-32 text-primary/5 rotate-12" />
                  <p className="italic text-foreground/80 mb-4 relative z-10">
                    &ldquo;Siddhivinayak Overseas made my journey to Australia completely stress-free. Their portal kept me updated every single day.&rdquo;
                  </p>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">JS</div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Jashwant Singh</p>
                      <p className="text-xs text-muted-foreground">Work Visa · Australia</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side: Login Form */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
              >
                <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-xl backdrop-blur-xl">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
                    <p className="mt-2 text-muted-foreground">Enter your credentials to access your account</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 h-11 border-border/60 bg-background/50 focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11 border-border/60 bg-background/50 focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe} 
                        onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                      />
                      <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                        Remember me on this device
                      </Label>
                    </div>

                    <div className="flex flex-nowrap items-start gap-2 pt-1">
                      <Checkbox 
                        id="terms-login" 
                        checked={agreeTerms} 
                        onCheckedChange={(checked: boolean) => setAgreeTerms(checked)}
                        className="mt-0.5 size-4 shrink-0"
                      />
                      <Label htmlFor="terms-login" className="inline text-sm font-normal leading-tight cursor-pointer">
                        I agree to the <Link href="/terms" className="text-primary hover:underline whitespace-nowrap">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary hover:underline whitespace-nowrap">Privacy Policy</Link>.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-glow"
                    >
                      {loading ? "Signing in..." : "Sign In"}
                      {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>

                  <div className="mt-8 pt-6 border-t border-border/60 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <Link href="/register" className="text-primary font-bold hover:underline">
                        Create an account
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
