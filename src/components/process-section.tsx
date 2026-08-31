const STEPS = [
  {
    n: '01',
    title: 'Free Consultation',
    desc: 'Share your profile. Get an honest, transparent assessment of the best country and visa category for you.',
  },
  {
    n: '02',
    title: 'Profile Building',
    desc: 'Skills assessment, language coaching (IELTS / JLPT / German), and credential evaluation.',
  },
  {
    n: '03',
    title: 'Documentation',
    desc: 'End-to-end paperwork — applications, SOPs, employer letters, and embassy forms drafted by experts.',
  },
  {
    n: '04',
    title: 'Visa Filing',
    desc: 'We file your visa application, track it daily, and prepare you for any interview.',
  },
  {
    n: '05',
    title: 'Pre-departure',
    desc: 'Forex, flight, accommodation, and on-arrival support so you land confident.',
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="relative scroll-mt-24 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-semibold leading-tight text-balance text-foreground md:text-4xl">
            A clear, calm process <span className="text-primary">from day one</span>
          </h2>
          <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
            Five carefully-designed stages, one dedicated case officer, zero surprises.
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            Typical processing: UK work visa cases take about 8 weeks; Europe, Australia, New Zealand
            and other Tier 1 routes usually take 5–6 months after the file is ready. Employer response,
            appointments, document gaps and government decisions can change the timeline.
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="lift-card rounded-2xl border border-border/60 bg-card/70 p-5"
            >
              <div className="card-icon flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {step.n}
              </div>
              <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
