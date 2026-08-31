"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en'
import { useSearchParams } from "next/navigation"

const WORK_COUNTRIES = [
  "Japan",
  "Australia",
  "Canada",
  "United Kingdom",
  "Germany",
  "New Zealand",
  "Russia",
  "United States",
  "Other / Not sure",
]

const STUDY_COUNTRIES = [
  "United Kingdom",
  "Germany",
  "France",
  "Canada",
  "Australia",
  "New Zealand",
  "United States",
  "Ireland",
  "Other / Not sure",
]

const WORK_CATEGORIES = [
  "Skilled / Specified Worker (Japan SSW)",
  "Australia 482 / 186 / 491",
  "Canada Express Entry / LMIA",
  "UK Skilled Worker / Health & Care",
  "Germany EU Blue Card / Opportunity Card",
  "New Zealand AEWV",
  "Russia HQS",
  "USA H-1B / EB-3",
  "Not sure — please advise",
]

type FormState = "idle" | "loading" | "done"

export function ContactSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [workState, setWorkState] = useState<FormState>("idle")
  const [studyState, setStudyState] = useState<FormState>("idle")
  
  // Phone and WhatsApp states
  const [workPhone, setWorkPhone] = useState<string | undefined>()
  const [workWhatsapp, setWorkWhatsapp] = useState<string | undefined>()
  const [studyPhone, setStudyPhone] = useState<string | undefined>()
  const [studyWhatsapp, setStudyWhatsapp] = useState<string | undefined>()

  // Detected country names shown under inputs
  const [workPhoneCountry, setWorkPhoneCountry] = useState<string>("")
  const [workWhatsappCountry, setWorkWhatsappCountry] = useState<string>("")
  const [studyPhoneCountry, setStudyPhoneCountry] = useState<string>("")
  const [studyWhatsappCountry, setStudyWhatsappCountry] = useState<string>("")

  // Form field states for "Other" options
  const [workCountry, setWorkCountry] = useState("")
  const [workCategory, setWorkCategory] = useState("")
  const [studyCountry, setStudyCountry] = useState("")

  const supabase = createClient()
  const router = useRouter()
  const { user } = useAuth()
  const searchParams = useSearchParams()

  // Autofill from URL params (e.g. /contact?country=uk&program=skilled-worker)
  useEffect(() => {
    const countryParam = searchParams.get("country")
    const programParam = searchParams.get("program")
    if (countryParam && !workCountry && !studyCountry) {
      const pretty = countryParam.replaceAll("-", " ").replace(/\b\w/g, (m) => m.toUpperCase())
      setWorkCountry(pretty)
      setStudyCountry(pretty)
    }
    if (programParam && !workCategory) {
      const pretty = programParam.replaceAll("-", " ").replace(/\b\w/g, (m) => m.toUpperCase())
      setWorkCategory(pretty)
    }
  }, [searchParams])

  const handleSubmit = (
    setter: React.Dispatch<React.SetStateAction<FormState>>,
    type: "work" | "study"
  ) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please login to submit your application", {
        description: "You need an account to track your visa process.",
        action: {
          label: "Login Now",
          onClick: () => router.push("/login")
        }
      })
      return
    }

    setter("loading")
    
    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())
      
      const { data: { session } } = await supabase.auth.getSession()
      
      const phone = type === "work" ? workPhone : studyPhone
      const whatsapp = type === "work" ? workWhatsapp : studyWhatsapp

      // Logic for "Other" values
      const finalCountry = (data.country === "Other / Not sure" && data.other_country) 
        ? data.other_country.toString() 
        : data.country?.toString()

      const finalCategory = (data.category === "Not sure — please advise" && data.other_category)
        ? data.other_category.toString()
        : data.category?.toString()

      const insertData: any = {
        consultation_type: type === "work" ? "work_visa" : "study_visa",
        status: "requested",
        scheduled_at: new Date().toISOString(),
        phone_number: phone || null,
        whatsapp_number: whatsapp || null,
        preferred_country: finalCountry,
        visa_category: finalCategory,
        user_notes: {
          ...data,
          source: "contact_section",
          submitted_at: new Date().toISOString()
        },
        user_id: session?.user?.id || null,
      }
      
      const { error: dbError } = await supabase
        .from("consultations")
        .insert([insertData] as any)

      if (dbError) {
        console.error("Supabase Database Error:", dbError)
        throw new Error(dbError.message || "Database connection error")
      }
      
      setter("done")
      toast.success("Enquiry sent successfully!")

      // Send confirmation email (best-effort)
      fetch("/api/emails/consultation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          preferred_country: finalCountry,
        }),
      }).catch(() => {})
    } catch (err: any) {
      console.error("Submission Failure:", err)
      setter("idle")
      
      let errorMsg = "Failed to send enquiry."
      if (err.message) {
        errorMsg = err.message
      } else if (typeof err === 'string') {
        errorMsg = err
      }
      
      toast.error(`Error: ${errorMsg}. Please ensure you have run the schema.sql in Supabase.`)
    }
  }

  if (!mounted) {
    return (
      <section id="contact" className="relative scroll-mt-24 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-[600px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground font-medium">Loading form...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
              Talk to a <span className="text-primary">visa expert</span>
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Free 30-minute consultation. We&apos;ll review your profile, recommend the
              best country and visa category, and outline timelines and costs.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                  <Phone className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Call us
                  </p>
                  <a
                    href="tel:+919925064666"
                    className="mt-0.5 block font-semibold text-foreground transition hover:text-primary"
                  >
                    +91 99250 64666
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    WhatsApp
                  </p>
                  <a
                    href="https://wa.me/919925064666"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 block font-semibold text-foreground transition hover:text-primary"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                  <Mail className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <a
                    href="mailto:info@siddhivinayakoverseas.com"
                    className="mt-0.5 block font-semibold text-foreground transition hover:text-primary"
                  >
                    info@siddhivinayakoverseas.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                  <MapPin className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Office
                  </p>
                  <p className="mt-0.5 font-semibold text-foreground">
                    Siddhivinayak Overseas, India
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur-md md:p-8"
            >
              <Tabs defaultValue="work" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-full bg-background/60 p-1">
                  <TabsTrigger
                    value="work"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Work Visa Inquiry
                  </TabsTrigger>
                  <TabsTrigger
                    value="study"
                    className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Study Visa Inquiry
                  </TabsTrigger>
                </TabsList>

                {/* WORK VISA FORM */}
                <TabsContent value="work" className="mt-6">
                  {workState === "done" ? (
                    <SuccessState
                      title="Thank you!"
                      message="Your work visa enquiry has been received. A case officer will reach out within one business day."
                    />
                  ) : (
                    <form
                      onSubmit={handleSubmit(setWorkState, "work")}
                      className="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >
                      <Field id="w-name" label="Full name">
                        <Input id="w-name" name="name" required placeholder="Your full name" />
                      </Field>
                      <Field id="w-email" label="Email">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="w-email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="pl-10"
                          />
                        </div>
                      </Field>
                      <Field id="w-phone" label="Phone Number">
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="w-phone" className="text-xs font-medium text-muted-foreground">
                            {workPhoneCountry ? `Detected: ${workPhoneCountry}` : ""}
                          </Label>
                        </div>
                        <div className="relative phone-input-container">
                          <Phone className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-blue-500 pointer-events-none" />
                          <PhoneInput
                            international
                            displayInitialValueAsLocalNumber={false}
                            defaultCountry="IN"
                            value={workPhone}
                            onChange={(val) => setWorkPhone(val)}
                            onCountryChange={(c) => setWorkPhoneCountry(c ? en[c] : "")}
                            countrySelectComponent={CountrySelectWithCode}
                            className="flex h-10 w-full rounded-md border border-border/70 bg-background/50 px-3 py-2 text-sm pl-10"
                          />
                        </div>
                      </Field>
                      <Field id="w-whatsapp" label="WhatsApp Number">
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="w-whatsapp" className="text-xs font-medium text-muted-foreground">
                            {workWhatsappCountry ? `Detected: ${workWhatsappCountry}` : ""}
                          </Label>
                        </div>
                        <div className="relative phone-input-container">
                          <MessageCircle className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-green-500 pointer-events-none" />
                          <PhoneInput
                            international
                            displayInitialValueAsLocalNumber={false}
                            defaultCountry="IN"
                            value={workWhatsapp}
                            onChange={(val) => setWorkWhatsapp(val)}
                            onCountryChange={(c) => setWorkWhatsappCountry(c ? en[c] : "")}
                            countrySelectComponent={CountrySelectWithCode}
                            className="flex h-10 w-full rounded-md border border-border/70 bg-background/50 px-3 py-2 text-sm pl-10"
                          />
                        </div>
                      </Field>
                      <Field id="w-country" label="Preferred country">
                        <CountrySelect id="w-country" options={WORK_COUNTRIES} value={workCountry} onChange={setWorkCountry} />
                        {workCountry === "Other / Not sure" && (
                          <div className="mt-3">
                            <Input 
                              name="other_country" 
                              placeholder="Enter country name" 
                              className="h-10 border-primary/30 focus:border-primary"
                            />
                          </div>
                        )}
                      </Field>
                      <Field id="w-category" label="Visa category">
                        <Select name="category" onValueChange={setWorkCategory}>
                          <SelectTrigger
                            id="w-category"
                            className="border-border/70 bg-background/50"
                          >
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {WORK_CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {workCategory === "Not sure — please advise" && (
                          <div className="mt-3">
                            <Input 
                              name="other_category" 
                              placeholder="Describe your requirement" 
                              className="h-10 border-primary/30 focus:border-primary"
                            />
                          </div>
                        )}
                      </Field>
                      <Field id="w-experience" label="Years of experience">
                        <Input
                          id="w-experience"
                          name="experience"
                          type="number"
                          min={0}
                          placeholder="e.g. 4"
                        />
                      </Field>
                      <Field id="w-role" label="Current role / industry">
                        <Input id="w-role" name="role" placeholder="e.g. Nurse, Welder, IT" />
                      </Field>
                      <Field id="w-message" label="Tell us more" full>
                        <Textarea
                          id="w-message"
                          name="message"
                          rows={3}
                          placeholder="English proficiency, qualifications, target role, timeline..."
                        />
                      </Field>
                      <SubmitRow
                        loading={workState === "loading"}
                        label="Request work visa consultation"
                      />
                    </form>
                  )}
                </TabsContent>

                {/* STUDY VISA FORM */}
                <TabsContent value="study" className="mt-6">
                  {studyState === "done" ? (
                    <SuccessState
                      title="Thank you!"
                      message="Your study visa enquiry has been received. Our academic advisors will reach out shortly."
                    />
                  ) : (
                    <form
                      onSubmit={handleSubmit(setStudyState, "study")}
                      className="grid grid-cols-1 gap-5 md:grid-cols-2"
                    >
                      <Field id="s-name" label="Full name">
                        <Input id="s-name" name="name" required placeholder="Your full name" />
                      </Field>
                      <Field id="s-email" label="Email">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="s-email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="pl-10"
                          />
                        </div>
                      </Field>
                      <Field id="s-phone" label="Phone Number">
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="s-phone" className="text-xs font-medium text-muted-foreground">
                            {studyPhoneCountry ? `Detected: ${studyPhoneCountry}` : ""}
                          </Label>
                        </div>
                        <div className="relative phone-input-container">
                          <Phone className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-blue-500 pointer-events-none" />
                          <PhoneInput
                            international
                            displayInitialValueAsLocalNumber={false}
                            defaultCountry="IN"
                            value={studyPhone}
                            onChange={(val) => setStudyPhone(val)}
                            onCountryChange={(c) => setStudyPhoneCountry(c ? en[c] : "")}
                            countrySelectComponent={CountrySelectWithCode}
                            className="flex h-10 w-full rounded-md border border-border/70 bg-background/50 px-3 py-2 text-sm pl-10"
                          />
                        </div>
                      </Field>
                      <Field id="s-whatsapp" label="WhatsApp Number">
                        <div className="flex items-center justify-between mb-1">
                          <Label htmlFor="s-whatsapp" className="text-xs font-medium text-muted-foreground">
                            {studyWhatsappCountry ? `Detected: ${studyWhatsappCountry}` : ""}
                          </Label>
                        </div>
                        <div className="relative phone-input-container">
                          <MessageCircle className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-green-500 pointer-events-none" />
                          <PhoneInput
                            international
                            displayInitialValueAsLocalNumber={false}
                            defaultCountry="IN"
                            value={studyWhatsapp}
                            onChange={(val) => setStudyWhatsapp(val)}
                            onCountryChange={(c) => setStudyWhatsappCountry(c ? en[c] : "")}
                            countrySelectComponent={CountrySelectWithCode}
                            className="flex h-10 w-full rounded-md border border-border/70 bg-background/50 px-3 py-2 text-sm pl-10"
                          />
                        </div>
                      </Field>
                      <Field id="s-country" label="Preferred country">
                        <CountrySelect id="s-country" options={STUDY_COUNTRIES} value={studyCountry} onChange={setStudyCountry} />
                        {studyCountry === "Other / Not sure" && (
                          <div className="mt-3">
                            <Input 
                              name="other_country" 
                              placeholder="Enter country name" 
                              className="h-10 border-primary/30 focus:border-primary"
                            />
                          </div>
                        )}
                      </Field>
                      <Field id="s-level" label="Study level">
                        <Select name="level">
                          <SelectTrigger
                            id="s-level"
                            className="border-border/70 bg-background/50"
                          >
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bachelors">Bachelor&apos;s</SelectItem>
                            <SelectItem value="masters">Master&apos;s</SelectItem>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="diploma">Diploma / Foundation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field id="s-intake" label="Target intake">
                        <Input
                          id="s-intake"
                          name="intake"
                          placeholder="e.g. Sep 2026 / Jan 2027"
                        />
                      </Field>
                      <Field id="s-field" label="Field of study">
                        <Input
                          id="s-field"
                          name="field"
                          placeholder="e.g. Data Science, Nursing"
                        />
                      </Field>
                      <Field id="s-message" label="Tell us about you" full>
                        <Textarea
                          id="s-message"
                          name="message"
                          rows={3}
                          placeholder="Academic background, IELTS / TOEFL scores, scholarship interest..."
                        />
                      </Field>
                      <SubmitRow
                        loading={studyState === "loading"}
                        label="Request study visa consultation"
                      />
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- helpers ---------------- */

function CountrySelectWithCode({ value, onChange, options, ...rest }: any) {
  const { iconComponent, ...domProps } = rest;
  
  return (
    <div className="relative flex items-center pr-2 border-r border-border/40 mr-3 h-full min-w-[70px]">
      <select
        {...domProps}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none bg-transparent pl-2 pr-6 py-1 text-xs font-bold text-primary focus:outline-none cursor-pointer z-20"
      >
        <option value="">Code</option>
        {options.map(({ value, label }: any) => {
          if (!value) return null;
          let callingCode = "";
          try {
            callingCode = getCountryCallingCode(value);
          } catch (e) {}
          return (
            <option key={value} value={value} className="bg-background text-foreground">
              {value} {callingCode ? `(+${callingCode})` : ""}
            </option>
          );
        })}
      </select>
      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-primary pointer-events-none" />
    </div>
  )
}

function Field({
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
      <div className="mt-2 [&_input]:border-border/70 [&_input]:bg-background/50 [&_textarea]:border-border/70 [&_textarea]:bg-background/50">
        {children}
      </div>
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
        /* Style the select dropdown options */
        .phone-input-container select option {
          background-color: #0f172a; /* Slate-900 / Dark theme */
          color: #f8fafc; /* Slate-50 */
          padding: 8px;
        }
      `}</style>
    </div>
  )
}

function CountrySelect({ id, options, value, onChange }: { id: string; options: string[]; value?: string; onChange?: (val: string) => void }) {
  return (
    <Select name="country" value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="border-border/70 bg-background/50">
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {options.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SubmitRow({ loading, label }: { loading: boolean; label: string }) {
  return (
    <div className="md:col-span-2">
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="btn-glow w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? "Sending..." : label}
        {!loading && <Send className="ml-2 h-4 w-4" />}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        By submitting, you agree to be contacted about your enquiry. We never share your data.
      </p>
    </div>
  )
}

function SuccessState({ title, message }: { title: string; message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <CheckCircle2 className="h-14 w-14 text-primary" />
      <h3 className="mt-4 font-serif text-2xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-muted-foreground">{message}</p>
    </div>
  )
}
