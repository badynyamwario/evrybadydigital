'use client';

import { useState, useEffect, useCallback } from 'react';

const links = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
  { label: 'Articles', href: '/articles' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
          scrolled ? 'border-white/10 bg-[#0a1e0a]/95 backdrop-blur-lg' : 'border-transparent bg-[#0a1e0a]/80 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/LOGO.png" alt="EvryBady logo" className="h-9 w-auto rounded-md object-contain" />
            <span className="font-semibold tracking-[0.18em] text-[#f7e7a6]">EVRYBADY</span>
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 text-sm text-white/80 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-white">
                {l.label}
              </a>
            ))}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/10 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={close}
      />

      {/* Mobile drawer panel */}
      <div
        className={`fixed right-0 top-0 z-[56] flex h-full w-64 flex-col bg-[#0a1e0a] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pt-16 px-6 pb-8 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className="rounded-lg px-4 py-3 text-base font-medium text-white/85 transition hover:bg-white/8 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <a
              href="/contact"
              onClick={close}
              className="block rounded-lg bg-[#f7e7a6] px-4 py-3 text-center text-sm font-semibold text-[#0a1e0a] transition hover:bg-white"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
