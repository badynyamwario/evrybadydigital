'use client';

import { useEffect, useRef, useState } from "react";
import { fetchSections, SectionRecord } from "@/services/sectionService";

const fallbackSections: Record<string, SectionRecord[]> = {
  home: [
    {
      id: "home-hero",
      page_slug: "home",
      section_key: "hero",
      title: "We turn professional brands into bold, growth-ready digital experiences.",
      subtitle: "EvryBady Digital Ltd. helps service businesses build visibility, attract new clients, and monetise online with strategy-led branding, content and campaigns.",
      content: "We work with professionals who want a strong online presence, clear messaging, and a website that converts.",
      cta_text: "Explore our work",
      cta_url: "/work",
      metadata: { highlight: "Digital marketing & branding" },
      position: 0,
    },
    {
      id: "home-core-services",
      page_slug: "home",
      section_key: "features",
      title: "Full-service digital support for ambitious businesses",
      subtitle: "From branding to lead generation and online reputation, we build the systems that keep your brand moving forward.",
      content: "Websites, SEO, social media, content creation and paid advertising — designed for service providers and professional teams.",
      position: 1,
    },
    {
      id: "home-objectives",
      page_slug: "home",
      section_key: "objectives",
      title: "Calculated growth, not guesswork",
      subtitle: "We pair creative storytelling with measurable outcomes so your investment delivers into a strong foundation for the future.",
      content: "Our approach is rooted in brand clarity, consistent messaging, and high-converting digital experiences.",
      position: 2,
    },
  ],
  about: [
    {
      id: "about-hero",
      page_slug: "about",
      section_key: "hero",
      title: "A diaspora-owned agency for modern professional services.",
      subtitle: "Built to help service businesses stand out online, acquire clients, and grow revenue with clarity and confidence.",
      position: 0,
    },
    {
      id: "about-mission",
      page_slug: "about",
      section_key: "mission",
      title: "Our mission",
      subtitle: "To help professional businesses build trust, attract clients, and grow revenue through innovative digital branding and marketing solutions.",
      position: 1,
    },
    {
      id: "about-vision",
      page_slug: "about",
      section_key: "vision",
      title: "Our vision",
      subtitle: "To become one of the leading diaspora-owned digital marketing agencies in the UK serving professional service industries.",
      position: 2,
    },
  ],
  services: [
    {
      id: "services-hero",
      page_slug: "services",
      section_key: "hero",
      title: "Services built for serious service brands.",
      subtitle: "Branding, digital marketing and content services that support modern businesses from launch to long-term growth.",
      position: 0,
    },
    {
      id: "services-branding",
      page_slug: "services",
      section_key: "branding",
      title: "Branding services",
      subtitle: "Logo design, identity systems, brand strategy, corporate profile design and digital assets.",
      position: 1,
    },
    {
      id: "services-marketing",
      page_slug: "services",
      section_key: "marketing",
      title: "Digital marketing",
      subtitle: "Social management, SEO, PPC, content creation and paid campaigns focused on measurable results.",
      position: 2,
    },
    {
      id: "services-content",
      page_slug: "services",
      section_key: "content",
      title: "Content creation",
      subtitle: "Video, copywriting, reels, blog content and social campaigns designed to convert and engage.",
      position: 3,
    },
  ],
  work: [
    {
      id: "work-hero",
      page_slug: "work",
      section_key: "hero",
      title: "Work that helps service brands win trust and attention.",
      subtitle: "Case studies, digital launches and campaigns that boost visibility and build stronger client relationships.",
      position: 0,
    },
    {
      id: "work-case-study-1",
      page_slug: "work",
      section_key: "case-study-1",
      title: "Ronald Onyango & Co.",
      subtitle: "Working on close patnership with a top leading law firm to build a strong online presence and generate new leads.",
      position: 1,
    },
    {
      id: "work-case-study-2",
      page_slug: "work",
      section_key: "case-study-2",
      title: " Espeezy Apps Ltd. ",
      subtitle: "Partneship with one of the fastest growing software companies to create a powerful digital presence.",
      position: 2,
    },
  ],
  contact: [
    {
      id: "contact-hero",
      page_slug: "contact",
      section_key: "hero",
      title: "Talk to us about your business.",
      subtitle: "Book a consultation for website, branding, marketing and content support tailored to service businesses.",
      position: 0,
    },
    {
      id: "contact-details",
      page_slug: "contact",
      section_key: "details",
      title: "Contact details",
      subtitle: "Email hello@evrybady.digital or call 01604 59 89 99 to start your next project.",
      position: 1,
    },
  ],
};

export function useSections(pageSlug: string) {
  const [sections, setSections] = useState<SectionRecord[]>(
    fallbackSections[pageSlug] ?? fallbackSections.home
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    fetchSections(pageSlug)
      .then((data) => {
        if (requestIdRef.current !== requestId) return;
        if (data.length > 0) {
          setSections(data);
        }
        setError(null);
      })
      .catch((fetchError) => {
        if (requestIdRef.current !== requestId) return;
        setError(fetchError.message ?? "Unable to load page content.");
      })
      .finally(() => {
        if (requestIdRef.current === requestId) {
          setLoading(false);
        }
      });

    return () => {
      // Incrementing requestIdRef in the next effect run handles cancellation;
      // no explicit cleanup needed here.
    };
  }, [pageSlug]);

  return { sections, loading, error };
}

