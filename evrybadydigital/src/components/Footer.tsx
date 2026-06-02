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
  const brand = String(meta.brand_blurb ?? footer?.title ?? 'EvryBady — digital branding & marketing');
  const address = String(meta.address ?? '');
  const lat = Number(meta.lat) || 52.2405; // fallback coords
  const lon = Number(meta.lon) || -0.9027;

  // Resolve links: support structured array or legacy comma string
  let rawLinks: Array<{ label: string; href: string }> = [];
  if (Array.isArray(meta.links)) {
    rawLinks = (meta.links as Array<{ label: string; href: string }>).map((l) => ({ label: String(l.label ?? ''), href: String(l.href ?? '#') }));
  } else if (typeof meta.links === 'string' && meta.links.trim()) {
    rawLinks = (meta.links as string).split(',').map((l) => {
      const parts = l.split('|').map((p) => p.trim());
      return { label: parts[0] ?? l, href: parts[1] ?? '#' };
    });
  } else {
    rawLinks = [
      { label: 'Home', href: '/' },
      { label: 'Work', href: '/work' },
      { label: 'Services', href: '/services' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ];
  }

  // Deduplicate by href, keep first occurrence
  const seen = new Set<string>();
  const links = rawLinks.filter((l) => {
    if (!l.href) return false;
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });

  // Theme styles: support hex colors in metadata
  const themeBg = typeof meta.theme_bg === 'string' ? meta.theme_bg : '';
  const themeText = typeof meta.theme_text === 'string' ? meta.theme_text : '';
  const accent = typeof meta.accent_color === 'string' ? meta.accent_color : '';
  const style: React.CSSProperties = {};
  if (themeBg && /^#|rgb\(|rgba\(/i.test(themeBg)) style.backgroundColor = themeBg;
  if (themeText && /^#|rgb\(|rgba\(/i.test(themeText)) style.color = themeText;

  return (
    <footer className="mt-8 border-t border-white/6 bg-linear-to-t from-transparent to-black/10 text-white/90" style={style}>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-white/70 max-w-sm">{brand}</p>
            {address ? <p className="text-sm text-white/60">{address}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-1">
            <div>
              <h4 className="text-sm font-semibold">Navigation</h4>
              <ul className="mt-2 space-y-2 text-sm" style={{ color: themeText || undefined }}>
                {links.map((link) => (
                  <li key={link.href}><a className="transition" style={{ color: themeText || undefined }} href={link.href}><span style={{ color: accent || undefined }}>{link.label}</span></a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Contact</h4>
              <p className="mt-2 text-sm text-white/70">hello@evrybady.digital</p>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/8 bg-white/3 p-1">
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
