'use client';

import { useSections } from "@/hooks/useSections";

export default function ServicesPage() {
  const { sections, loading, error } = useSections("services");
  const hero = sections.find((section) => section.section_key === "hero");

  return (
    <main className="min-h-screen bg-[#08140d] text-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:px-10">
        {loading && <div className="text-lg text-white/70">Loading services...</div>}
        {error && <div className="text-lg text-rose-400">{error}</div>}

        {hero && (
          <section className="mb-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-[#00000040] sm:p-8">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">What we do</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/70 sm:text-lg">{hero.subtitle}</p>
          </section>
        )}

        <div className="grid gap-5 xl:grid-cols-2">
          {sections
            .filter((section) => section.section_key !== "hero")
            .map((section) => (
              <section
                key={section.id}
                className="rounded-2xl border border-white/10 bg-[#0a1e0a] p-6 shadow-xl shadow-[#00000030]"
              >
                <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                <p className="mt-3 text-white/70 leading-7">{section.subtitle}</p>
              </section>
            ))}
        </div>
      </div>
    </main>
  );
}
