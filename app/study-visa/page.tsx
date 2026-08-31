"use client"

import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Globe2, CheckCircle2, ArrowRight, Building2, MapPin, Award, Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import Image from "next/image"

const PARTNER_UNIVERSITIES = [
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    description: "Unlock world-class education and build a global future with 2-year post-study work visa options.",
    universities: [
      "University of Huddersfield", "University of Leicester", "University of Roehampton",
      "Coventry University", "Buckinghamshire New University", "Northumbria University QAHE",
      "Ulster University QAHE", "Aston University - London Campus", "University of Greenwich",
      "Middlesex University", "University of Law", "University of Wales Trinity Saint David",
      "University of West London", "University of East London", "University of Hull - London",
      "Anglia Ruskin University", "University of Chester", "Royal Holloway University of London",
      "Swansea University", "Teesside University", "University of Bedfordshire",
      "Cardiff Metropolitan University", "Edinburgh Napier University", "Glasgow Caledonian University",
      "London Metropolitan University", "Oxford Brookes University", "De Montfort University",
      "UCLAN", "Navitas Foundation"
    ]
  },
  {
    country: "France",
    flag: "🇫🇷",
    description: "A destination for innovation, culture & excellence with affordable tuition and great career opportunities.",
    universities: [
      "Schiller International University, Paris Campus", "Burgundy School of Business",
      "ICN Business School", "MediaSchool Paris", "EDC Paris Business School",
      "Aura International School of Management", "Neoma Business School",
      "ISC Paris School of Business", "Paris School of Business", "Skema Business School",
      "EPITA", "Rennes School of Business", "Toulouse Business School",
      "Montpellier Business School", "Aivancity School of AI & Data Science",
      "FH (Institut Francais De l'Hôtellerie)", "ISTEC"
    ]
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    description: "Top-ranked universities with 18-month post-study work opportunities and high quality of life.",
    universities: [
      "Schiller University", "EU Business School", "ISM - International School of Management",
      "Arden University", "UE (Univ. of Europe for Applied Sciences)",
      "MDH (MediaDesign Hochschule)", "EBS Universitat", "Lancaster Uni Leipzig Campus"
    ]
  }
]

export default function StudyVisaPage() {
  return (
    <>
      <SiteHeader />
      <main className="premium-page min-h-screen bg-background pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative px-4 md:px-6 mb-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                  <GraduationCap className="h-3.5 w-3.5" />
                  STUDY ABROAD PROGRAMS 2026
                </div>
                <h1 className="font-serif text-5xl font-bold leading-tight text-foreground mb-6 md:text-7xl">
                  Your Dream. <br />
                  <span className="text-primary">Our Guidance.</span> <br />
                  Your Future.
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                  Unlock world-class education and build a global future. We partner with top-ranked universities across the UK, France, and Germany to ensure your success.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground shadow-glow h-12 px-8">
                    <Link href="/contact">Apply for Admission</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full border-primary/20 hover:bg-primary/5 h-12 px-8">
                    Explore Universities
                  </Button>
                </div>
                
                <div className="mt-12 grid grid-cols-3 gap-8 border-t border-border/60 pt-8">
                  <div>
                    <p className="text-3xl font-bold text-foreground">500+</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Partner Unis</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">98%</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Visa Success</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">24/7</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Expert Support</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-3xl overflow-hidden border border-border/60 shadow-2xl"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1523050853064-807039098eb5?auto=format&fit=crop&q=80"
                  alt="Students studying abroad"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-card/60 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">Intake Status: Open</p>
                  </div>
                  <p className="text-sm text-foreground/90 font-medium">Now accepting applications for Sept 2026 intake across all partner institutions.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Support Services */}
        <section className="py-20 bg-primary/5">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { icon: <Users className="h-6 w-6" />, label: "Expert Counselling" },
                { icon: <Building2 className="h-6 w-6" />, label: "Admission Support" },
                { icon: <Award className="h-6 w-6" />, label: "Visa Filing & Prep" },
                { icon: <Globe2 className="h-6 w-6" />, label: "Worldwide Opportunities" },
                { icon: <CheckCircle2 className="h-6 w-6" />, label: "Post-Arrival Support" }
              ].map((service, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-background border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                    {service.icon}
                  </div>
                  <p className="text-sm font-bold text-foreground leading-tight">{service.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Countries & Universities */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl font-bold text-foreground">Our Partner <span className="text-primary">Universities</span></h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">We exclusively represent prestigious institutions across Europe and the UK.</p>
            </div>

            <div className="space-y-20">
              {PARTNER_UNIVERSITIES.map((country, idx) => (
                <motion.div
                  key={country.country}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-border pb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{country.flag}</span>
                        <h3 className="text-3xl font-bold text-foreground">Study in {country.country}</h3>
                      </div>
                      <p className="text-muted-foreground max-w-xl">{country.description}</p>
                    </div>
                    <Button asChild variant="link" className="text-primary font-bold p-0 h-auto">
                      <Link href="/contact">Apply for {country.country} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {country.universities.map((uni, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{uni}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 md:px-6">
          <div className="mx-auto max-w-5xl rounded-3xl bg-primary p-12 text-center text-primary-foreground shadow-glow relative overflow-hidden">
            <Globe2 className="absolute -right-20 -bottom-20 h-80 w-80 text-white/10 rotate-12" />
            <h2 className="relative z-10 font-serif text-4xl font-bold mb-6">Ready to start your journey?</h2>
            <p className="relative z-10 text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
              Get personalized counselling from our experts and secure your seat in one of our partner universities today.
            </p>
            <Button asChild size="lg" variant="secondary" className="relative z-10 rounded-full h-12 px-10 font-bold">
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
