'use client';

import { useEffect, useState } from 'react';
import { fetchSections, SectionRecord } from '@/services/sectionService';

export default function Footer() {
  const [footer, setFooter] = useState<SectionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchSections('global')
      .then((data) => {
        if (!active) return;
        const f = data.find((s) => s.section_key === 'footer') ?? null;
        setFooter(f as SectionRecord | null);
      })
      .catch(() => setFooter(null))
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  const meta = footer?.metadata ?? {};
  const brand = (meta.brand_blurb as string) || footer?.title || 'EvryBady — digital branding & marketing';
  const address = (meta.address as string) || '';
  const lat = Number(meta.lat) || 52.2405; // fallback coords
  const lon = Number(meta.lon) || -0.9027;
  const linksRaw = (meta.links as string) || '';

  const links = linksRaw
    ? linksRaw.split(',').map((l: string) => {
        const parts = l.split('|').map((p) => p.trim());
        return { label: parts[0] ?? l, href: parts[1] ?? '#' };
      })
    : [
        { label: 'Home', href: '/' },
        { label: 'Work', href: '/work' },
        { label: 'Services', href: '/services' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ];

  return (
    <footer className="mt-16 border-t border-white/6 bg-linear-to-t from-transparent to-black/10 text-white/90">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-white/70 max-w-sm">{brand}</p>
            {address ? <p className="text-sm text-white/60">{address}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-1">
            <div>
              <h4 className="text-sm font-semibold">Navigation</h4>
              <ul className="mt-2 space-y-2 text-sm text-white/70">
                {links.map((link) => (
                  <li key={link.href}><a className="transition hover:text-white" href={link.href}>{link.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Contact</h4>
              <p className="mt-2 text-sm text-white/70">hello@evrybady.digital</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/8 bg-white/3 p-1">
            <iframe
              title="Location map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.02}%2C${lat-0.01}%2C${lon+0.02}%2C${lat+0.01}&layer=mapnik&marker=${lat}%2C${lon}`}
              className="w-full h-40"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
