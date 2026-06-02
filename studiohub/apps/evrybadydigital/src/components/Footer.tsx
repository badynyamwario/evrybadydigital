'use client';

import { useEffect, useState } from 'react';
import { fetchSections, SectionRecord } from '@/services/sectionService';

export default function Footer() {
  const [footer, setFooter] = useState<SectionRecord | null>(null);

  useEffect(() => {
    let active = true;
    fetchSections('global')
      .then((data) => {
        if (!active) return;
        const f = data.find((s) => s.section_key === 'footer') ?? null;
        setFooter(f as SectionRecord | null);
      })
      .catch(() => setFooter(null));
    return () => { active = false; };
  }, []);

  const meta = footer?.metadata ?? {};
  const brand = String(meta.brand_blurb ?? footer?.title ?? 'A creative digital agency helping professional service businesses build trust, attract clients, and grow revenue through innovative digital branding and marketing.');
  const address = String(meta.address ?? 'Northampton, United Kingdom');

  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-white/10 bg-[#071209] text-white/90">
      <div className="mx-auto max-w-7xl px-5 pt-10 pb-6 sm:px-6 lg:px-10">
        {/* Top row: brand + link columns */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] md:grid-cols-[1.4fr_1fr_1fr_1fr] sm:grid-cols-2">
          {/* Brand column */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2">
              <img src="/LOGO.png" alt="EvryBady logo" className="h-8 w-auto rounded object-contain" />
              <span className="font-semibold tracking-[0.16em] text-[#f7e7a6] text-sm">EVRYBADY</span>
            </div>
            <p className="text-sm text-white/60 leading-6 max-w-xs">{brand}</p>
            {address && <p className="text-xs text-white/45">{address}</p>}
            <div className="flex items-center gap-3 pt-1">
              <a href="https://www.instagram.com/zincdigital/" target="_blank" rel="noreferrer" className="text-white/50 hover:text-[#f7e7a6] transition" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/zinc-digital-business-solutions-ltd/" target="_blank" rel="noreferrer" className="text-white/50 hover:text-[#f7e7a6] transition" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="font-semibold text-xs uppercase tracking-[0.2em] text-[#f7e7a6] mb-3">Services</p>
            <ul className="space-y-2 text-sm text-white/65">
              <li><a href="/services" className="hover:text-white transition">Websites</a></li>
              <li><a href="/services" className="hover:text-white transition">Brand identity & strategy</a></li>
              <li><a href="/services" className="hover:text-white transition">Social media management</a></li>
              <li><a href="/services" className="hover:text-white transition">SEO & organic search</a></li>
              <li><a href="/services" className="hover:text-white transition">Paid search & PPC</a></li>
              <li><a href="/services" className="hover:text-white transition">Lead generation</a></li>
              <li><a href="/services" className="hover:text-white transition">Creative retainers</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-semibold text-xs uppercase tracking-[0.2em] text-[#f7e7a6] mb-3">Company</p>
            <ul className="space-y-2 text-sm text-white/65">
              <li><a href="/about" className="hover:text-white transition">About us</a></li>
              <li><a href="/work" className="hover:text-white transition">Clients & work</a></li>
              <li><a href="/articles" className="hover:text-white transition">News & insights</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              <li><a href="/services" className="hover:text-white transition">Consultancy</a></li>
              <li><a href="/services" className="hover:text-white transition">Partnerships</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="font-semibold text-xs uppercase tracking-[0.2em] text-[#f7e7a6] mb-3">Resources</p>
            <ul className="space-y-2 text-sm text-white/65">
              <li><a href="/services" className="hover:text-white transition">SEO healthcheck</a></li>
              <li><a href="/services" className="hover:text-white transition">PPC healthcheck</a></li>
              <li><a href="/services" className="hover:text-white transition">Website healthcheck</a></li>
              <li><a href="/services" className="hover:text-white transition">Reputation management</a></li>
              <li><a href="/articles" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-xs uppercase tracking-[0.2em] text-[#f7e7a6] mb-3">Get in touch</p>
            <ul className="space-y-2 text-sm text-white/65">
              <li><a href="mailto:hello@evrybady.digital" className="hover:text-white transition">hello@evrybady.digital</a></li>
              <li><a href="tel:+441604598999" className="hover:text-white transition">01604 59 89 99</a></li>
              <li className="pt-1"><a href="/contact" className="inline-flex rounded-full bg-[#f7e7a6] px-4 py-2 text-xs font-semibold text-[#0a1e0a] transition hover:bg-white">Book a consultation</a></li>
            </ul>
          </div>
        </div>

        {/* Legal links bar */}
        <div className="mt-8 border-t border-white/8 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-white/40">© {year} Evrybady Digital Creative Marketing Ltd. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/45">
            <a href="/terms" className="hover:text-white/70 transition">Terms of Service</a>
            <a href="/privacy" className="hover:text-white/70 transition">Privacy Policy</a>
            <a href="/cookies" className="hover:text-white/70 transition">Cookie Policy</a>
            <a href="/disclaimer" className="hover:text-white/70 transition">Disclaimer</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
