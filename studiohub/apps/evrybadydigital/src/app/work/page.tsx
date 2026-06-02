'use client';

import { useSections } from "@/hooks/useSections";

export default function WorkPage() {
  const { sections, loading, error } = useSections("work");
  const hero = sections.find((section) => section.section_key === "hero");

  return (
    <main className="min-h-screen bg-[#0a1e0a] text-white">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">

        {/* Hero */}
        <section className="flex min-h-[70vh] items-center py-24 lg:py-32">
          <div className="w-full">
            {loading && <div className="text-lg text-white/70">Loading case studies...</div>}
            {error && <div className="text-lg text-rose-400">{error}</div>}

            {hero && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-[#00000040] sm:p-12">
                <p className="text-sm uppercase tracking-[0.4em] text-[#f7e7a6]">Clients & work</p>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {hero.title}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/70">{hero.subtitle}</p>
              </div>
            )}
          </div>
        </section>

        {/* Content sections */}
        <section className="pb-24 lg:pb-32">
          <div className="grid gap-8 xl:grid-cols-2">
            {sections
              .filter((section) => section.section_key !== "hero")
              .map((section) => (
                <article
                  key={section.id}
                  className="rounded-2xl border border-white/10 bg-[#08140d] p-8 shadow-xl shadow-[#00000030]"
                >
                  <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                  <p className="mt-4 text-white/70 leading-8">{section.subtitle}</p>
                </article>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
