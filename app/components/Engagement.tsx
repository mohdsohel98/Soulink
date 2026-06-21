"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Briefcase, Cake, Coffee, Gem, Gift, Heart,
  Palette, PartyPopper, Plane, RefreshCw, Sparkles, Users, Wand2,
} from "lucide-react";
import { useRef, useState } from "react";

const spring = { type: "spring" as const, stiffness: 220, damping: 26 };
const ease = [0.22, 1, 0.36, 1] as const;

/* =========================================================================
 * Tilt card (depth on hover) — used for gift-discovery cards
 * ====================================================================== */
export function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setT({ rx: -py * 10, ry: px * 12 });
      }}
      onMouseLeave={() => setT({ rx: 0, ry: 0 })}
      style={{ transform: `perspective(800px) rotateX(${t.rx}deg) rotateY(${t.ry}deg)`, transformStyle: "preserve-3d", transition: "transform .25s ease" }}
      className={className}
    >
      {children}
    </div>
  );
}

/* =========================================================================
 * 1. Gift Personality Quiz
 * ====================================================================== */
const QUESTIONS = [
  { q: "The gift you love to give is…", opts: [["Handmade & deeply personal", "a"], ["Surprising & playful", "b"], ["Refined & considered", "c"]] },
  { q: "You discover gifts best through…", opts: [["A creator's story", "a"], ["A lucky stumble", "b"], ["Curated collections", "c"]] },
  { q: "The perfect gift makes them feel…", opts: [["Truly seen", "a"], ["Delighted", "b"], ["Cared for", "c"]] },
] as const;

const STYLES: Record<string, { name: string; blurb: string; cats: string[]; Icon: typeof Heart }> = {
  a: { name: "The Sentimentalist", blurb: "You gift meaning. Stories and personalization move you most.", cats: ["Keepsakes", "Personalized jewelry", "Custom art"], Icon: Heart },
  b: { name: "The Surpriser", blurb: "You gift joy. The unexpected and the delightful are your language.", cats: ["Mystery boxes", "Experiences", "Quirky finds"], Icon: Sparkles },
  c: { name: "The Curator", blurb: "You gift taste. Quality and intention define every choice.", cats: ["Artisan craft", "Premium home", "Considered design"], Icon: Gem },
};

function Quiz() {
  const [step, setStep] = useState(0);
  const [tally, setTally] = useState<Record<string, number>>({ a: 0, b: 0, c: 0 });
  const done = step >= QUESTIONS.length;
  const result = done ? Object.entries(tally).sort((x, y) => y[1] - x[1])[0][0] : null;
  const R = result ? STYLES[result] : null;

  return (
    <div className="min-h-[290px]">
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease }}>
            <div className="mb-5 flex gap-1.5">
              {QUESTIONS.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-gold" : "bg-ivory/15"}`} />)}
            </div>
            <h4 className="display text-xl font-semibold text-ivory">{QUESTIONS[step].q}</h4>
            <div className="mt-5 space-y-3">
              {QUESTIONS[step].opts.map(([label, key]) => (
                <button
                  key={label}
                  onClick={() => { setTally((t) => ({ ...t, [key]: t[key] + 1 })); setStep((s) => s + 1); }}
                  className="delight group flex w-full items-center justify-between rounded-xl border border-ivory/10 bg-ivory/5 px-5 py-3.5 text-left text-sm font-medium text-ivory transition hover:border-gold/50 hover:bg-gold/10"
                >
                  {label}
                  <ArrowRight size={16} className="text-gold opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="res" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={spring} className="text-center">
            <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ ...spring, delay: 0.1 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light to-rose text-night">
              {R && <R.Icon size={28} />}
            </motion.div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[.2em] text-gold">Your gifting style</p>
            <h4 className="display mt-1 text-2xl font-semibold text-ivory">{R?.name}</h4>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{R?.blurb}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {R?.cats.map((c) => <span key={c} className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-light">{c}</span>)}
            </div>
            <button onClick={() => { setStep(0); setTally({ a: 0, b: 0, c: 0 }); }} className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-muted transition hover:text-ivory">
              <RefreshCw size={13} /> Retake
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================
 * 2. Surprise Gift Generator (spin wheel)
 * ====================================================================== */
const SEGMENTS = ["Keepsake", "Jewelry", "Custom Art", "Care Box", "Tech Gift", "Sweet Treats", "Candle", "Experience"];

function Wheel() {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const seg = 360 / SEGMENTS.length;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const idx = (Math.random() * SEGMENTS.length) | 0;
    const target = 360 * 5 + (360 - (idx * seg + seg / 2));
    const next = rot - (rot % 360) + target;
    setRot(next);
    setTimeout(() => { setResult(SEGMENTS[idx]); setSpinning(false); }, 4200);
  };

  const stops = SEGMENTS.map((_, i) => {
    const c = i % 2 ? "rgba(232,120,138,.35)" : "rgba(232,185,100,.35)";
    return `${c} ${i * seg}deg ${(i + 1) * seg}deg`;
  }).join(", ");

  return (
    <div className="flex min-h-[290px] flex-col items-center justify-center">
      <div className="relative h-56 w-56">
        <div className="absolute -top-1 left-1/2 z-20 -translate-x-1/2" style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "18px solid #f3d49a" }} />
        <div
          className="h-full w-full rounded-full border-4 border-gold/40"
          style={{ background: `conic-gradient(${stops})`, transform: `rotate(${rot}deg)`, transition: "transform 4.1s cubic-bezier(.17,.67,.16,1)", boxShadow: "0 0 50px rgba(232,185,100,.25), inset 0 0 40px rgba(0,0,0,.5)" }}
        >
          {SEGMENTS.map((s, i) => (
            <span key={s} className="absolute left-1/2 top-1/2 origin-left text-[10px] font-bold text-ivory" style={{ transform: `rotate(${i * seg + seg / 2}deg) translateX(34px)` }}>{s}</span>
          ))}
        </div>
        <button onClick={spin} disabled={spinning} className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-rose text-night shadow-lg transition active:scale-95 disabled:opacity-70">
          <Gift size={24} />
        </button>
      </div>
      <div className="mt-5 h-10 text-center">
        <AnimatePresence>
          {result && (
            <motion.p initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={spring} className="text-sm text-muted">
              Your surprise: <span className="display text-lg font-semibold text-gradient">{result}</span>
            </motion.p>
          )}
        </AnimatePresence>
        {!result && <p className="text-xs font-semibold text-muted">{spinning ? "Spinning…" : "Spin for a gift idea"}</p>}
      </div>
    </div>
  );
}

/* =========================================================================
 * 3. Gift Match (by recipient)
 * ====================================================================== */
const RECIPIENTS = [
  { who: "Friend", Icon: Users, cats: ["Quirky keepsakes", "Shared experiences", "Inside-joke prints"] },
  { who: "Mother", Icon: Heart, cats: ["Personalized jewelry", "Artisan candles", "Memory books"] },
  { who: "Father", Icon: Briefcase, cats: ["Handcrafted leather", "Premium coffee", "Engraved tools"] },
  { who: "Partner", Icon: Gem, cats: ["Custom jewelry", "Romantic getaways", "Story keepsakes"] },
  { who: "Colleague", Icon: Coffee, cats: ["Desk craft", "Gourmet boxes", "Thoughtful stationery"] },
];

function GiftMatch() {
  const [sel, setSel] = useState(0);
  const R = RECIPIENTS[sel];
  return (
    <div className="min-h-[290px]">
      <p className="text-sm font-semibold text-muted">Who are you gifting?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {RECIPIENTS.map((r, i) => (
          <button key={r.who} onClick={() => setSel(i)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${i === sel ? "bg-gradient-to-r from-gold-light to-rose text-night" : "border border-ivory/15 bg-ivory/5 text-ivory hover:border-gold/40"}`}>
            <r.Icon size={15} /> {r.who}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, ease }} className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">Recommended for {R.who.toLowerCase()}</p>
          <div className="mt-3 grid gap-3">
            {R.cats.map((c, i) => (
              <motion.div key={c} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="delight flex items-center gap-3 rounded-xl border border-ivory/10 bg-ivory/5 px-4 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15 text-gold"><Gift size={15} /></span>
                <span className="text-sm font-medium text-ivory">{c}</span>
                <ArrowRight size={15} className="ml-auto text-muted" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================
 * 4. Occasion Explorer
 * ====================================================================== */
const OCCASIONS = [
  { name: "Birthdays", Icon: Cake, tags: ["Personalized prints", "Cake & treats", "Surprise boxes"], img: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80" },
  { name: "Anniversaries", Icon: Heart, tags: ["Custom jewelry", "Memory books", "Couple keepsakes"], img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80" },
  { name: "Weddings", Icon: Gem, tags: ["Engraved gifts", "Artisan decor", "Registry picks"], img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80" },
  { name: "Festivals", Icon: PartyPopper, tags: ["Hampers", "Handmade decor", "Sweet boxes"], img: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=900&q=80" },
];

function Occasions() {
  const [sel, setSel] = useState(0);
  const O = OCCASIONS[sel];
  return (
    <div className="min-h-[290px]">
      <div className="flex flex-wrap gap-2">
        {OCCASIONS.map((o, i) => (
          <button key={o.name} onClick={() => setSel(i)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${i === sel ? "bg-gradient-to-r from-gold-light to-rose text-night" : "border border-ivory/15 bg-ivory/5 text-ivory hover:border-gold/40"}`}>
            <o.Icon size={15} /> {o.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={sel} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, ease }} className="relative mt-5 h-44 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 photo" style={{ backgroundImage: `url(${O.img})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />
          <div className="media-overlay absolute bottom-0 p-5">
            <h4 className="display text-xl font-semibold text-ivory">{O.name}</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {O.tags.map((t) => <span key={t} className="rounded-full bg-ivory/15 px-2.5 py-1 text-[11px] font-semibold text-ivory backdrop-blur">{t}</span>)}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =========================================================================
 * Playground shell (tabbed)
 * ====================================================================== */
const TABS = [
  { key: "quiz", label: "Personality Quiz", Icon: Wand2, node: <Quiz /> },
  { key: "wheel", label: "Surprise Generator", Icon: Sparkles, node: <Wheel /> },
  { key: "match", label: "Gift Match", Icon: Heart, node: <GiftMatch /> },
  { key: "occasion", label: "Occasion Explorer", Icon: PartyPopper, node: <Occasions /> },
];

export function GiftPlayground() {
  const [tab, setTab] = useState(0);
  return (
    <div className="mt-14 grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {TABS.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setTab(i)}
            className={`group flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-4 text-left transition ${i === tab ? "border-gold/50 bg-gold/10" : "border-ivory/10 bg-ivory/5 hover:border-ivory/25"}`}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${i === tab ? "bg-gradient-to-br from-gold-light to-rose text-night" : "bg-ivory/10 text-gold"}`}>
              <t.Icon size={18} />
            </span>
            <span className={`text-sm font-bold ${i === tab ? "text-ivory" : "text-muted"}`}>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="glass rounded-3xl p-7 md:p-9">{TABS[tab].node}</div>
    </div>
  );
}

/* =========================================================================
 * Gift Journey — cinematic storytelling
 * ====================================================================== */
const JOURNEY = [
  { t: "Choose a gift", d: "Browse, search, or discover through a creator's reel.", Icon: Gift },
  { t: "Personalize it", d: "Make every detail uniquely theirs.", Icon: Wand2 },
  { t: "Creator crafts", d: "A real maker brings your gift to life with care.", Icon: Palette },
  { t: "Delivered", d: "Tracked, protected, and beautifully presented.", Icon: Plane },
  { t: "Memory created", d: "A gift that stays long after it arrives.", Icon: Heart },
];

export function GiftJourney() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const grow = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative mt-16">
      {/* connecting ribbon */}
      <div className="absolute left-[27px] top-4 bottom-4 w-[3px] rounded-full bg-ivory/10 lg:left-0 lg:right-0 lg:top-7 lg:bottom-auto lg:h-[3px] lg:w-full">
        <motion.div className="h-full w-full origin-top rounded-full bg-gradient-to-b from-gold to-rose lg:origin-left lg:bg-gradient-to-r" style={{ scaleY: grow, scaleX: grow }} />
      </div>
      <div className="relative grid gap-10 lg:grid-cols-5 lg:gap-4">
        {JOURNEY.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease }}
            className="relative flex items-center gap-5 lg:flex-col lg:text-center"
          >
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-night-2 text-gold shadow-[0_0_30px_rgba(232,185,100,.25)]">
              <s.Icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Step {i + 1}</p>
              <h4 className="display mt-1 text-lg font-semibold text-ivory">{s.t}</h4>
              <p className="mt-1 text-sm leading-6 text-muted lg:px-2">{s.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
