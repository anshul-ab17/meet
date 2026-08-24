"use client";


import { Send, Menu, X, MessageSquare, Video, Sparkles, Users, Shield, Zap, ArrowRight, Radio } from "lucide-react";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { Button } from "./ui/button";
import { BrandLogo } from "./BrandLogo";

const MENU_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Community", href: "#community" },
  { label: "Security", href: "#security" },
  { label: "Developers", href: "#developers" },
];

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com/anshul_ab17", Glyph: XGlyph },
  { label: "Instagram", href: "https://instagram.com/", Glyph: InstaGlyph },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/anshul-bt17/", Glyph: LinkedinGlyph },
];

const FEATURE_TAGS = [
  { icon: MessageSquare, label: "Real-time Chat", desc: "Instant sync & DMs" },
  { icon: Video, label: "HD Stream & Calls", desc: "Crystal clear WebRTC" },
  { icon: Users, label: "Channels & Spaces", desc: "Organized communities" },
  { icon: Shield, label: "End-to-End Privacy", desc: "Protected conversations" },
];

function Logo() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group flex items-center gap-3 hover:opacity-90 transition-opacity"
      aria-label="Meet home"
    >
      <BrandLogo size={40} className="rounded-xl shadow-lg shadow-[#f0b46a]/15" />
      <span className="text-white font-sans text-xl font-extrabold tracking-[0.16em]">MEET</span>
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
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0e1a] text-white select-none flex flex-col justify-between">
      {/* ===== Twilight scene (pure CSS / SVG, no external assets) ===== */}
      <div className="absolute inset-0 pointer-events-none">
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
          className="absolute left-1/2 -translate-x-1/2 bottom-[12%] h-[42vh] w-[42vh] rounded-full blur-[10px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,210,140,0.85) 0%, rgba(245,170,110,0.45) 32%, rgba(220,130,90,0.15) 55%, transparent 72%)",
          }}
        />

        {/* Volumetric clouds */}
        <Cloud className="left-[4%] top-[14%] scale-[1.1] opacity-75" />
        <Cloud className="right-[2%] top-[8%] scale-[1.35] opacity-65" />
        <Cloud className="left-[28%] top-[22%] scale-[0.9] opacity-55" />

        {/* Distant city skyline silhouette on the horizon */}
        <CitySkyline />

        {/* Rolling hills foreground */}
        <svg
          className="absolute bottom-0 left-0 h-[38%] w-full"
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0,420 L0,250 C220,170 380,300 600,235 C820,170 980,290 1180,225 C1300,188 1380,235 1440,210 L1440,420 Z" fill="#0c1322" />
          <path d="M0,420 L0,320 C200,260 360,360 560,310 C780,255 960,360 1180,305 C1320,267 1390,310 1440,290 L1440,420 Z" fill="#070b15" />
        </svg>

        {/* Atmospheric haze + bottom darkening */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 100%, rgba(4,6,15,0.85) 0%, rgba(4,6,15,0.3) 50%, transparent 75%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04060f]/90 via-transparent to-[#04060f]/40" />
      </div>

      {/* ===== Foreground UI ===== */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-5 md:px-12 md:py-6 backdrop-blur-[2px]">
          <Logo />

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/75">
            {MENU_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-white transition-colors duration-200">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <AuthModal defaultMode="signin">
              <button className="hidden sm:inline-flex px-4 py-2 text-[13px] font-semibold text-white/80 hover:text-white transition-colors">
                Sign In
              </button>
            </AuthModal>

            <AuthModal defaultMode="signup">
              <Button
                className="rounded-full bg-[#f0b46a] text-black hover:bg-[#f6c382] px-5 py-2 text-[13px] font-bold shadow-lg shadow-[#f0b46a]/20 transition-all hover:scale-105"
              >
                Get Started Free
                <ArrowRight size={14} className="ml-1.5" />
              </Button>
            </AuthModal>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:bg-white/10 md:hidden"
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </header>

        {/* Center Hero content: Headline, Live preview badges & stats */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center max-w-5xl mx-auto w-full">
          {/* Release badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 backdrop-blur-md mb-6 animate-fade-in shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-[#f0b46a] animate-pulse" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-white/90">
              Meet v2.0 is Live
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[12px] text-white/70">Rooms, Voice & HD Streams</span>
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            Where conversations <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#ffe4c2] via-[#f0b46a] to-[#d99a5b] bg-clip-text text-transparent">
              come alive seamlessly.
            </span>
          </h2>

          <p className="max-w-2xl text-base sm:text-lg text-white/70 font-light mb-8 leading-relaxed">
            The next-generation chat platform engineered for speed, crystal-clear voice channels, and shared live streams with zero friction.
          </p>

          {/* Call to action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <AuthModal defaultMode="signup">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-[#f0b46a] to-[#e59d4c] px-8 py-3 text-sm font-bold text-black shadow-xl shadow-[#f0b46a]/25 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#f0b46a]/35"
              >
                Launch Meet Now
                <Zap size={16} className="ml-2 fill-black" />
              </Button>
            </AuthModal>

            <AuthModal defaultMode="signin">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/25 bg-white/[0.05] px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/40"
              >
                Explore Channels
                <MessageSquare size={16} className="ml-2 opacity-70" />
              </Button>
            </AuthModal>
          </div>

          {/* Feature Grid / Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full max-w-4xl pt-2">
            {FEATURE_TAGS.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group flex flex-col items-start rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-md transition-all duration-300 hover:border-[#f0b46a]/40 hover:bg-white/[0.08] hover:-translate-y-0.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.08] text-[#f0b46a] mb-3 group-hover:bg-[#f0b46a] group-hover:text-black transition-colors">
                  <Icon size={18} />
                </div>
                <h4 className="text-[13px] font-bold text-white mb-0.5">{label}</h4>
                <p className="text-[11px] text-white/55 leading-tight">{desc}</p>
              </div>
            ))}
          </div>
        </main>

        {/* Bottom block: Footer links + giant brand wordmark */}
        <section className="relative px-6 pt-4 pb-0 md:px-12">
          {/* Giant wordmark */}
          <div className="relative -mb-[3.5vw] select-none pointer-events-none opacity-90">
            <h1
              className="whitespace-nowrap text-center font-sans font-extrabold leading-[0.78] tracking-[-0.03em] text-white/90"
              style={{ fontSize: "min(26vw, 19rem)" }}
            >
              MEET
            </h1>
          </div>
        </section>

        {/* Footer band: emblem + tagline + copyright */}
        <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4 md:px-12 backdrop-blur-md bg-black/20">
          <div className="flex items-center gap-3">
            <BrandLogo size={26} className="opacity-90 rounded-lg" />
            <span className="text-[11px] font-light uppercase tracking-[0.28em] text-white/60">
              Connect, Chat, Collaborate
            </span>
          </div>

          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map(({ label, href, Glyph }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white transition-colors"
                aria-label={label}
              >
                <Glyph className="h-4 w-4" />
              </a>
            ))}
            <span className="text-[11px] font-light tracking-wide text-white/40 border-l border-white/15 pl-4">
              © {new Date().getFullYear()} Meet
            </span>
          </div>
        </footer>
      </div>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div className="absolute inset-0 z-40 flex flex-col bg-[#05060f]/98 backdrop-blur-2xl md:hidden px-6 py-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <Logo />
            <button
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <nav className="flex flex-col gap-5 pt-8 text-xl font-medium">
            {MENU_LINKS.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-[#f0b46a] transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-white/10">
            <AuthModal defaultMode="signup">
              <Button className="w-full rounded-full bg-[#f0b46a] text-black font-bold py-3">
                Get Started
              </Button>
            </AuthModal>
          </div>
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
