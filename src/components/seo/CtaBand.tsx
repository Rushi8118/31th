import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NAP } from '@/lib/seo/site'

type CtaBandProps = {
  title?: string
  description?: string
}

export function CtaBand({
  title = 'Ready to start your overseas journey?',
  description = 'Book a free consultation with our Surat counsellors. We will assess your profile and map the right study or work visa pathway.',
}: CtaBandProps) {
  return (
    <section className="px-4 pb-20 md:px-6 md:pb-28">
      <div className="shimmer-border mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl border border-primary/30 bg-primary/10 p-6 text-center sm:p-8 md:flex-row md:p-10 md:text-left">
        <div className="max-w-xl">
          <h2 className="font-serif text-xl font-semibold leading-tight text-foreground sm:text-2xl md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">{description}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/contact" className="group flex items-center justify-center">
              Free consultation
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={NAP.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href={`tel:${NAP.phoneIN}`} className="flex items-center justify-center">
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Call
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
