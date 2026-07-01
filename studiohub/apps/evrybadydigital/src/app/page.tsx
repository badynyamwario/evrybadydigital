
'use client';

import { useSections } from "@/hooks/useSections";

export default function Page() {
  const { sections, loading, error } = useSections("home");
  const hero = sections.find((section) => section.section_key === "hero");
  const cards = sections.filter((section) => section.section_key !== "hero");

  const label = String(hero?.metadata?.label ?? "Digital marketing & branding for professional service businesses");
  const title = hero?.title || "Bold digital growth for professional brands.";
  const subtitle = hero?.subtitle || "A full-service digital agency helping service-based businesses attract clients, build trust, and grow revenue.";
  const primaryCta = String(hero?.metadata?.primary_cta ?? "View our work");
  const primaryHref = String(hero?.metadata?.primary_href ?? "/work");
  const secondaryCta = String(hero?.metadata?.secondary_cta ?? "Talk to us");
  const secondaryHref = String(hero?.metadata?.secondary_href ?? "/contact");
  return (
    <main className="min-h-screen bg-surface text-white">

      {/* ── Hero ── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden bg-surface-alt">
        <div className="pointer-events-none absolute inset-0 blur-3xl opacity-80" style={{ background: 'radial-gradient(circle at top right, rgba(255,215,0,0.18), transparent 24%)' }} />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-72 bg-linear-to-b from-brand-dark/25 to-transparent blur-3xl opacity-80" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-brand/80 backdrop-blur-sm">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand shadow-lg shadow-brand/50" />
                {label}
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl bg-gradient-to-r from-white via-white to-brand/60 bg-clip-text text-transparent">
                  {title}
                </h1>
                <p className="max-w-xl text-lg leading-8 text-white/75 sm:text-xl">
                  {subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href={primaryHref} className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 text-sm font-semibold text-surface shadow-lg shadow-brand/20 transition hover:bg-white hover:shadow-xl hover:shadow-white/10">
                  {primaryCta}
                </a>
                <a href={secondaryHref} className="inline-flex items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10">
                  {secondaryHref === "/contact" ? "Get in touch" : secondaryCta}
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {(cards.length ? cards.slice(0, 3) : [
                  { id: "brand", title: "Branding & identity", subtitle: "Logo, visual systems and positioning that build trust." },
                  { id: "social", title: "Social media growth", subtitle: "Management, content and monetisation for professional brands." },
                  { id: "seo", title: "Website & SEO", subtitle: "Web development, SEO and lead generation that converts." },
                ]).map((card) => (
                  <div key={card.id} className="group rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 text-sm backdrop-blur-sm transition hover:border-white/[0.14]">
                    <p className="font-semibold text-white group-hover:text-brand transition-colors">{card.title}</p>
                    <p className="mt-2 text-white/50 group-hover:text-white/70 transition-colors">{card.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative isolate">
              <div className="absolute -right-16 top-4 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-brand/5 blur-3xl" />
              <div className="relative grid gap-5">
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-8 shadow-2xl shadow-black/20 backdrop-blur-sm transition hover:border-white/[0.12]">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/[0.03] to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="relative">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/40">Our approach</span>
                    <h3 className="mt-4 text-xl font-semibold leading-snug text-white">Strategy-led digital growth for professional service brands.</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">
                      We combine brand strategy, creative design, and performance marketing to build visibility and drive measurable revenue for our clients.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full border border-brand/20 bg-brand/[0.06] px-3 py-1.5 text-xs text-brand/80">Branding</span>
                      <span className="rounded-full border border-brand/20 bg-brand/[0.06] px-3 py-1.5 text-xs text-brand/80">Web Design</span>
                      <span className="rounded-full border border-brand/20 bg-brand/[0.06] px-3 py-1.5 text-xs text-brand/80">SEO</span>
                      <span className="rounded-full border border-brand/20 bg-brand/[0.06] px-3 py-1.5 text-xs text-brand/80">Social</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 shadow-xl shadow-black/15 backdrop-blur-sm transition hover:border-white/[0.12]">
                    <p className="text-2xl font-semibold text-white">50+</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/50">Professional brands empowered</p>
                  </div>
                  <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 shadow-xl shadow-black/15 backdrop-blur-sm transition hover:border-white/[0.12]">
                    <p className="text-2xl font-semibold text-white">4.9★</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/50">Average client satisfaction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Executive summary ── */}
      <section id="about" className="flex min-h-screen items-center border-b border-white/10 bg-surface-alt py-24 lg:py-32">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-brand">Executive summary</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">A modern digital marketing and branding agency for professional services.</h2>
            <p className="text-lg text-white/70 leading-8">
              EvryBady Digital & Branding Agency helps professional service businesses build trust, attract clients, and grow revenue with innovative digital branding and marketing solutions.
            </p>
            <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 text-white/80">
              <p className="font-semibold text-white">Mission</p>
              <p>To help professional businesses build trust, attract clients, and grow revenue through innovative digital branding and marketing solutions.</p>
              <p className="font-semibold text-white">Vision</p>
              <p>To become one of the leading diaspora-owned digital marketing agencies in the UK serving professional service industries.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:w-72">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
              <p className="font-semibold text-white">Social media management</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
              <p className="font-semibold text-white">Website & SEO services</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
              <p className="font-semibold text-white">Branding & lead generation</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="flex min-h-screen items-center py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-brand">What we do</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Creative, marketing and support services for growth-focused brands.</h2>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-5 rounded-2xl border border-white/10 bg-surface-card p-8 shadow-xl shadow-black/18">
              <h3 className="text-xl font-semibold text-white">Creative</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li>Websites</li>
                <li>Brand identity & strategy</li>
                <li>Corporate profile design</li>
                <li>Brochures and digital branding assets</li>
                <li>Creative retainers</li>
              </ul>
            </div>
            <div className="space-y-5 rounded-2xl border border-white/10 bg-surface-card p-8 shadow-xl shadow-black/18">
              <h3 className="text-xl font-semibold text-white">Marketing</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li>Paid search</li>
                <li>Organic search</li>
                <li>Digital performance</li>
                <li>Social media growth</li>
                <li>Social media monetisation</li>
              </ul>
            </div>
            <div className="space-y-5 rounded-2xl border border-white/10 bg-surface-card p-8 shadow-xl shadow-black/18">
              <h3 className="text-xl font-semibold text-white">Support</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li>Consultancy</li>
                <li>Partnerships</li>
                <li>SEO healthcheck</li>
                <li>PPC healthcheck</li>
                <li>Online reputation management</li>
                <li>Website healthcheck</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Objectives ── */}
      <section id="objectives" className="flex min-h-screen items-center bg-surface-objectives py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-brand">Business objectives</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Goals that guide our growth and client success.</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-surface-alt p-8 text-white/80">
              <h3 className="text-xl font-semibold text-white">Short-term goals</h3>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                <li>Secure 5–10 clients</li>
                <li>Build a strong social media presence</li>
                <li>Generate stable monthly recurring income</li>
                <li>Develop a portfolio of testimonials</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-surface-alt p-8 text-white/80">
              <h3 className="text-xl font-semibold text-white">Long-term goals</h3>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                <li>Expand into full-service branding consultancy</li>
                <li>Work with international firms</li>
                <li>Offer digital courses and consulting</li>
                <li>Build a remote content creation team</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Work ── */}
      <section id="work" className="flex min-h-screen items-center bg-surface-alt py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-brand">Clients & work</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">We work with leading companies locally and nationally.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
              <p className="text-xs uppercase tracking-[0.36em] text-brand">Case study</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Rose Gallery</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">A fine art gallery website that reached top SEO positions and drove direct sales.</p>
            </article>
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
              <p className="text-xs uppercase tracking-[0.36em] text-brand">Case study</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Dragon Drilling</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">Bespoke site build and training to support a busy operational team.</p>
            </article>
            <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
              <p className="text-xs uppercase tracking-[0.36em] text-brand">Case study</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Client growth</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">Digital performance and advertising campaigns that deliver a measurable return.</p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Partnership ── */}
      <section className="flex min-h-screen items-center py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-brand">Working in partnership</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">We become part of your team to support long-term growth.</h2>
              <p className="max-w-2xl text-lg text-white/70 leading-8">
                When it comes to business growth, working together is the best way. We are part of your digital department, answering questions and delivering the support your brand needs to move forward with confidence.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-surface p-7 text-white/80">
                <p className="text-xs uppercase tracking-[0.32em] text-brand">Partnership</p>
                <p className="mt-4 text-base leading-7">A strategic partner for marketing, web and ongoing optimisation.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-surface p-7 text-white/80">
                <p className="text-xs uppercase tracking-[0.32em] text-brand">Support</p>
                <p className="mt-4 text-base leading-7">Expert care through launches, updates and performance reviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="flex min-h-[60vh] items-center bg-surface-alt py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 shadow-xl shadow-black/18 md:p-14">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.4em] text-brand">News & insights</p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">Get great content, tips and news straight to your inbox.</h2>
                <p className="max-w-xl text-lg text-white/70 leading-8">Every month, we send the inside scoop on the digital landscape so you stay ahead of the competition.</p>
              </div>
              <form className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <label className="sr-only" htmlFor="newsletter-email">Email address</label>
                <input id="newsletter-email" type="email" placeholder="Your email address" className="min-w-0 rounded-full border border-white/10 bg-surface px-6 py-4 text-white outline-none placeholder:text-white/40" />
                <button type="submit" className="rounded-full bg-brand px-8 py-4 text-sm font-semibold text-surface transition hover:bg-white">Sign up</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="flex min-h-[60vh] items-center py-24 lg:py-32">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="rounded-2xl border border-white/10 bg-surface-alt p-10 text-white shadow-2xl shadow-black/18 md:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.4em] text-brand">Talk to us about your project</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">Start your next digital chapter with Evrybady.</h2>
                <p className="max-w-2xl text-lg text-white/70 leading-8">Book a consultation to discuss websites, marketing, branding or ongoing support that helps your business grow.</p>
              </div>
              <div className="space-y-4 rounded-xl border border-white/10 bg-surface p-6">
                <a href="mailto:hello@evrybady.digital" className="block rounded-full bg-brand px-6 py-4 text-center text-sm font-semibold text-surface">Email us</a>
                <div className="rounded-xl bg-white/5 p-5 text-sm text-white/75">
                  <p className="font-medium text-white">Phone</p>
                  <p className="mt-2">01604 59 89 99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
