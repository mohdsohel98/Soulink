"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, BadgeCheck, BarChart3, Bell, Check, CircleUserRound,
  Compass, Filter, Gift, Grid2X2, Heart, Instagram, Linkedin, Menu,
  Moon, PackageCheck, Play, Plus, Quote, Search, ShieldCheck, ShoppingBag,
  Sparkles, Star, Store, Sun, Upload, WandSparkles, X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GiftJourney, GiftPlayground, TiltCard } from "./components/Engagement";
import GiftBox3D from "./components/GiftBox3D";
import { Logo, LogoMark } from "./components/Logo";
import { Counter, FloatingParticles, Magnetic, Preloader, Reveal, ScrollProgress } from "./components/Premium";
import WaitlistModal from "./components/WaitlistModal";

const ease = [0.22, 1, 0.36, 1] as const;
const imageGift = "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=88";
const imageJewelry = "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=88";
const imageMaker = "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1000&q=88";

function SectionTitle({ eyebrow, title, copy, center = false }: {
  eyebrow: string; title: string; copy?: string; center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="display mt-5 text-4xl font-semibold leading-[1.04] text-ivory md:text-6xl">{title}</h2>
      {copy && <p className="mt-6 text-base leading-7 text-muted md:text-lg">{copy}</p>}
    </Reveal>
  );
}

type Theme = "dark" | "light";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("soulink-theme") as Theme | null;
    const next = saved ?? "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    setReady(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("soulink-theme", next);
    document.documentElement.dataset.theme = next;
  };

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={toggle}
      className="theme-toggle relative flex h-10 w-[72px] items-center rounded-full border border-ivory/15 bg-ivory/5 p-1 text-ivory backdrop-blur-xl"
    >
      <motion.span
        animate={{ x: theme === "dark" ? 0 : 32 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-rose text-night shadow-lg"
      >
        <AnimatePresence mode="wait" initial={false}>
          {ready && theme === "light"
            ? <motion.span key="sun" initial={{ rotate: -90, scale: .5 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: .5 }}><Sun size={15} /></motion.span>
            : <motion.span key="moon" initial={{ rotate: 90, scale: .5 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: .5 }}><Moon size={15} /></motion.span>}
        </AnimatePresence>
      </motion.span>
      <Sun className="ml-auto mr-1 text-gold" size={14} />
    </button>
  );
}

function PhoneFrame({ type }: { type: "reels" | "market" | "seller" }) {
  const products = [imageGift, imageJewelry, imageMaker, imageJewelry, imageGift, imageMaker];
  if (type === "reels") {
    return (
      <div className="relative h-full overflow-hidden rounded-[29px] bg-night">
        <div className="photo absolute inset-0" style={{ backgroundImage: `url(${imageMaker})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/30" />
        <div className="absolute left-4 right-4 top-7 flex items-center justify-between text-ivory">
          <LogoMark size={22} glow={false} /><Search size={15} />
        </div>
        <div className="absolute bottom-16 left-4 right-12 text-ivory">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold"><span className="h-7 w-7 rounded-full bg-rose" />@formandfeeling<BadgeCheck size={12} className="fill-gold text-gold" /></div>
          <p className="display text-base font-semibold">See how your keepsake is crafted and personalized.</p>
          <div className="mt-2 flex gap-1.5"><span className="rounded-full bg-ivory/15 px-2 py-1 text-[8px]">Product demo</span><span className="rounded-full bg-ivory/15 px-2 py-1 text-[8px]">Personalization</span></div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg bg-ivory px-3 py-2 text-[9px] font-bold text-night">Shop this gift <ArrowRight size={12} /></div>
      </div>
    );
  }
  if (type === "market") {
    return (
      <div className="h-full overflow-hidden rounded-[29px] bg-[#fffaf6] p-3 pt-7 text-[#1f1b2d]">
        <div className="flex items-center justify-between"><LogoMark size={21} glow={false} /><Heart size={15} /></div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm"><Search size={12} className="text-[#6b6478]" /><span className="text-[9px] text-[#6b6478]">Search thousands of gifts</span><Filter className="ml-auto" size={11} /></div>
        <div className="mt-3 flex gap-1.5 overflow-hidden">{["Birthday", "For her", "Personalized"].map(x => <span key={x} className="shrink-0 rounded-full bg-[#f7e5e7] px-2 py-1 text-[8px] font-semibold">{x}</span>)}</div>
        <div className="mt-3 flex items-center justify-between"><b className="text-[11px]">Popular gifts</b><Grid2X2 size={12} /></div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {products.map((src, i) => (
            <div key={i} className="rounded-lg bg-white p-1.5 shadow-sm">
              <div className="photo relative h-[68px] rounded-md" style={{ backgroundImage: `url(${src})` }}><Heart className="absolute right-1 top-1 rounded-full bg-white/80 p-1" size={15} /></div>
              <p className="mt-1.5 truncate text-[8px] font-bold">{["Memory Box", "Name Necklace", "Artisan Set"][i % 3]}</p>
              <p className="text-[8px] font-bold text-[#e8788a]">₹{[1299, 1899, 899][i % 3]}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="h-full overflow-hidden rounded-[29px] bg-[#f7f2fa] p-3 pt-7 text-[#1f1b2d]">
      <div className="flex items-center justify-between"><div><p className="text-[8px] text-[#6b6478]">Good morning</p><b className="text-[12px]">Mira Studio</b></div><Bell size={15} /></div>
      <div className="mt-3 rounded-xl bg-gradient-to-br from-[#33183f] to-[#e8788a] p-3 text-white shadow-lg">
        <p className="text-[8px] text-white/70">This month</p><p className="display mt-1 text-xl font-semibold">₹48,240</p>
        <div className="mt-2 flex items-end gap-1">{[35,55,42,78,62,90,74].map((h, i) => <span key={i} className="w-full rounded-t bg-[#f3d49a]" style={{ height: h / 3 }} />)}</div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[["24", "Orders"], ["136", "Products"], ["89%", "Inventory"], ["4.8", "Rating"]].map(([v,l]) => <div key={l} className="rounded-lg bg-white p-2 shadow-sm"><b className="text-[12px]">{v}</b><p className="text-[8px] text-[#6b6478]">{l}</p></div>)}
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm"><Upload size={13} className="text-[#e8788a]" /><span className="text-[9px] font-semibold">Upload product or reel</span><Plus className="ml-auto" size={12} /></div>
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm"><PackageCheck size={13} className="text-[#e8788a]" /><span className="text-[9px] font-semibold">3 orders need attention</span></div>
        <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm"><BarChart3 size={13} className="text-[#e8788a]" /><span className="text-[9px] font-semibold">View store analytics</span></div>
      </div>
    </div>
  );
}

const PHONE_DATA = [
  { type: "reels" as const, title: "Discover Gifts Through Stories", copy: "Creator reels, product demonstrations, and personalization examples make discovery more human." },
  { type: "market" as const, title: "Browse Thousands of Gifts", copy: "Search, categories, filters, wishlists, and rich product grids deliver familiar ecommerce discovery." },
  { type: "seller" as const, title: "Grow Your Store", copy: "Upload products and reels, manage orders and inventory, and understand performance from one dashboard." },
];

function PhoneShowcase() {
  const [active, setActive] = useState(1);
  const reduceMotion = useReducedMotion();
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = mobileTrackRef.current;
    if (!track || window.matchMedia("(min-width: 768px)").matches) return;
    const phone = track.children[1] as HTMLElement | undefined;
    if (!phone) return;
    track.scrollLeft = phone.offsetLeft - (track.clientWidth - phone.offsetWidth) / 2;
  }, []);

  const activateMobile = (index: number) => {
    setActive(index);
    const track = mobileTrackRef.current;
    const phone = track?.children[index] as HTMLElement | undefined;
    if (!track || !phone) return;
    track.scrollTo({
      left: phone.offsetLeft - (track.clientWidth - phone.offsetWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const updateMobileActive = () => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = active;
    let distance = Infinity;
    Array.from(track.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const nextDistance = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });
    if (nearest !== active) setActive(nearest);
  };

  return (
    <div>
      <div
        className="relative left-1/2 hidden h-[570px] w-[calc(100vw-48px)] max-w-[1400px] -translate-x-1/2 grid-cols-3 items-center gap-8 px-8 md:grid lg:gap-16 lg:px-16"
        style={{ perspective: 1400 }}
      >
        <div className="pointer-events-none absolute left-1/2 top-[46%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose/20 blur-[100px]" />
        {PHONE_DATA.map((phone, i) => {
          const left = (active + PHONE_DATA.length - 1) % PHONE_DATA.length;
          const slot = i === active ? 1 : i === left ? 0 : 2;
          const isActive = i === active;
          return (
            <motion.button
              key={phone.type}
              layout
              type="button"
              aria-label={`Show ${phone.title}`}
              onHoverStart={() => setActive(i)}
              onClick={() => setActive(i)}
              animate={{
                y: isActive ? 0 : 34,
                z: isActive ? 90 : -80,
                scale: isActive ? 1 : .85,
                rotateY: isActive ? 0 : slot === 0 ? 9 : -9,
                rotateZ: isActive ? 0 : slot === 0 ? -3 : 3,
                opacity: isActive ? 1 : .66,
                filter: isActive ? "blur(0px) brightness(1)" : "blur(1px) brightness(.84)",
                boxShadow: isActive
                  ? "0 50px 110px rgba(0,0,0,.72), 0 0 0 1px rgba(243,212,154,.5), 0 0 65px rgba(232,185,100,.28)"
                  : "0 20px 42px rgba(0,0,0,.26), 0 0 0 1px rgba(247,239,231,.06)",
              }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 27, mass: .75 }}
              style={{
                gridColumn: slot + 1,
                gridRow: 1,
                zIndex: isActive ? 30 : 10,
                transformStyle: "preserve-3d",
                willChange: "transform, filter, opacity",
              }}
              className={`phone relative h-[470px] w-[238px] justify-self-center text-left ${isActive ? "phone-active" : ""}`}
            >
              <PhoneFrame type={phone.type} />
              <motion.span
                aria-hidden
                animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : .8 }}
                transition={{ duration: .35 }}
                className="pointer-events-none absolute -inset-12 -z-10 rounded-full bg-gold/15 blur-3xl"
              />
            </motion.button>
          );
        })}
      </div>

      <div
        ref={mobileTrackRef}
        onScroll={updateMobileActive}
        className="showcase-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50%_-_119px)] pb-12 pt-8 md:hidden"
      >
        {PHONE_DATA.map((phone, i) => {
          const isActive = i === active;
          return (
            <motion.button
              key={phone.type}
              type="button"
              aria-label={`Show ${phone.title}`}
              onClick={() => activateMobile(i)}
              animate={{
                y: isActive ? 0 : 18,
                scale: isActive ? 1 : .9,
                opacity: isActive ? 1 : .68,
                filter: isActive ? "blur(0px)" : "blur(.8px)",
              }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 27 }}
              className={`phone relative h-[470px] w-[238px] shrink-0 snap-center text-left ${isActive ? "phone-active" : ""}`}
            >
              <PhoneFrame type={phone.type} />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .3 }} className="mx-auto max-w-xl text-center md:-mt-6">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-gold">Experience {active + 1} of 3</p>
          <h3 className="display mt-2 text-3xl font-semibold text-ivory">{PHONE_DATA[active].title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted">{PHONE_DATA[active].copy}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex justify-center gap-2">
        {PHONE_DATA.map((phone, i) => <button key={phone.type} aria-label={`Activate ${phone.title}`} onClick={() => setActive(i)} className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-gold" : "w-2 bg-ivory/20"}`} />)}
      </div>
    </div>
  );
}

function HeroPhone() {
  return (
    <div className="phone h-[590px] w-[292px]">
      <div className="relative h-full overflow-hidden rounded-[30px] bg-night">
        <div className="photo absolute inset-0" style={{ backgroundImage: `url(${imageGift})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-night/35" />
        <div className="absolute left-5 right-5 top-8 flex items-center justify-between text-ivory">
          <LogoMark size={27} glow={false} />
          <Search size={18} />
        </div>
        <div className="absolute bottom-20 left-5 right-14 text-ivory">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-8 w-8 rounded-full border-2 border-ivory bg-gradient-to-br from-rose to-gold" />
            <span className="text-xs font-bold">@madebymae</span>
            <BadgeCheck size={14} className="fill-gold text-gold" />
          </div>
          <p className="display text-xl font-semibold leading-tight">A little piece of forever, made just for them.</p>
          <p className="mt-2 text-xs text-ivory/70">Personalized keepsake box · Handcrafted</p>
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex h-11 items-center justify-between rounded-xl bg-ivory px-4 text-night">
          <span className="text-xs font-extrabold">Discover this gift</span>
          <ArrowRight size={16} />
        </div>
        <div className="absolute bottom-24 right-4 flex flex-col gap-4 text-ivory">
          <motion.div animate={{ scale: [1, 1.18, 1] }} transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}>
            <Heart size={23} className="fill-ivory" />
          </motion.div>
          <ShoppingBag size={22} />
          <CircleUserRound size={22} />
        </div>
      </div>
    </div>
  );
}

function AmbientAccents({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`ambient-accents pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <span className="ambient-ribbon ambient-ribbon-one" />
      <span className="ambient-ribbon ambient-ribbon-two" />
      <span className="ambient-glow ambient-glow-one" />
      <span className="ambient-glow ambient-glow-two" />
      <span className="ambient-orbit ambient-orbit-one" />
      <span className="ambient-orbit ambient-orbit-two" />
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light'|'dark'>('light');

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // initialize theme mode from document attribute
    const current = (document.documentElement.dataset.theme as 'light'|'dark') ?? 'light';
    setThemeMode(current);

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'soulink-theme') {
        const next = (e.newValue as 'light'|'dark') ?? 'light';
        setThemeMode(next);
      }
    };
    window.addEventListener('storage', onStorage);

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      window.removeEventListener('storage', onStorage);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  // Update themeMode whenever dataset changes (e.g., ThemeToggle click)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const next = (document.documentElement.dataset.theme as 'light'|'dark') ?? 'light';
      setThemeMode(next);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistRole, setWaitlistRole] = useState<"consumer" | "seller">("consumer");
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroTextY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 100]);
  const boxY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -70]);

  const openWaitlistModal = (role: "consumer" | "seller" = "consumer") => {
    setWaitlistRole(role);
    setWaitlistModalOpen(true);
  };

  // Solid, theme-aware drawer palette (no transparency, no glass).
  const drawerBg = themeMode === "light" ? "#ffffff" : "#111827";
  const drawerText = themeMode === "light" ? "#111827" : "#ffffff";
  const drawerBorder = themeMode === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";
  const drawerMuted = themeMode === "light" ? "#6b7280" : "#9ca3af";

  return (
    <main className="overflow-hidden">
      <Preloader />
      <ScrollProgress />

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-ivory/10 bg-night/70 backdrop-blur-2xl">
        <div className="shell flex h-[72px] md:h-[76px] items-center justify-between px-4 sm:px-6 md:px-0">
          <a href="#" aria-label="Soulink home" className="shrink-0 flex items-center">
            {/* Mobile logo (smaller) */}
            <span className="block md:hidden"><Logo size={28} glow={true} /></span>
            {/* Desktop logo (larger) */}
            <span className="hidden md:block"><Logo size={35} glow={true} /></span>
          </a>

          {/* Desktop nav links - unchanged */}
          <div className="hidden items-center gap-6 text-sm font-semibold text-muted sm:gap-8 md:flex">
            <a href="#problem" className="hover:text-gold transition-colors">Why Soulink</a>
            <a href="#how" className="hover:text-gold transition-colors">How it works</a>
            <a href="#reels" className="hover:text-gold transition-colors">Gift stories</a>
            <a href="#vision" className="hover:text-gold transition-colors">Vision</a>
          </div>

          {/* Mobile: only show hamburger. Desktop: show theme + CTA buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hide theme toggle on small screens; move it into drawer */}
            <div className="hidden md:flex"><ThemeToggle /></div>

            <Magnetic className="hidden md:inline-flex" strength={.25}>
              <button onClick={() => openWaitlistModal("consumer")} className="button-primary !min-h-11 !px-5 text-sm">Join waitlist <ArrowRight size={15} /></button>
            </Magnetic>

            <button aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="text-ivory md:hidden shrink-0">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* -------- Mobile navigation drawer (mobile only) -------- */}

        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden={!menuOpen}
          className={`fixed inset-0 z-[9998] bg-black/50 transition-opacity duration-300 md:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
        />

        {/* Right-side slide-in drawer */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className={`fixed top-0 right-0 z-[9999] flex h-screen w-[85vw] max-w-[340px] flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ background: drawerBg, color: drawerText }}
        >
          {/* HEADER — logo (left) + close (right) */}
          <div
            className="flex shrink-0 items-center justify-between px-5"
            style={{ height: 64, borderBottom: `1px solid ${drawerBorder}` }}
          >
            <a href="#" onClick={() => setMenuOpen(false)} aria-label="Soulink home" className="flex items-center gap-2">
              <Logo size={30} glow={true} />
            </a>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              style={{ color: drawerText, border: `1px solid ${drawerBorder}` }}
            >
              <X size={20} />
            </button>
          </div>

          {/* BODY — scrolls independently */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-6" style={{ paddingBottom: 32 }}>
            {/* Navigation links */}
            <nav className="flex flex-col gap-4">
              {[
                ["problem", "Problem"],
                ["how", "How"],
                ["reels", "Reels"],
                ["vision", "Vision"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center rounded-lg px-3 text-base font-semibold transition-colors hover:text-gold"
                  style={{ height: 44, color: drawerText }}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Theme section — label + toggle */}
            <div style={{ marginTop: 16, marginBottom: 20, paddingTop: 16, borderTop: `1px solid ${drawerBorder}` }}>
              <span
                className="block px-3 text-xs font-bold uppercase tracking-[0.18em]"
                style={{ color: drawerMuted }}
              >
                Theme
              </span>
              <div className="mt-3 flex items-center justify-center">
                <ThemeToggle />
              </div>
            </div>

            {/* CTA buttons — stacked, full width */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { openWaitlistModal("consumer"); setMenuOpen(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gold-light to-rose font-semibold text-night shadow-lg transition-transform active:scale-[0.98]"
                style={{ height: 48 }}
              >
                Join Waitlist <ArrowRight size={16} />
              </button>
              <button
                onClick={() => { openWaitlistModal("seller"); setMenuOpen(false); }}
                className="flex w-full items-center justify-center rounded-xl font-semibold transition-colors active:scale-[0.98]"
                style={{ height: 48, color: drawerText, border: `1px solid ${drawerBorder}`, background: "transparent" }}
              >
                Sell on Soulink
              </button>
            </div>
          </div>
        </aside>
      </nav>

      <section ref={heroRef} className="grid-noise relative min-h-screen overflow-hidden pb-20 pt-32 md:pt-40">
        <div className="aurora" />
        <FloatingParticles count={13} />
        <div className="shell relative z-10 grid min-h-[720px] items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div style={{ y: heroTextY }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: 1.8, ease }}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs font-bold text-gold-light backdrop-blur">
              <Sparkles size={14} /> A complete gifting marketplace
            </div>
            <h1 className="display max-w-3xl text-5xl font-semibold leading-[.96] text-ivory md:text-7xl lg:text-[82px]">
              Gifting Should Feel <span className="text-gradient">Personal Again.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted md:text-lg">
              Discover handmade gifts, personalized experiences, and creator-made products that truly connect people.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-6 text-ivory/55">
              Browse traditionally, search with intent, or discover through creator stories—all in one trusted marketplace.
            </p>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-3">
              <Magnetic><a href="#solution" className="button-primary w-[220px] justify-center text-center sm:w-auto">Explore Soulink <ArrowRight size={17} className="hidden sm:inline" /></a></Magnetic>
              <Magnetic><button onClick={() => openWaitlistModal("consumer")} className="button-secondary w-[220px] justify-center text-center sm:w-auto">Join the waitlist</button></Magnetic>
            </div>
            <div className="mt-10 flex items-center gap-4 text-xs font-semibold text-muted">
              <div className="flex -space-x-2">
                {[imageGift, imageJewelry, imageMaker].map((src) => <span key={src} className="photo h-9 w-9 rounded-full border-2 border-night" style={{ backgroundImage: `url(${src})` }} />)}
              </div>
              Sellers, creators, and thoughtful gift-givers—together.
            </div>
          </motion.div>

          <motion.div style={{ y: boxY }} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: 1.95, ease }} className="relative mx-auto h-[650px] w-full max-w-[500px]">
            <AmbientAccents />
            <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 rotate-[3deg]">
              <HeroPhone />
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-1/2 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </section>

      <section id="surprise" className="relative border-b border-ivory/10 bg-night-2/55 py-24 md:py-32">
        <div className="aurora opacity-45" />
        <FloatingParticles count={10} />
        <div className="shell relative z-10">
          <SectionTitle
            center
            eyebrow="A gift for you"
            title="Every visit holds a different surprise."
            copy="Rotate the Soulink gift, unwrap it, and discover a founder reward waiting inside."
          />
          <Reveal className="mx-auto mt-8 max-w-xl">
            <GiftBox3D />
          </Reveal>
        </div>
      </section>

      <section id="problem" className="relative py-28 md:py-36">
        <AmbientAccents className="opacity-70" />
        <FloatingParticles count={8} tone="muted" />
        <div className="shell relative z-10">
          <SectionTitle eyebrow="The problem" title="More products than ever. Fewer gifts that truly mean something." copy="Discovery has become a search problem. Customers are overwhelmed, thoughtful sellers are hard to find, and the meaning behind a product disappears inside marketplace noise." />
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {[
              { who: "For gift-givers", icon: Search, items: ["Generic, repetitive choices", "Endless marketplace clutter", "Personalization as an afterthought", "Little context or confidence"] },
              { who: "For sellers & creators", icon: Store, items: ["Difficult customer discovery", "Products reduced to thumbnails", "Stories separated from checkout", "Trust is expensive to build"] },
            ].map((card, i) => (
              <TiltCard key={card.who}>
                <Reveal delay={i * .1} className="card-premium rounded-3xl p-7 md:p-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-rose text-night"><card.icon size={21} /></div>
                  <h3 className="display mt-7 text-2xl font-semibold text-ivory">{card.who}</h3>
                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {card.items.map(item => <div key={item} className="flex items-start gap-3 border-t border-ivory/10 py-3 text-sm text-muted"><X size={15} className="mt-0.5 shrink-0 text-rose" />{item}</div>)}
                  </div>
                </Reveal>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <section id="solution" className="relative border-y border-ivory/10 bg-night-2/60 py-28 md:py-36">
        <div className="aurora opacity-40" />
        <div className="shell relative z-10 grid items-center gap-16 lg:grid-cols-[.95fr_1.05fr]">
          <SectionTitle eyebrow="The solution" title="One marketplace. Every way to discover a meaningful gift." copy="Soulink combines traditional ecommerce, creator stores, social discovery, and native personalization. Creator-led content enhances the marketplace—it does not replace it." />
          <Reveal className="relative grid gap-4 sm:grid-cols-2">
            {[
              ["Browse & search", ShoppingBag, "A complete catalog with familiar marketplace discovery."],
              ["Understand the product", Play, "Short videos explain materials, use, and personalization."],
              ["Make it personal", WandSparkles, "Customization is part of the purchase flow."],
              ["Buy with confidence", ShieldCheck, "Connected stories, sellers, inventory, and checkout."],
            ].map(([title, Icon, copy]) => {
              const I = Icon as typeof Gift;
              return <div key={title as string} className="glass-soft delight rounded-2xl p-6"><I className="text-gold" size={22} /><h3 className="display mt-5 text-lg font-semibold text-ivory">{title as string}</h3><p className="mt-2 text-sm leading-6 text-muted">{copy as string}</p></div>;
            })}
          </Reveal>
        </div>
      </section>

      <section id="how" className="relative py-28 md:py-36">
        <div className="shell">
          <SectionTitle center eyebrow="How it works" title="From a thoughtful idea to a lasting memory." copy="A connected journey for customers, sellers, and creators—from discovery through delivery." />
          <GiftJourney />
        </div>
      </section>

      <section className="relative border-y border-ivory/10 bg-night-3/35 py-28 md:py-36">
        <FloatingParticles count={10} tone="rose" />
        <div className="shell relative z-10">
          <SectionTitle eyebrow="Find their perfect gift" title="Turn choosing into part of the joy." copy="Explore Soulink through small, useful moments designed to help you understand your gifting style, recipient, and occasion." />
          <GiftPlayground />
        </div>
      </section>

      <section id="reels" className="relative overflow-hidden py-28 md:py-36">
        <FloatingParticles count={9} />
        <div className="shell relative z-10">
          <SectionTitle center eyebrow="Three connected products" title="Everything Soulink is, in three interactive views." copy="Select a phone to explore content-led discovery, traditional marketplace shopping, and the seller business platform." />
          <div className="mt-8"><PhoneShowcase /></div>
        </div>
      </section>

      <section className="border-y border-ivory/10 bg-night-2/50 py-28 md:py-36">
        <div className="shell">
          <SectionTitle center eyebrow="One marketplace" title="Two Powerful Experiences." copy="A thoughtful buying journey on one side. A complete commerce operating system on the other." />
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              ["Buyer Experience", ShoppingBag, "Find the right gift through familiar shopping and richer product understanding.", ["Browse gifts", "Search products", "Watch reels", "Discover creators", "Personalize gifts", "Place orders"]],
              ["Seller Experience", Store, "Build and operate a modern gifting business from one connected workspace.", ["Create store", "Upload products", "Upload reels", "Manage orders", "Manage inventory", "View analytics"]],
            ].map(([title, Icon, copy, items], i) => {
              const I = Icon as typeof Gift;
              return (
                <TiltCard key={title as string}>
                  <Reveal delay={i * .1} className="card-premium h-full rounded-3xl p-8 md:p-10">
                    <div className="flex items-start justify-between">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light to-rose text-night shadow-gold-glow"><I size={24} /></span>
                      <span className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">0{i + 1}</span>
                    </div>
                    <h3 className="display mt-8 text-3xl font-semibold text-ivory">{title as string}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-muted">{copy as string}</p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {(items as string[]).map((item) => (
                        <div key={item} className="delight flex items-center gap-3 rounded-xl border border-ivory/10 bg-ivory/5 px-4 py-3 text-sm font-semibold text-ivory/85">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold"><Check size={13} /></span>{item}
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      <section id="vision" className="relative py-28 md:py-36">
        <FloatingParticles count={9} />
        <div className="shell relative z-10">
          <SectionTitle eyebrow="Future vision" title="The infrastructure for a more thoughtful gifting economy." copy="Soulink starts as a complete gifting marketplace and grows into an intelligent global network where sellers scale, creators build trust, and every customer finds something that feels personal." />
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              ["01", "Marketplace", ShoppingBag], ["02", "Product stories", Play], ["03", "Smart matching", Sparkles],
              ["04", "Creator ecosystem", Store], ["05", "Global expansion", Compass], ["06", "Smart logistics", PackageCheck],
            ].map(([n, title, Icon], i) => {
              const I = Icon as typeof Gift;
              return <Reveal key={title as string} delay={i * .07} className={`rounded-2xl border p-5 ${i < 2 ? "border-gold/40 bg-gold/10" : "border-ivory/10 bg-ivory/5"}`}><span className="text-[10px] font-bold tracking-widest text-rose">PHASE {n as string}</span><I className="mt-9 text-gold" size={21} /><h3 className="display mt-4 text-sm font-semibold text-ivory">{title as string}</h3></Reveal>;
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-ivory/10 bg-night-3/35 py-28 md:py-36">
        <div className="shell">
          <SectionTitle center eyebrow="Trust grows through context" title="The people and proof behind every connection." />
          <div className="mt-14 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <Reveal className="group relative min-h-[430px] overflow-hidden rounded-3xl">
              <div className="photo absolute inset-0 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${imageMaker})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
              <div className="media-overlay absolute bottom-0 p-8">
                <div className="mb-4 flex gap-1">{[1,2,3,4,5].map(x => <Star key={x} size={14} className="fill-gold text-gold" />)}</div>
                <p className="display text-2xl font-semibold leading-snug text-ivory">“My process is part of the product. Soulink gives customers a reason to understand it.”</p>
                <p className="mt-5 text-sm font-bold text-gold-light">Mira · Jewelry creator</p>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ["Finding the gift finally feels as considered as giving it.", "Aanya · Early member"],
                ["I can sell normally, then use stories when a product needs more explanation.", "Rohan · Independent seller"],
              ].map(([quote, by], i) => <Reveal key={by} delay={i * .1} className="card-premium flex min-h-[240px] flex-col justify-between rounded-3xl p-7"><Quote className="text-rose" /><p className="display text-xl font-semibold leading-snug text-ivory">“{quote}”</p><span className="text-xs font-bold text-muted">{by}</span></Reveal>)}
              <div className="col-span-full grid grid-cols-2 gap-6 rounded-3xl bg-gradient-to-br from-gold to-rose p-7 text-night sm:grid-cols-4">
                {[
                  { v: 250, s: "+", l: "Creators joined" }, { v: 1200, s: "+", l: "Products listed" },
                  { v: 18, s: "", l: "Gift categories" }, { v: 98, s: "%", l: "Thoughtful matches" },
                ].map(stat => <div key={stat.l} className="text-center"><strong className="display block text-3xl"><Counter to={stat.v} suffix={stat.s} /></strong><span className="mt-2 block text-[10px] font-bold uppercase tracking-wide text-night/65">{stat.l}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="p-4 md:p-6">
        <div className="grid-noise relative overflow-hidden rounded-[32px] border border-gold/20 bg-night-2 py-24 text-center md:py-32">
          <div className="aurora" /><FloatingParticles count={12} />
          <Reveal className="shell relative z-10">
            <div className="mx-auto mb-8 w-fit"><Logo size={48} /></div>
            <h2 className="display mx-auto max-w-3xl text-4xl font-semibold leading-tight text-ivory md:text-6xl">Help make gifting feel <span className="text-gradient">personal again.</span></h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted">Join the marketplace being built for thoughtful customers, ambitious sellers, and creators who make products easier to understand.</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:items-stretch sm:gap-3">
              <Magnetic><button onClick={() => openWaitlistModal("consumer")} className="button-primary w-[220px] justify-center sm:w-auto">Join waitlist <ArrowRight size={17} className="hidden sm:inline" /></button></Magnetic>
              <Magnetic><button onClick={() => openWaitlistModal("seller")} className="button-secondary w-[220px] justify-center sm:w-auto">Sell on Soulink</button></Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="py-14">
        <div className="shell">
          <div className="flex flex-col justify-between gap-10 border-b border-ivory/10 pb-10 md:flex-row">
            <div><Logo size={34} /><p className="mt-3 max-w-xs text-sm leading-6 text-muted">A complete gifting marketplace, enhanced by creator-driven content.</p></div>
            <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm font-bold text-muted">
              <a href="#solution" className="hover:text-gold">Marketplace</a><a href="#reels" className="hover:text-gold">Gift stories</a><a href="mailto:hello@soulink.co" className="hover:text-gold">Contact</a><a href="#" className="hover:text-gold">Privacy</a>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-5 pt-7 text-xs text-muted sm:flex-row">
            <span>© 2026 Soulink. Crafted for connection.</span>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="flex gap-4">
                <a href="https://www.instagram.com/__soulink__/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors"><Instagram size={17} /></a>
                <Linkedin size={17} />
              </div>
              <a href="mailto:soulink649@gmail.com" className="hover:text-gold transition-colors">soulink649@gmail.com</a>
            </div>
          </div>
        </div>
      </footer>
      <WaitlistModal isOpen={waitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} initialRole={waitlistRole} />
    </main>
  );
}
