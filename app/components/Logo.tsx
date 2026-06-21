"use client";

import { useState } from "react";

/**
 * SouLink logo — single source of truth.
 *
 * TO USE YOUR LOGO:
 *   Drop your file at:  public/logo.png   (transparent background recommended)
 *   That's it. Every placement below picks it up automatically.
 *
 * Until that file exists, a styled "Soulink" text wordmark is shown as a
 * fallback so the layout never looks broken.
 */
const LOGO_SRC = "/logo.png";

/** Square/icon usage (small spots). Logo is letterboxed to a square box. */
export function LogoMark({
  size = 36,
  glow = true,
  className = "",
}: {
  size?: number;
  glow?: boolean;
  animated?: boolean; // accepted for API compatibility
  className?: string;
}) {
  const [err, setErr] = useState(false);
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full blur-[10px] opacity-70"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(108,62,244,.55), rgba(232,67,147,.35) 55%, transparent 72%)",
          }}
        />
      )}
      {err ? (
        <span
          className="display text-gradient font-extrabold leading-none"
          style={{ fontSize: size * 0.62 }}
        >
          S
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={LOGO_SRC}
          alt="Soulink"
          onError={() => setErr(true)}
          className="relative"
          style={{ height: size, width: size, objectFit: "contain" }}
        />
      )}
    </span>
  );
}

/** Full logo lockup: the mark image + the "Soulink" wordmark. `size` = mark height. */
export function Logo({
  size = 32,
  glow = true,
  inverted = false,
  className = "",
}: {
  size?: number;
  glow?: boolean;
  animated?: boolean; // accepted for API compatibility
  inverted?: boolean;
  className?: string;
}) {
  const [err, setErr] = useState(false);

  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: size * 0.28 }}>
      {!err && (
        <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
          {glow && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full blur-[12px] opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(232,67,147,.5), rgba(108,62,244,.3) 55%, transparent 72%)",
              }}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC}
            alt=""
            onError={() => setErr(true)}
            className="relative"
            style={{ height: size, width: size, objectFit: "contain" }}
          />
        </span>
      )}
      <span
        className={`display font-bold leading-none tracking-tight ${inverted ? "text-night" : "text-ivory"}`}
        style={{ fontSize: size * 0.64 }}
      >
        Sou<span className="text-gradient">link</span>
      </span>
    </span>
  );
}
