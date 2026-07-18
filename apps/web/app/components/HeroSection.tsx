"use client";


import { MessageSquare, Send, Menu, X } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { Button } from "./ui/button";

const MENU_LINKS = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#" },
  { label: "Work", href: "#" },
  { label: "About", href: "#" },
  { label: "Contact", href: "#" },
];

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com/anshul_ab17", Glyph: XGlyph },
  { label: "Instagram", href: "https://instagram.com/", Glyph: InstaGlyph },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/anshul-bt17/", Glyph: LinkedinGlyph },
];

const RESOURCE_LINKS = [
  { label: "Weekstack App", href: "#" },
  { label: "Newsletter", href: "#" },
];

function Logo() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex items-center gap-3 hover:opacity-90 transition-opacity"
      aria-label="Meet home"
    >
      <span className="relative flex h-11 w-11 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-white/40" />
        <span className="absolute inset-[3px] rounded-full border border-white/15" />
        <MessageSquare size={17} className="text-white/90" strokeWidth={2} />
      </span>
      <span className="text-white font-sans text-lg font-extrabold tracking-[0.18em]">MEET</span>
    </button>
  );
}

function ColumnLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="text-white/70 text-[13px] font-light tracking-wide hover:text-white hover:translate-x-0.5 transition-all duration-300 w-fit"
    >
      {label}
    </a>
  );
}

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0e1a] text-white select-none">
      {/* ===== Twilight scene (pure CSS / SVG, no external assets) ===== */}
      <div className="absolute inset-0">
        {/* Sky gradient: starry indigo -> dusky teal -> warm amber on the horizon */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #05060f 0%, #0b1024 24%, #162043 48%, #2c3a5e 64%, #5b5468 76%, #9c6d5a 86%, #d99a5b 94%, #f0b46a 100%)",
          }}
        />

        {/* Stars */}
        <Stars />

        {/* Sun glow near horizon */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[8%] h-[42vh] w-[42vh] rounded-full blur-[10px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,210,140,0.95) 0%, rgba(245,170,110,0.55) 32%, rgba(220,130,90,0.18) 55%, transparent 72%)",
          }}
        />

        {/* Volumetric clouds (amber-lit, soft) */}
        <Cloud className="left-[4%] top-[20%] scale-[1.1] opacity-90" />
        <Cloud className="right-[2%] top-[12%] scale-[1.35] opacity-80" />
        <Cloud className="left-[28%] top-[30%] scale-[0.9] opacity-70" />

        {/* Distant city skyline silhouette on the horizon */}
        <CitySkyline />

        {/* Rolling hills foreground */}
        <svg
          className="absolute bottom-0 left-0 h-[42%] w-full"
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,420 L0,250 C220,170 380,300 600,235 C820,170 980,290 1180,225 C1300,188 1380,235 1440,210 L1440,420 Z" fill="#0c1322" />
          <path d="M0,420 L0,320 C200,260 360,360 560,310 C780,255 960,360 1180,305 C1320,267 1390,310 1440,290 L1440,420 Z" fill="#070b15" />
        </svg>

        {/* Tiny figure sitting on the hill, facing the city */}
        <div className="absolute left-[44%] bottom-[24%]">
          <div className="relative h-5 w-5">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-3.5 w-1.5 rounded-full bg-black/80" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-black/80" />
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px w-6 bg-black/40 rounded-full" />
        </div>

        {/* Atmospheric haze + bottom darkening for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 100%, rgba(4,6,15,0.78) 0%, rgba(4,6,15,0.25) 42%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060f]/85 via-transparent to-[#04060f]/30" />
      </div>

      {/* ===== Foreground UI ===== */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-6 md:px-10 md:py-7">
          <Logo />

          <div className="flex items-center gap-3">
            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.32em] text-white/85 md:inline">
              Work fast. Live slow.
            </span>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/90 transition-all hover:bg-white/10 md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* Center spacer — the giant wordmark sits at the very bottom */}
        <div className="flex-1" />

        {/* Bottom block: links + giant wordmark */}
        <section className="relative px-6 pb-0 md:px-10">
          {/* Three columns of links */}
          <div className="mb-10 grid grid-cols-2 gap-10 md:grid-cols-3">
            {/* MENU */}
            <div>
              <h3 className="mb-4 border-b border-white/20 pb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white">
                Menu
              </h3>
              <ul className="flex flex-col gap-2.5">
                {MENU_LINKS.map((l) => (
                  <li key={l.label}>
                    <ColumnLink {...l} />
                  </li>
                ))}
              </ul>
            </div>

            {/* SOCIALS */}
            <div>
              <h3 className="mb-4 border-b border-white/20 pb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white">
                Socials
              </h3>
              <ul className="flex flex-col gap-2.5">
                {SOCIAL_LINKS.map(({ label, href, Glyph }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-fit items-center gap-2 text-white/70 text-[13px] font-light tracking-wide transition-all duration-300 hover:text-white hover:translate-x-0.5"
                    >
                      <Glyph className="h-[15px] w-[15px] text-white/55 group-hover:text-white" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* RESOURCES */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="mb-4 border-b border-white/20 pb-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white">
                Resources
              </h3>
              <ul className="mb-5 flex flex-col gap-2.5">
                {RESOURCE_LINKS.map((l) => (
                  <li key={l.label}>
                    <ColumnLink {...l} />
                  </li>
                ))}
              </ul>
              <AuthModal defaultMode="signup">
                <Button
                  variant="outline"
                  className="group rounded-full border-white/55 px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-white/10 hover:border-white transition-all duration-300"
                >
                  Send a message
                  <Send size={14} className="ml-2 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </AuthModal>
            </div>
          </div>

          {/* Giant wordmark, clipped at the bottom edge */}
          <div className="relative -mb-[3.5vw] mt-2 select-none">
            <h1
              className="whitespace-nowrap text-center font-sans font-extrabold leading-[0.78] tracking-[-0.03em] text-white"
              style={{ fontSize: "min(27vw, 20rem)" }}
            >
              MEET
            </h1>
          </div>
        </section>
      </div>

      {/* Mobile overlay menu (reuses columns) */}
      {menuOpen && (
        <div className="absolute inset-0 z-30 flex flex-col bg-[#05060f]/95 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-6 py-6">
            <Logo />
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-6 px-6 pt-6 text-2xl font-light">
            {MENU_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-white/85 hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

/* ---------- Scene primitives ---------- */

function Stars() {
  // Deterministic-ish star field (avoids hydration mismatch from Math.random)
  const stars = Array.from({ length: 70 }, (_, i) => {
    const x = (i * 53.13) % 100;
    const y = (i * 29.7) % 60;
    const s = (i % 3) + 0.6;
    const o = 0.3 + ((i * 37) % 60) / 100;
    return { x, y, s, o, d: (i % 5) * 0.6 };
  });
  return (
    <div className="absolute inset-0">
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: `${st.s}px`,
            height: `${st.s}px`,
            opacity: st.o,
            animation: `twinkle ${2.5 + st.d}s ease-in-out ${st.d}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Cloud({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden>
      <div
        className="h-[14vh] w-[34vh] rounded-[50%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,205,150,0.85), rgba(230,170,130,0.35) 60%, transparent 78%)",
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}

function CitySkyline() {
  const buildings = [
    { x: 38, w: 3, h: 9 },
    { x: 41.5, w: 2, h: 6 },
    { x: 44, w: 4, h: 13 },
    { x: 48.5, w: 2.5, h: 7 },
    { x: 51, w: 3.5, h: 11 },
    { x: 55, w: 2, h: 5 },
    { x: 57, w: 5, h: 16 },
    { x: 62, w: 3, h: 9 },
    { x: 65.5, w: 2.5, h: 6 },
    { x: 68, w: 4, h: 12 },
    { x: 72.5, w: 2, h: 5 },
    { x: 74.5, w: 3, h: 8 },
  ];
  return (
    <div
      className="absolute bottom-[20%] left-0 w-full"
      style={{ height: "20%" }}
      aria-hidden
    >
      {buildings.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-0 bg-[#0a0f1c]/90"
          style={{
            left: `${b.x}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
            boxShadow: "0 0 12px rgba(255,200,140,0.12)",
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Brand glyphs (logos, not emoji) ---------- */

function XGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function InstaGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.3c0-1.26-.02-2.9-1.9-2.9-1.9 0-2.2 1.36-2.2 2.76V21H9V9Z" />
    </svg>
  );
}
