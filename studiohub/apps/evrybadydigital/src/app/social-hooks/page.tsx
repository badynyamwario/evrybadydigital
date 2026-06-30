'use client';

import { useState, useMemo, useCallback } from 'react';
import { useSections } from '@/hooks/useSections';
import type { SocialPlatform, HookAngle, HookFormData, HookResult } from '@/types';

const platformInfo: Record<SocialPlatform, {
  label: string;
  description: string;
  charLimit: number;
  optimal: string;
  placeholder: string;
}> = {
  instagram: {
    label: 'Instagram',
    description: 'Visual-first. Short, punchy hooks with emojis that stop the scroll.',
    charLimit: 2200,
    optimal: '1–2 lines (under 150 chars)',
    placeholder: 'e.g. sustainable fashion, morning routines',
  },
  linkedin: {
    label: 'LinkedIn',
    description: 'Professional storytelling. Hook with authority, insight, or a bold claim.',
    charLimit: 3000,
    optimal: '1–3 lines with a strong opener',
    placeholder: 'e.g. B2B lead generation, leadership habits',
  },
  twitter: {
    label: 'X / Twitter',
    description: 'Speed and wit. Every character earns attention — make it count.',
    charLimit: 280,
    optimal: 'Under 100 chars, punchy',
    placeholder: 'e.g. AI tools, productivity hacks',
  },
  tiktok: {
    label: 'TikTok',
    description: 'Trend-driven. Hook in the first 2 seconds with curiosity or conflict.',
    charLimit: 2200,
    optimal: 'Short, urgent, scroll-stopping',
    placeholder: 'e.g. skincare routines, life hacks',
  },
  facebook: {
    label: 'Facebook',
    description: 'Community-focused. Relatable, conversational hooks that spark discussion.',
    charLimit: 63206,
    optimal: '2–4 lines, question or story-led',
    placeholder: 'e.g. local business tips, parenting advice',
  },
};

const angleInfo: Record<HookAngle, { label: string; description: string }> = {
  professional: { label: 'Professional', description: 'Authoritative and polished' },
  casual: { label: 'Casual', description: 'Conversational and relatable' },
  humorous: { label: 'Humorous', description: 'Funny, witty, or playful' },
  inspirational: { label: 'Inspirational', description: 'Uplifting and motivational' },
  educational: { label: 'Educational', description: 'Informative and value-driven' },
  controversial: { label: 'Controversial', description: 'Bold opinion that sparks debate' },
};

const hookTemplates: Record<SocialPlatform, Record<HookAngle, string[]>> = {
  instagram: {
    professional: [
      'Stop scrolling if {topic} is costing your business money.',
      'The #1 mistake brands make with {topic} (and how to fix it).',
      'If you\'re serious about {topic}, start here.',
    ],
    casual: [
      'Real talk: {topic} is harder than it looks. Here\'s what actually works.',
      'Hot take on {topic} — you might disagree, but hear me out.',
      'Me trying to figure out {topic} be like…',
    ],
    humorous: [
      'My {topic} game was so bad my mum noticed. Time to fix it.',
      'Who else pretends they have {topic} figured out? Just me? Okay.',
      '{topic} explained by someone who definitely doesn\'t have it all together.',
    ],
    inspirational: [
      'Your {topic} breakthrough starts with one brave decision. Today could be that day.',
      'Every {topic} expert started exactly where you are right now.',
      'What if {topic} wasn\'t a struggle but your superpower?',
    ],
    educational: [
      '3 things nobody tells you about {topic} (but should).',
      'Stop guessing with {topic}. Here\'s a simple framework that works.',
      'Breaking down {topic} so even your grandma would get it.',
    ],
    controversial: [
      'Unpopular opinion: most {topic} advice is keeping you average.',
      'I said what I said about {topic} — come at me.',
      'Hot take: {topic} is overcomplicating what should be simple.',
    ],
  },
  linkedin: {
    professional: [
      'For years I approached {topic} the wrong way. Here\'s what changed everything.',
      'Most executives get {topic} wrong. Here\'s the playbook.',
      'If you work in {topic}, this post will save you months of trial and error.',
    ],
    casual: [
      'I used to think {topic} was simple. Then I learned the hard way.',
      'Let\'s talk about {topic} — the thing nobody mentions in meetings.',
      'What I wish someone told me about {topic} before I started.',
    ],
    humorous: [
      'Me 5 years ago thinking I knew everything about {topic}. Oh sweet summer child.',
      '{topic} is like assembling IKEA furniture without the instructions.',
      'My journey from {topic} zero to barely competent — in one post.',
    ],
    inspirational: [
      'The ceiling you feel in {topic}? It\'s self-imposed. Break it.',
      'How I turned {topic} from my biggest weakness into my greatest asset.',
      'If you\'re struggling with {topic}, remember: every expert was once a beginner.',
    ],
    educational: [
      '10,000 hours into {topic} and here are the patterns I wish I knew first.',
      'A practical guide to {topic} that actually delivers results.',
      'Don\'t start {topic} without understanding these 5 principles first.',
    ],
    controversial: [
      'I\'m going to say what nobody in {topic} wants to hear.',
      'The {topic} industry is stuck in 2015. Here\'s the truth.',
      'Why I believe most {topic} certifications are a waste of money.',
    ],
  },
  twitter: {
    professional: [
      '{topic} insight of the day:',
      'Your {topic} strategy is only as good as your fundamentals.',
      'Stop overcomplicating {topic}. Focus on what moves the needle.',
    ],
    casual: [
      'me: I should really research {topic} properly',
      'we don\'t gatekeep {topic} in this house so here\'s the truth:',
      'hot take about {topic} incoming:',
    ],
    humorous: [
      'someone: talk to me about {topic}',
      'my brain while trying to explain {topic}:',
      '{topic} is fine. I\'m fine. Everything is fine.',
    ],
    inspirational: [
      'Day 1 of taking {topic} seriously.',
      'Your relationship with {topic} determines your success.',
      'Small daily progress in {topic} beats sporadic bursts of effort.',
    ],
    educational: [
      'Thread: everything I learned from years in {topic}.',
      'A {topic} framework I built that consistently delivers results:',
      '3 lessons from {topic} that apply to almost everything in life:',
    ],
    controversial: [
      'Hot take: {topic} doesn\'t need to be as complicated as people make it.',
      'Unpopular opinion in the {topic} space:',
      'I don\'t care if this upsets people — {topic} truth:',
    ],
  },
  tiktok: {
    professional: [
      'Stop doing {topic} until you watch this.',
      'The {topic} secret nobody\'s talking about.',
      'This one {topic} tip changed everything for me.',
    ],
    casual: [
      'POV: you just discovered the secret to {topic}',
      'Tell me you do {topic} without telling me you do {topic}.',
      'It\'s giving {topic} energy and I\'m here for it.',
    ],
    humorous: [
      'My toxic trait is thinking I know {topic}.',
      'Watch me gaslight myself into believing I understand {topic}.',
      '{topic} be like: *exists* me: I can fix it.',
    ],
    inspirational: [
      'This is your sign to stop overthinking {topic} and just start.',
      'Who gave you permission to be this good at {topic}?',
      'Your {topic} era starts now.',
    ],
    educational: [
      'The science of {topic} explained in 60 seconds.',
      'Here\'s how {topic} actually works (not the fake version).',
      'Step-by-step: {topic} for anyone who\'s overwhelmed.',
    ],
    controversial: [
      'I\'m about to get cancelled for this {topic} take but:',
      'Why is nobody talking about how broken {topic} is?',
      'This {topic} opinion will make some of you angry. Good.',
    ],
  },
  facebook: {
    professional: [
      'If you\'re a business owner overlooking {topic}, you\'re leaving money on the table.',
      'The truth about {topic} that most agencies won\'t tell you.',
      'Here\'s what 10+ years in {topic} has taught me about what really works.',
    ],
    casual: [
      'Can we talk about {topic} for a minute?',
      'Real question: has anyone actually figured out {topic} or are we all winging it?',
      'So I tried {topic} and here\'s what happened…',
    ],
    humorous: [
      'Facebook memories are just there to remind me how bad I was at {topic}.',
      '{topic} in theory vs {topic} in practice — there\'s a gap.',
      'My journey with {topic} has been a rollercoaster. In the dark. On fire.',
    ],
    inspirational: [
      'Your story with {topic} is not over yet. Keep going.',
      'Every setback in {topic} is just a plot twist waiting to happen.',
      'If you\'re here wondering if {topic} is for you — yes, it is.',
    ],
    educational: [
      'A complete beginner\'s guide to {topic} — no jargon, I promise.',
      'Everything you need to know about {topic} in one post.',
      'I tried every {topic} method so you don\'t have to. Here are the winners.',
    ],
    controversial: [
      'I unfollowed the gurus. Here\'s my honest take on {topic}.',
      'The {topic} advice you\'re getting is outdated. Let me prove it.',
      'Yes, I have strong opinions about {topic}. No, I won\'t apologise.',
    ],
  },
};

function generateHooks(data: HookFormData): HookResult[] {
  const platform = data.platform;
  const angle = data.angle;
  if (!platform || !angle || !data.topic.trim()) return [];

  const templates = hookTemplates[platform]?.[angle];
  if (!templates) return [];

  const audienceSnippet = data.audience.trim()
    ? ` (for ${data.audience.trim()})`
    : '';
  const keywordSnippet = data.keywords.trim()
    ? ` #${data.keywords.trim().split(/[\s,]+/).join(' #')}`
    : '';

  return templates.map((template) => {
    let hook = template
      .replace(/\{topic\}/g, data.topic.trim())
      .replace(/\{audience\}/g, data.audience.trim() || data.topic.trim())
      .replace(/\{keywords\}/g, data.keywords.trim() || data.topic.trim());

    if (audienceSnippet) {
      hook = hook.replace(/[.!?](\s|$)/, (m) => m.replace(/[.!?]/, '') + audienceSnippet + '$1'.trim());
    }

    const withKeywords = keywordSnippet ? hook + keywordSnippet : hook;

    const finalHook = withKeywords
      .replace(/\s+/g, ' ')
      .replace(/\s([.,!?;:])/g, '$1')
      .trim();

    const whys: Record<HookAngle, string> = {
      professional: 'Establishes authority and invites engagement from peers.',
      casual: 'Feels like a conversation, not a broadcast. Relatable and shareable.',
      humorous: 'Entertains first, delivers the message second. High shareability.',
      inspirational: 'Appeals to emotion and aspiration. Encourages saves and shares.',
      educational: 'Positions you as a resource. Drives saves and bookmarks.',
      controversial: 'Polarises audience, drives comments and debate. High reach.',
    };

    return {
      hook: finalHook,
      platform,
      angle,
      why: whys[angle] + ` Optimised for ${platformInfo[platform].label}.`,
    };
  });
}

export default function SocialHooksPage() {
  const { sections } = useSections('social-hooks');
  const [form, setForm] = useState<HookFormData>({
    platform: '',
    topic: '',
    audience: '',
    angle: '',
    keywords: '',
  });
  const [results, setResults] = useState<HookResult[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showAllPlatforms, setShowAllPlatforms] = useState(false);

  const section = sections[0] ?? null;
  const intro = String(section?.metadata?.intro ?? '');
  const platformTips = useMemo(() => {
    if (!section?.metadata) return {};
    const tips: Partial<Record<SocialPlatform, { tip: string; examples: string }>> = {};
    (['instagram', 'linkedin', 'twitter', 'tiktok', 'facebook'] as SocialPlatform[]).forEach((p) => {
      const tip = section?.metadata?.[`${p}_tip`];
      const examples = section?.metadata?.[`${p}_examples`];
      if (tip || examples) {
        tips[p] = { tip: String(tip ?? ''), examples: String(examples ?? '') };
      }
    });
    return tips;
  }, [section]);

  const updateForm = useCallback(<K extends keyof HookFormData>(key: K, value: HookFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'platform') setResults([]); // clear results on platform change
  }, []);

  const handleGenerate = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.platform || !form.topic.trim() || !form.angle) return;
    setResults(generateHooks(form));
  }, [form]);

  const copyHook = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(idx);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
    }
  }, []);

  const platforms = showAllPlatforms
    ? (Object.keys(platformInfo) as SocialPlatform[])
    : (['instagram', 'linkedin', 'twitter', 'tiktok', 'facebook'] as SocialPlatform[]);

  const angles = Object.keys(angleInfo) as HookAngle[];

  const selectedPlatform = form.platform as SocialPlatform | null;
  const selectedAngle = form.angle as HookAngle | null;

  return (
    <main className="min-h-screen bg-surface text-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-surface-alt py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 blur-3xl opacity-80" style={{ background: 'radial-gradient(circle at top right, rgba(255,215,0,0.15), transparent 24%)' }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center sm:px-8">
          <p className="text-sm uppercase tracking-[0.4em] text-brand">Content tools</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Social media hook generator
          </h1>
          <p className="mt-5 text-lg text-white/70 leading-8 max-w-2xl mx-auto">
            {intro || 'Craft scroll-stopping hooks for any social platform. Select your platform, pick a tone, and get ready-to-use hooks that grab attention.'}
          </p>
        </div>
      </section>

      {/* Form + Results */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Form */}
            <div>
              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Platform */}
                <fieldset>
                  <legend className="text-sm font-medium mb-2">Platform *</legend>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Platform">
                    {platforms.map((p) => (
                      <button
                        key={p}
                        type="button"
                        role="radio"
                        aria-checked={form.platform === p}
                        onClick={() => updateForm('platform', form.platform === p ? '' : p)}
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                          form.platform === p
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">{platformInfo[p].label}</span>
                      </button>
                    ))}
                  </div>
                  {!showAllPlatforms && (
                    <button
                      type="button"
                      onClick={() => setShowAllPlatforms(true)}
                      className="mt-2 text-xs text-white/50 hover:text-white/80 transition"
                    >
                      Show all platforms
                    </button>
                  )}
                </fieldset>

                {/* Platform guidance */}
                {selectedPlatform && (
                  <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm text-white/80 space-y-1">
                    <p><span className="font-medium text-brand">{platformInfo[selectedPlatform].label}</span> — {platformInfo[selectedPlatform].description}</p>
                    <p className="text-xs text-white/50">Character limit: ~{platformInfo[selectedPlatform].charLimit.toLocaleString()} · Optimal: {platformInfo[selectedPlatform].optimal}</p>
                    {platformTips[selectedPlatform]?.tip && (
                      <p className="text-xs text-brand/70 mt-2">Tip: {platformTips[selectedPlatform]?.tip}</p>
                    )}
                  </div>
                )}

                {/* Topic */}
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium mb-2">Topic *</label>
                  <input
                    id="topic"
                    value={form.topic}
                    onChange={(e) => updateForm('topic', e.target.value)}
                    placeholder={selectedPlatform ? platformInfo[selectedPlatform].placeholder : 'e.g. social media marketing'}
                    className="w-full rounded-xl border border-white/10 bg-surface-alt px-5 py-4 text-white outline-none focus:border-white/30"
                  />
                </div>

                {/* Audience */}
                <div>
                  <label htmlFor="audience" className="block text-sm font-medium mb-2">Target audience <span className="text-white/40">(optional)</span></label>
                  <input
                    id="audience"
                    value={form.audience}
                    onChange={(e) => updateForm('audience', e.target.value)}
                    placeholder="e.g. small business owners, freelancers"
                    className="w-full rounded-xl border border-white/10 bg-surface-alt px-5 py-4 text-white outline-none focus:border-white/30"
                  />
                </div>

                {/* Hook angle */}
                <fieldset>
                  <legend className="text-sm font-medium mb-2">Hook angle *</legend>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Hook angle">
                    {angles.map((a) => (
                      <button
                        key={a}
                        type="button"
                        role="radio"
                        aria-checked={form.angle === a}
                        onClick={() => updateForm('angle', form.angle === a ? '' : a)}
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                          form.angle === a
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">{angleInfo[a].label}</span>
                        <p className="text-xs text-white/40 mt-0.5">{angleInfo[a].description}</p>
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Keywords */}
                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium mb-2">Keywords <span className="text-white/40">(optional)</span></label>
                  <input
                    id="keywords"
                    value={form.keywords}
                    onChange={(e) => updateForm('keywords', e.target.value)}
                    placeholder="e.g. growth, strategy, tips"
                    className="w-full rounded-xl border border-white/10 bg-surface-alt px-5 py-4 text-white outline-none focus:border-white/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!selectedPlatform || !form.topic.trim() || !selectedAngle}
                  className="inline-flex rounded-full bg-brand px-10 py-4 text-sm font-semibold text-surface transition hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {selectedPlatform && form.topic.trim() && selectedAngle
                    ? `Generate ${selectedPlatform === 'twitter' ? 'tweets' : 'hooks'}`
                    : 'Select platform, topic and angle'}
                </button>
              </form>
            </div>

            {/* Results */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                {results.length > 0
                  ? `Your ${selectedPlatform === 'twitter' ? 'tweets' : 'hooks'}`
                  : 'Preview'}
              </h2>

              {results.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-surface-alt p-8 text-center">
                  <div className="text-4xl mb-4">✍️</div>
                  <p className="text-sm text-white/50">
                    Fill in the form and generate hooks. They&rsquo;ll appear here ready to copy and post.
                  </p>
                </div>
              )}

              {results.length > 0 && (
                <div className="space-y-4">
                  <p className="text-xs text-white/40">
                    Tap a card to copy. Optimised for {platformInfo[form.platform as SocialPlatform].label}.
                  </p>
                  {results.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => copyHook(r.hook, i)}
                      aria-label={`Copy: ${r.hook}`}
                      className={`w-full text-left rounded-2xl border p-5 transition ${
                        copiedId === i
                          ? 'border-brand bg-brand/10'
                          : 'border-white/10 bg-surface hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm leading-7 text-white/90 flex-1">{r.hook}</p>
                        <span className="shrink-0 text-xs text-white/50 mt-1" aria-live="polite">
                          {copiedId === i ? 'Copied!' : 'Copy'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-white/40 leading-5">{r.why}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* CMS platform examples */}
              {selectedPlatform && platformTips[selectedPlatform]?.examples && results.length === 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-surface-alt p-5">
                  <p className="text-xs uppercase tracking-wider text-brand mb-2">Example hooks</p>
                  <div className="text-sm text-white/60 whitespace-pre-line leading-7">
                    {platformTips[selectedPlatform]!.examples}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}