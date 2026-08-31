"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Lock, User, Phone as PhoneIcon, MessageCircle, ArrowRight, ShieldCheck, Briefcase, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [phone, setPhone] = useState<string | undefined>()
  const [whatsapp, setWhatsapp] = useState<string | undefined>()
  const [agreeTerms, setAgreeTerms] = useState(false)
  
  const supabase = createClient()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }

    if (!agreeTerms) {
      return toast.error("You must agree to the terms and conditions")
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: phone,
            whatsapp: whatsapp,
          }
        }
      })

      if (error) throw error

      if (data.user && data.session) {
        const { error: profileError } = await supabase.from("user_profiles").upsert({
          id: data.user.id,
          email: data.user.email!,
          full_name: `${formData.firstName} ${formData.lastName}`,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: phone,
          whatsapp: whatsapp,
        })

        if (profileError) {
          console.error("Profile save failed:", profileError.message)
        }
      }

      toast.success("Account created! Please check your email for verification.")
      
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-24 pb-20 bg-background relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />

        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left side: Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-xl backdrop-blur-xl"
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
                  <p className="mt-2 text-muted-foreground">Join thousands of successful global applicants.</p>
                </div>

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10 h-11 border-border/60 bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="pl-10 h-11 border-border/60 bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-11 border-border/60 bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number</Label>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={phone}
                      onChange={setPhone}
                      className="flex h-11 w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={whatsapp}
                      onChange={setWhatsapp}
                      className="flex h-11 w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
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
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 h-11 border-border/60 bg-background/50"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-nowrap items-start gap-2 pt-2">
                      <Checkbox 
                        id="terms" 
                        checked={agreeTerms} 
                        onCheckedChange={(checked: boolean) => setAgreeTerms(checked)}
                        className="mt-0.5 size-4 shrink-0"
                      />
                      <Label htmlFor="terms" className="inline text-sm font-normal leading-tight cursor-pointer">
                        I agree to the <Link href="/terms" className="text-primary hover:underline whitespace-nowrap">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary hover:underline whitespace-nowrap">Privacy Policy</Link>.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-glow text-base"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                      {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>
                </form>

                <div className="mt-8 pt-6 border-t border-border/60 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right side: Information */}
            <div className="lg:col-span-5">
              <div className="sticky top-32 space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Why register with us?</h2>
                  <p className="text-muted-foreground">Your account is your gateway to international opportunities. Get personalized visa guidance and track your progress in real-time.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 p-4 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm transition-all hover:border-primary/30">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Verified & Secure</h3>
                      <p className="text-sm text-muted-foreground">Your personal and professional data is protected by bank-level encryption.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm transition-all hover:border-primary/30">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Work Visa Pathways</h3>
                      <p className="text-sm text-muted-foreground">Access specialized programs for Japan, Australia, UK, and Europe.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-2xl bg-card/40 border border-border/40 backdrop-blur-sm transition-all hover:border-primary/30">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Study Visa Support</h3>
                      <p className="text-sm text-muted-foreground">Guidance on admissions, scholarships, and student visas globally.</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Live System Status</p>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Our servers are operational. New registrations are currently being processed within <span className="font-bold text-primary">2 minutes</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      
      <style jsx global>{`
        .PhoneInputInput {
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          padding: 0;
          color: inherit;
        }
      `}</style>
    </>
  )
}
