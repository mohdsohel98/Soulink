


"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

/* ---------- Scroll progress bar ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold via-rose to-gold-light"
    />
  );
}

/* ---------- First-load logo reveal ---------- */
export function Preloader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night"
        >
          <div className="aurora opacity-60" />
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <Logo size={56} glow />
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 1.3, ease: "easeInOut" }}
            className="relative z-10 mt-7 h-[3px] w-32 origin-left rounded-full bg-gradient-to-r from-gold to-rose"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Count-up statistic ---------- */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 2,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const unsub = count.on("change", (v) => {
      setDisplay(Math.round(v).toLocaleString());
    });
    if (inView) {
      const controls = animate(count, to, { duration, ease: [0.22, 1, 0.36, 1] });
      return () => {
        controls.stop();
        unsub();
      };
    }
    return unsub;
  }, [inView, to, duration, count]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ---------- Magnetic button wrapper ---------- */
export function Magnetic({
  children,
  className = "",
  strength = 0.4,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18 });
  const sy = useSpring(y, { stiffness: 260, damping: 18 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

export function FloatingParticles({
  count = 12,
  tone = "gold",
}: {
  count?: number;
  tone?: "gold" | "rose" | "muted";
}) {
  // deterministic pseudo-random so SSR & client match (no Math.random hydration drift)
  const items = Array.from({ length: count }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    const r2 = ((i * 4801 + 12011) % 233280) / 233280;
    const r3 = ((i * 7211 + 33329) % 233280) / 233280;
    return {
      left: `${Math.round(r * 96) + 2}%`,
      top: `${Math.round(r2 * 92) + 2}%`,
      size: 2 + Math.round(r3 * 4),
      delay: r * 5,
      dur: 7 + r2 * 7,
      drift: r3 > 0.5 ? 18 : -18,
      sparkle: i % 4 === 0,
    };
  });

  const color = tone === "rose"
    ? "rgba(232, 120, 138, .38)"
    : tone === "muted"
      ? "rgba(200, 190, 205, .2)"
      : "rgba(232, 185, 100, .35)";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => (
        <motion.div
          key={i}
          className={it.sparkle ? "ambient-sparkle absolute" : "ambient-particle absolute rounded-full"}
          style={{ left: it.left, top: it.top, width: it.size, height: it.size, backgroundColor: color }}
          animate={{ y: [0, it.drift, 0], scale: [0.75, 1.15, 0.75], opacity: [0.25, 0.75, 0.25] }}
          transition={{ repeat: Infinity, duration: it.dur, delay: it.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ---------- Reveal helper (fade-up on scroll) ---------- */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* re-export for convenience */
export { useTransform };
