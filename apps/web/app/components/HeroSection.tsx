"use client";

import { MessageSquare, Video, Users, Zap, ArrowRight, Shield, Globe, Sparkles } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { Button } from "./ui/button";

const features = [
  { icon: MessageSquare, label: "Organized Channels", desc: "Topic-based hubs for every community." },
  { icon: Video, label: "HD Video Calls", desc: "Peer-to-peer clarity with low latency." },
  { icon: Globe, label: "Global Connectivity", desc: "Connect with anyone, anywhere, instantly." },
  { icon: Shield, label: "Private & Secure", desc: "End-to-end encrypted messaging streams." },
];

export function HeroSection() {
  return (
    <div className="min-h-screen bg-bg-base flex flex-col select-none overflow-hidden relative font-sans">
      {/* Ambient animated blobs */}
      <div className="animate-blob-1 absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="animate-blob-2 absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-white/[0.05] backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary/20">
            <MessageSquare size={20} className="text-white" />
          </div>
          <span className="text-white font-display text-xl font-bold tracking-tight">MEET</span>
        </div>
        <div className="flex gap-4 items-center">
          <AuthModal defaultMode="signin">
            <Button variant="ghost" className="text-gray-400 hover:text-white transition-colors">Log In</Button>
          </AuthModal>
          <AuthModal defaultMode="signup">
            <Button className="rounded-full px-6 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 font-semibold">
              Join Now
            </Button>
          </AuthModal>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 py-20">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-full px-4 py-1.5 text-xs text-gray-400 font-medium mb-10 tracking-wide">
          <span className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-green-400" />
          WebSocket · WebRTC · Neo4j
        </div>

        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-[0.9] mb-8">
              Chat, call,<br />
              <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                connect.
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light">
              Experience a high-fidelity communication hub designed for the modern era. Organized channels, HD calls, and a sleek editorial interface.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <AuthModal defaultMode="signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-hover text-white hover:opacity-90 rounded-full px-8 h-14 text-lg font-semibold shadow-glow-md group">
                  Get Started Free
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </AuthModal>
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square md:aspect-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-primary-hover/30 rounded-3xl blur-2xl opacity-20 animate-pulse" />
            <div className="relative bg-white/[0.03] border border-white/[0.1] rounded-3xl p-4 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-[4/3] group transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-hover opacity-50" />
              <div className="flex flex-col h-full gap-4 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20" />
                  <div className="flex-1 h-8 rounded-lg bg-white/5" />
                </div>
                <div className="flex-1 rounded-2xl bg-white/[0.02]" />
                <div className="h-12 rounded-xl bg-white/5" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Video size={80} className="text-primary/40 animate-bounce" />
              </div>
            </div>
          </div>
        </div>
      </main>


      {/* Features Grid */}
      <section className="border-t border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-px bg-white/[0.05]">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-bg-base px-10 py-12 flex flex-col gap-4 hover:bg-white/[0.02] transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:shadow-glow-sm transition-all duration-300 text-primary group-hover:text-white">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1.5">{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <MessageSquare size={14} />
          <span className="text-xs font-display font-bold tracking-widest uppercase">Meet 2026</span>
        </div>
        <div className="flex gap-8 text-xs text-gray-600 uppercase tracking-widest font-semibold">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Github</a>
        </div>
      </footer>
    </div>
  );
}

