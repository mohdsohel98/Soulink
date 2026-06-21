"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Crown, Gift, Heart, RefreshCw, Rocket, Sparkles, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
 * Signature interaction: a draggable 3D jewel gift box.
 * - Pure CSS 3D (no heavy libraries) + a lightweight canvas particle burst.
 * - Drag to rotate (mouse + touch) with inertia & momentum; gentle idle spin;
 *   smooth settle to a resting pose after the reveal.
 * - Click / Enter runs the reveal sequence: untie ribbon → shake → lid lifts
 *   diagonally up-and-back (never covering the heading) → inner glow → confetti,
 *   hearts & sparkles → a premium "Coming Soon" reward card floats out.
 * - A different surprise on every open. Fully replayable.
 * ------------------------------------------------------------------------- */

const REWARDS = [
  {
    tag: "Launching Soon",
    title: "Be First In Line",
    desc: "Join the first generation of buyers and sellers shaping the future of gifting.",
    cta: "Get Early Access",
    Icon: Rocket,
  },
  {
    tag: "Founding Member",
    title: "Free Personalization",
    desc: "Founding members unlock complimentary personalization on their very first gift.",
    cta: "Claim Your Perk",
    Icon: Crown,
  },
  {
    tag: "Early Access",
    title: "Early Access Unlocked",
    desc: "Skip the line the day Soulink opens its doors to the world.",
    cta: "Reserve My Spot",
    Icon: Sparkles,
  },
  {
    tag: "Creator Rewards",
    title: "Exclusive Creator Rewards",
    desc: "Get featured and earn founding perks as one of our earliest creators.",
    cta: "Join As Creator",
    Icon: Star,
  },
  {
    tag: "Launching This Season",
    title: "Something Special Is Coming",
    desc: "A more thoughtful way to gift is almost here. Be part of the very first chapter.",
    cta: "Join The Waitlist",
    Icon: Gift,
  },
];

const S = 188; // box edge
const LID_H = 30; // lid height

type Vec = { x: number; y: number };
type Phase = "idle" | "shake" | "open";

function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#e8b964", "#f3d49a", "#e8788a", "#f08aa8", "#fbeede", "#e9d8fd"];
    const types = ["rect", "rect", "circle", "heart", "ribbon"] as const;
    const cx = W / 2;
    const cy = H * 0.5;
    const N = 170;

    const drawHeart = (s: number) => {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(0, 0, -s * 0.5, -s * 0.1, -s * 0.5, s * 0.25);
      ctx.bezierCurveTo(-s * 0.5, s * 0.55, 0, s * 0.8, 0, s);
      ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.55, s * 0.5, s * 0.25);
      ctx.bezierCurveTo(s * 0.5, -s * 0.1, 0, 0, 0, s * 0.3);
      ctx.closePath();
      ctx.fill();
    };

    const parts = Array.from({ length: N }, () => {
      const a = Math.random() * Math.PI * 2;
      const sp = 4 + Math.random() * 10;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 7,
        g: 0.15 + Math.random() * 0.12,
        s: 4 + Math.random() * 7,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        c: colors[(Math.random() * colors.length) | 0],
        type: types[(Math.random() * types.length) | 0],
        life: 1,
      };
    });

    let frames = 0;
    cancelAnimationFrame(rafRef.current);
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      frames++;
      let alive = false;
      for (const p of parts) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (frames > 60) p.life -= 0.011;
        if (p.life > 0 && p.y < H + 24) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.c;
          if (p.type === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.s * 0.5, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === "heart") {
            drawHeart(p.s * 1.4);
          } else if (p.type === "ribbon") {
            ctx.fillRect(-p.s * 0.25, -p.s * 0.9, p.s * 0.5, p.s * 1.8);
          } else {
            ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
          }
          ctx.restore();
        }
      }
      if (alive) rafRef.current = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
  return { canvasRef, fire };
}

export default function GiftBox3D() {
  const rotorRef = useRef<HTMLDivElement>(null);
  const rot = useRef<Vec>({ x: -20, y: -28 });
  const vel = useRef<Vec>({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef<Vec>({ x: 0, y: 0 });
  const moved = useRef(0);
  const reduce = useRef(false);
  const settling = useRef(false);

  const [phase, setPhase] = useState<Phase>("idle");
  const [reward, setReward] = useState(0);
  const { canvasRef, fire } = useConfetti();
  const open = phase === "open";

  // pick the visit's surprise once
  useEffect(() => {
    setReward((Math.random() * REWARDS.length) | 0);
    reduce.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }, []);

  // animation loop: drag, inertia/momentum, settle-on-open, gentle idle spin
  useEffect(() => {
    let raf = 0;
    const frame = () => {
      const r = rot.current;
      if (dragging.current) {
        // rot is updated directly in onMove
      } else if (settling.current) {
        r.x += (-10 - r.x) * 0.09;
        const targetY = Math.round(r.y / 360) * 360;
        r.y += (targetY - r.y) * 0.09;
      } else if (Math.abs(vel.current.x) > 0.05 || Math.abs(vel.current.y) > 0.05) {
        r.x += vel.current.x;
        r.y += vel.current.y;
        vel.current.x *= 0.95;
        vel.current.y *= 0.95;
      } else if (!reduce.current) {
        r.y += 0.18; // alive: gentle idle auto-rotation
      }
      r.x = Math.max(-70, Math.min(40, r.x));
      if (rotorRef.current) {
        rotorRef.current.style.transform = `translateZ(-40px) rotateX(${r.x}deg) rotateY(${r.y}deg)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    settling.current = false;
    moved.current = 0;
    last.current = { x: e.clientX, y: e.clientY };
    vel.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    moved.current += Math.abs(dx) + Math.abs(dy);
    rot.current.y += dx * 0.4;
    rot.current.x -= dy * 0.4;
    vel.current = { x: -dy * 0.4, y: dx * 0.4 };
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (moved.current < 8 && !open) reveal();
  };

  // reveal sequence: untie + shake → lid opens → glow + confetti → card floats out
  const reveal = () => {
    if (reduce.current) {
      setPhase("open");
      settling.current = true;
      setTimeout(() => (settling.current = false), 400);
      setTimeout(fire, 120);
      return;
    }
    setPhase("shake");
    setTimeout(() => {
      setPhase("open");
      settling.current = true;
      setTimeout(() => (settling.current = false), 1200);
      setTimeout(fire, 300);
    }, 500);
  };
  const reroll = () => {
    setReward((r) => (r + 1 + ((Math.random() * (REWARDS.length - 1)) | 0)) % REWARDS.length);
    settling.current = true;
    setTimeout(() => (settling.current = false), 900);
    fire();
  };
  const reset = () => {
    setPhase("idle");
    settling.current = false;
    vel.current = { x: 0.5, y: 1.2 };
  };

  const { tag, title, desc, cta, Icon } = REWARDS[reward];

  // ---- face helpers ----
  const velvet = "linear-gradient(150deg, #3a1c49, #241431 70%)";
  const goldStrap = "linear-gradient(180deg, #f3d49a, #e8b964 55%, #c9923f)";

  const face = (transform: string, bg: string, extra?: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: S,
    height: S,
    left: "50%",
    top: "50%",
    marginLeft: -S / 2,
    marginTop: -S / 2,
    transform,
    background: bg,
    boxShadow: "inset 0 0 40px rgba(0,0,0,.45)",
    backfaceVisibility: "hidden",
    borderRadius: 6,
    ...extra,
  });

  // vertical + horizontal gold straps on a body face
  const Straps = () => (
    <>
      <div
        style={{
          position: "absolute", top: 0, bottom: 0, left: "50%", width: 30, marginLeft: -15,
          background: goldStrap, transformOrigin: "center", transition: "transform .5s ease, opacity .4s ease",
          transform: phase !== "idle" ? "scaleY(0)" : "scaleY(1)", opacity: phase !== "idle" ? 0 : 1,
          boxShadow: "0 0 16px rgba(232,185,100,.35)",
        }}
      />
      <div
        style={{
          position: "absolute", left: 0, right: 0, top: "50%", height: 30, marginTop: -15,
          background: "linear-gradient(90deg, #c9923f, #f3d49a 50%, #c9923f)", transformOrigin: "center",
          transition: "transform .5s ease, opacity .4s ease",
          transform: phase !== "idle" ? "scaleX(0)" : "scaleX(1)", opacity: phase !== "idle" ? 0 : 1,
        }}
      />
    </>
  );

  return (
    <div className="relative mx-auto w-full max-w-[460px]">
      {/* floating reward card — overlays the box, stays readable while it rotates */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center">
        <AnimatePresence>
          {open && (
            <motion.div
              key={reward}
              initial={{ opacity: 0, y: 54, scale: 0.78, rotateX: -18 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: 28, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 220, damping: 22, delay: 0.45 }}
              className="w-[300px] max-w-[86%]"
            >
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="gift-reward-card pointer-events-auto rounded-3xl border border-gold/40 bg-gradient-to-br from-[#2a153a] to-[#160d1f] p-6 text-center shadow-[0_30px_70px_rgba(0,0,0,.55)]"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light to-rose text-night shadow-[0_0_30px_rgba(232,185,100,.5)]">
                  <Icon size={26} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-gold">{tag}</p>
                <h4 className="display mt-1.5 text-xl font-semibold leading-tight text-ivory">{title}</h4>
                <p className="mt-2 text-xs leading-5 text-muted">{desc}</p>
                <a
                  href="#join"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-light to-rose px-5 py-2 text-xs font-bold text-night transition hover:gap-2.5"
                >
                  {cta} <ArrowRight size={13} />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full"
        aria-hidden
      />

      {/* glow pad — brightens on open */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] -z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px] transition-all duration-700"
        style={{
          background: "radial-gradient(circle, rgba(232,185,100,.4), rgba(232,120,138,.2) 55%, transparent 72%)",
          opacity: open ? 1 : 0.7,
          transform: `translate(-50%,-50%) scale(${open ? 1.25 : 1})`,
        }}
      />

      {/* soft floating hearts & sparkles when opened */}
      <AnimatePresence>
        {open && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {[
              { l: "18%", t: "60%", d: 0, Icon: Heart, s: 16, c: "#f08aa8" },
              { l: "78%", t: "54%", d: 0.5, Icon: Sparkles, s: 18, c: "#f3d49a" },
              { l: "30%", t: "70%", d: 1, Icon: Sparkles, s: 13, c: "#e9d8fd" },
              { l: "68%", t: "68%", d: 0.8, Icon: Heart, s: 13, c: "#e8788a" },
              { l: "50%", t: "74%", d: 1.3, Icon: Sparkles, s: 15, c: "#e8b964" },
            ].map((f, i) => (
              <motion.span
                key={i}
                className="absolute"
                style={{ left: f.l, top: f.t, color: f.c }}
                initial={{ opacity: 0, y: 10, scale: 0.4 }}
                animate={{ opacity: [0, 0.9, 0], y: [-4, -120], scale: [0.4, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 3.6, delay: f.d, ease: "easeOut" }}
              >
                <f.Icon size={f.s} className="fill-current" />
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div
        role="button"
        tabIndex={0}
        aria-label={open ? `Reward revealed: ${title}` : "Open the Soulink gift box"}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (open) reroll();
            else if (phase === "idle") reveal();
          }
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative z-10 mx-auto flex h-[470px] cursor-grab items-center justify-center select-none pt-[120px] active:cursor-grabbing"
        style={{ perspective: 1000, touchAction: "none" }}
      >
        <div
          ref={rotorRef}
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
          className="relative"
        >
          {/* shadow on the ground */}
          <div
            aria-hidden
            style={{
              position: "absolute", left: "50%", top: "50%", width: S * 1.1, height: S * 0.5,
              marginLeft: -(S * 1.1) / 2, transform: `translateY(${S * 0.62}px) rotateX(90deg)`,
              background: "radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%)", filter: "blur(6px)",
            }}
          />

          <div className={phase === "shake" ? "giftbox-shake" : ""} style={{ transformStyle: "preserve-3d" }}>
            {/* ---- box body (top open) ---- */}
            <div style={{ transformStyle: "preserve-3d" }}>
              <div style={face(`rotateY(0deg) translateZ(${S / 2}px)`, velvet)}><Straps /></div>
              <div style={face(`rotateY(180deg) translateZ(${S / 2}px)`, velvet)}><Straps /></div>
              <div style={face(`rotateY(90deg) translateZ(${S / 2}px)`, "linear-gradient(150deg,#2f1740,#1d0f2a 70%)")}><Straps /></div>
              <div style={face(`rotateY(-90deg) translateZ(${S / 2}px)`, "linear-gradient(150deg,#2f1740,#1d0f2a 70%)")}><Straps /></div>
              <div style={face(`rotateX(-90deg) translateZ(${S / 2}px)`, "#160d1f")} />
              {/* inner glow when open */}
              <div
                style={face(`rotateX(-90deg) translateZ(${-S / 2 + 4}px)`, "radial-gradient(circle, rgba(243,212,154,.95), rgba(232,120,138,.55) 60%, transparent 75%)", {
                  opacity: open ? 1 : 0, transition: "opacity .5s ease .25s",
                })}
              />
              {/* light shaft rising from the open box */}
              <div
                aria-hidden
                style={{
                  position: "absolute", left: "50%", top: "50%", width: S * 0.7, height: S * 1.5,
                  marginLeft: -(S * 0.7) / 2, transform: `rotateX(-90deg) translateZ(${S * 0.2}px)`,
                  background: "linear-gradient(0deg, rgba(243,212,154,.5), transparent 78%)",
                  filter: "blur(8px)", opacity: open ? 1 : 0, transition: "opacity .6s ease .3s",
                  transformOrigin: "center bottom", pointerEvents: "none",
                }}
              />
            </div>

            {/* ---- lid: lifts diagonally up & BACK, never over the heading ---- */}
            <div
              style={{
                transformStyle: "preserve-3d",
                transform: `translateY(${-(S / 2 + LID_H / 2)}px) ${open ? `translate3d(-46px, -74px, -120px) rotateX(60deg) rotateZ(-13deg)` : ""}`,
                transition: "transform .9s cubic-bezier(.22,1,.36,1)",
              }}
            >
              {[
                `rotateX(90deg) translateZ(${LID_H / 2}px)`,
                `rotateX(-90deg) translateZ(${LID_H / 2}px)`,
              ].map((t, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute", width: S * 1.1, height: S * 1.1, left: "50%", top: "50%",
                    marginLeft: -(S * 1.1) / 2, marginTop: -(S * 1.1) / 2, transform: t,
                    background: i === 0 ? "linear-gradient(150deg,#43224f,#2a153a 70%)" : "#160d1f",
                    borderRadius: 8, backfaceVisibility: "hidden", boxShadow: "inset 0 0 50px rgba(0,0,0,.4)",
                  }}
                >
                  {i === 0 && (
                    <>
                      {/* lid straps */}
                      <div style={{ position: "absolute", inset: 0, left: "50%", width: 30, marginLeft: -15, background: goldStrap, opacity: phase !== "idle" ? 0 : 1, transition: "opacity .4s" }} />
                      <div style={{ position: "absolute", inset: 0, top: "50%", height: 30, marginTop: -15, background: "linear-gradient(90deg,#c9923f,#f3d49a 50%,#c9923f)", opacity: phase !== "idle" ? 0 : 1, transition: "opacity .4s" }} />
                      {/* bow */}
                      <div
                        style={{
                          position: "absolute", left: "50%", top: "50%", transform: `translate(-50%,-50%) ${phase !== "idle" ? "translateY(-46px) scale(0) rotate(40deg)" : "scale(1)"}`,
                          transition: "transform .6s ease", display: "flex", alignItems: "center",
                        }}
                      >
                        <span style={{ width: 38, height: 46, borderRadius: "60% 60% 40% 60%", background: goldStrap, transform: "rotate(-22deg)", boxShadow: "0 4px 12px rgba(0,0,0,.35)" }} />
                        <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#f3d49a", margin: "0 -6px", zIndex: 2, boxShadow: "inset 0 -2px 4px rgba(0,0,0,.3)" }} />
                        <span style={{ width: 38, height: 46, borderRadius: "60% 60% 60% 40%", background: goldStrap, transform: "rotate(22deg)", boxShadow: "0 4px 12px rgba(0,0,0,.35)" }} />
                      </div>
                    </>
                  )}
                </div>
              ))}
              {/* lid rim (4 thin sides) */}
              {[`translateZ(${(S * 1.1) / 2}px)`, `rotateY(90deg) translateZ(${(S * 1.1) / 2}px)`, `rotateY(180deg) translateZ(${(S * 1.1) / 2}px)`, `rotateY(-90deg) translateZ(${(S * 1.1) / 2}px)`].map((t, i) => (
                <div key={i} style={{ position: "absolute", width: S * 1.1, height: LID_H, left: "50%", top: "50%", marginLeft: -(S * 1.1) / 2, marginTop: -LID_H / 2, transform: t, background: "linear-gradient(180deg,#3a1c49,#241431)", borderRadius: 4, backfaceVisibility: "hidden" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* hint / controls */}
      <div className="relative z-40 mt-2 text-center">
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-xs font-semibold text-muted"
            >
              <Gift size={14} className="text-gold" /> Drag to rotate · tap to unwrap your surprise
            </motion.p>
          ) : (
            <motion.div key="ctrl" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3">
              <button onClick={reroll} className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold transition hover:bg-gold/20">
                <RefreshCw size={12} /> Open another surprise
              </button>
              <button onClick={reset} className="rounded-full px-4 py-1.5 text-xs font-bold text-muted transition hover:text-ivory">
                Wrap it back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
