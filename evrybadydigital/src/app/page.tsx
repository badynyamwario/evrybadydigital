
'use client';

import { useSections } from "@/hooks/useSections";

export default function Page() {
  const { sections, loading, error } = useSections("home");
  const hero = sections.find((section) => section.section_key === "hero");
  const cards = sections.filter((section) => section.section_key !== "hero");

  const label = hero?.metadata?.label || "Digital marketing & branding for professional service businesses";
  const title = hero?.title || "Bold digital growth for professional brands.";
  const subtitle = hero?.subtitle || "A full-service digital agency helping service-based businesses attract clients, build trust, and grow revenue.";
  const primaryCta = hero?.metadata?.primary_cta || "View our work";
  const primaryHref = hero?.metadata?.primary_href || "/work";
  const secondaryCta = hero?.metadata?.secondary_cta || "Talk to us";
  const secondaryHref = hero?.metadata?.secondary_href || "/contact";
  const heroImage = hero?.metadata?.image_url || '';
  const featureA = hero?.metadata?.feature_a_title || "Branding & identity";
  const featureADetail = hero?.metadata?.feature_a_detail || "Logo, visual systems and positioning that build trust.";
  const featureB = hero?.metadata?.feature_b_title || "Website & SEO";
  const featureBDetail = hero?.metadata?.feature_b_detail || "Web development, SEO and lead generation that converts.";
  const featuredHeading = hero?.metadata?.featured_heading || "Featured case study";
  const featuredName = hero?.metadata?.featured_name || "Rose Gallery";
  const featuredDescription = hero?.metadata?.featured_description || "A Northampton fine art gallery project with an 83% keyword first place performance and a modern online shop experience.";
  const featuredBadge1 = hero?.metadata?.featured_badge_1 || "Web design";
  const featuredBadge2 = hero?.metadata?.featured_badge_2 || "SEO";
  const featuredBadge3 = hero?.metadata?.featured_badge_3 || "Creative support";
  const stat1 = hero?.metadata?.stat_1 || "83%";
  const stat1Label = hero?.metadata?.stat_1_label || "of focus keywords reaching first place";
  const stat2 = hero?.metadata?.stat_2 || "Local & national";
  const stat2Label = hero?.metadata?.stat_2_label || "Supporting startups through bluechip brands.";

  return (
    <main className="min-h-screen bg-[#0a1e0a] text-white">
      <section className="relative overflow-hidden bg-[#08140d] py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 blur-3xl opacity-80" style={{ background: 'radial-gradient(circle at top right, rgba(255,215,0,0.18), transparent 24%)' }} />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-72 bg-linear-to-b from-[#806500]/25 to-transparent blur-3xl opacity-80" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#f7e7a6]/30 bg-white/5 px-4 py-2 text-sm text-[#f7e7a6]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#f7e7a6]" />
                {label}
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="max-w-xl text-lg leading-8 text-white/75 sm:text-xl">
                  {subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <a href={primaryHref} className="inline-flex items-center justify-center rounded-full bg-[#f7e7a6] px-8 py-3 text-sm font-semibold text-[#0a1e0a] transition hover:bg-white">
                  {primaryCta}
                </a>
                <a href={secondaryHref} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  {secondaryCta}
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {(cards.length ? cards.slice(0, 3) : [
                  { id: "brand", title: "Branding & identity", subtitle: "Logo, visual systems and positioning that build trust." },
                  { id: "social", title: "Social media growth", subtitle: "Management, content and monetisation for professional brands." },
                  { id: "seo", title: "Website & SEO", subtitle: "Web development, SEO and lead generation that converts." },
                ]).map((card) => (
                  <div key={card.id} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
                    <p className="font-semibold text-white">{card.title}</p>
                    <p className="mt-2 text-white/70">{card.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative isolate overflow-hidden rounded-4xl border border-white/10 bg-[#ffffff0d] p-8 shadow-2xl shadow-[#00000030] sm:p-10">
              <div className="absolute -right-12 top-8 h-48 w-48 rounded-full bg-[#f7e7a6]/20 blur-3xl" />
              <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-[#f7e7a6]/10 blur-3xl" />
              <div className="relative grid gap-6">
                <div className="rounded-3xl bg-[#0a1e0a] p-8 text-white/90 shadow-xl shadow-[#00000020]">
                  <span className="text-sm uppercase tracking-[0.36em] text-[#f7e7a6]">{featuredHeading}</span>
                  <h2 className="mt-5 text-3xl font-semibold leading-tight">{featuredName}</h2>
                  <p className="mt-4 text-sm leading-7 text-white/70">{featuredDescription}</p>
                  <div className="mt-6 flex flex-wrap gap-3 text-xs text-[#f7e7a6]">
                    <span className="rounded-full border border-[#f7e7a6]/20 bg-[#f7e7a6]/5 px-3 py-2">{featuredBadge1}</span>
                    <span className="rounded-full border border-[#f7e7a6]/20 bg-[#f7e7a6]/5 px-3 py-2">{featuredBadge2}</span>
                    <span className="rounded-full border border-[#f7e7a6]/20 bg-[#f7e7a6]/5 px-3 py-2">{featuredBadge3}</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
                    <p className="font-semibold text-white">{stat1}</p>
                    <p className="mt-2 text-white/70">{stat1Label}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
                    <p className="font-semibold text-white">{stat2}</p>
                    <p className="mt-2 text-white/70">{stat2Label}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-white/10 bg-[#08140d] py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 sm:px-8 lg:px-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">Executive summary</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">A modern digital marketing and branding agency for professional services.</h2>
            <p className="text-white/70 leading-8">
              EvryBady Digital & Branding Agency helps professional service businesses build trust, attract clients, and grow revenue with innovative digital branding and marketing solutions.
            </p>
            <div className="space-y-4 rounded-4xl border border-white/10 bg-white/5 p-6 text-white/80">
              <p className="font-semibold text-white">Mission</p>
              <p>To help professional businesses build trust, attract clients, and grow revenue through innovative digital branding and marketing solutions.</p>
              <p className="font-semibold text-white">Vision</p>
              <p>To become one of the leading diaspora-owned digital marketing agencies in the UK serving professional service industries.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
              <p className="font-semibold text-white">Social media management</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
              <p className="font-semibold text-white">Website & SEO services</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
              <p className="font-semibold text-white">Branding & lead generation</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">What we do</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Creative, marketing and support services for growth-focused brands.</h2>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 rounded-4xl border border-white/10 bg-[#0c2113] p-8 shadow-xl shadow-[#0000002d]">
              <h3 className="text-xl font-semibold text-white">Creative</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li>Websites</li>
                <li>Brand identity & strategy</li>
                <li>Corporate profile design</li>
                <li>Brochures and digital branding assets</li>
                <li>Creative retainers</li>
              </ul>
            </div>
            <div className="space-y-6 rounded-4xl border border-white/10 bg-[#0c2113] p-8 shadow-xl shadow-[#0000002d]">
              <h3 className="text-xl font-semibold text-white">Marketing</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li>Paid search</li>
                <li>Organic search</li>
                <li>Digital performance</li>
                <li>Social media growth</li>
                <li>Social media monetisation</li>
              </ul>
            </div>
            <div className="space-y-6 rounded-4xl border border-white/10 bg-[#0c2113] p-8 shadow-xl shadow-[#0000002d]">
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

      <section id="objectives" className="py-20 bg-[#0b1c14]">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">Business objectives</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Goals that guide our growth and client success.</h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-4xl border border-white/10 bg-[#08140d] p-8 text-white/80">
              <h3 className="text-xl font-semibold text-white">Short-term goals</h3>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                <li>Secure 5–10 clients</li>
                <li>Build a strong social media presence</li>
                <li>Generate stable monthly recurring income</li>
                <li>Develop a portfolio of testimonials</li>
              </ul>
            </div>
            <div className="rounded-4xl border border-white/10 bg-[#08140d] p-8 text-white/80">
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

      <section id="work" className="bg-[#08140d] py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">Clients & work</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">We work with leading companies locally and nationally.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <article className="group overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.36em] text-[#f7e7a6]">Case study</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Rose Gallery</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">A fine art gallery website that reached top SEO positions and drove direct sales.</p>
            </article>
            <article className="group overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.36em] text-[#f7e7a6]">Case study</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Dragon Drilling</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">Bespoke site build and training to support a busy operational team.</p>
            </article>
            <article className="group overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.36em] text-[#f7e7a6]">Case study</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">Client growth</h3>
              <p className="mt-4 text-sm leading-7 text-white/70">Digital performance and advertising campaigns that deliver a measurable return.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">Working in partnership</p>
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">We become part of your team to support long-term growth.</h2>
              <p className="max-w-2xl text-white/70 leading-8">
                When it comes to business growth, working together is the best way. We are part of your digital department, answering questions and delivering the support your brand needs to move forward with confidence.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-4xl border border-white/10 bg-[#0a1e0a] p-8 text-white/80">
                <p className="text-sm uppercase tracking-[0.32em] text-[#f7e7a6]">Partnership</p>
                <p className="mt-4 text-base">A strategic partner for marketing, web and ongoing optimisation.</p>
              </div>
              <div className="rounded-4xl border border-white/10 bg-[#0a1e0a] p-8 text-white/80">
                <p className="text-sm uppercase tracking-[0.32em] text-[#f7e7a6]">Support</p>
                <p className="mt-4 text-base">Expert care through launches, updates and performance reviews.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#08140d] py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-10 shadow-xl shadow-[#0000002d] md:p-14">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-5">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">News & insights</p>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">Get great content, tips and news straight to your inbox.</h2>
                <p className="max-w-xl text-white/70 leading-8">Every month, we send the inside scoop on the digital landscape so you stay ahead of the competition.</p>
              </div>
              <form className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <input type="email" placeholder="Your email address" className="min-w-0 rounded-full border border-white/10 bg-[#0a1e0a] px-5 py-4 text-white outline-none placeholder:text-white/40" />
                <button type="submit" className="rounded-full bg-[#f7e7a6] px-8 py-4 text-sm font-semibold text-[#0a1e0a] transition hover:bg-white">Sign up</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
          <div className="rounded-4xl border border-white/10 bg-[#08140d] p-10 text-white shadow-2xl shadow-[#0000002d] md:p-14">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-center">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">Talk to us about your project</p>
                <h2 className="text-3xl font-semibold sm:text-4xl">Start your next digital chapter with Evrybady.</h2>
                <p className="max-w-2xl text-white/70 leading-8">Book a consultation to discuss websites, marketing, branding or ongoing support that helps your business grow.</p>
              </div>
              <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0a1e0a] p-8">
                <a href="mailto:hello@evrybady.digital" className="block rounded-full bg-[#f7e7a6] px-6 py-4 text-center text-sm font-semibold text-[#0a1e0a]">Email us</a>
                <div className="rounded-3xl bg-[#ffffff0d] p-5 text-sm text-white/75">
                  <p className="font-medium text-white">Phone</p>
                  <p className="mt-2">01604 59 89 99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0a1e0a] py-10 text-[#f7e7a6]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
          <div className="space-y-4">
            <p className="font-semibold uppercase tracking-[0.32em] text-sm text-[#f7e7a6]">About</p>
            <p className="max-w-xl text-sm text-white/70">A creative digital agency built for brands that want bold ideas and measurable results.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-sm text-white">Services</p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><a href="/services" className="hover:text-white">Creative</a></li>
                <li><a href="/services" className="hover:text-white">Marketing</a></li>
                <li><a href="/services" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Company</p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><a href="/work" className="hover:text-white">Clients & Work</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/articles" className="hover:text-white">News & insights</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Social</p>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><a href="https://www.instagram.com/zincdigital/" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a></li>
                <li><a href="https://www.linkedin.com/company/zinc-digital-business-solutions-ltd/" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/50">© {new Date().getFullYear()} Evrybady Digital Creative Marketing Ltd.</div>
      </footer>
    </main>
  );
}
