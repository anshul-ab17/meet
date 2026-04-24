"use client";

import { MessageSquare, Video, Users, ArrowRight, Shield, Globe, Hash, Send, Plus } from "lucide-react";
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
    <div className="min-h-screen bg-bg-base flex flex-col select-none overflow-hidden relative">
      {/* Ambient animated blobs */}

      <div className="animate-blob-1 absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-primary/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="animate-blob-2 absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />

      {/* Nav */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-white/[0.05] backdrop-blur-xl sticky top-0 z-50">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary/20">
            <MessageSquare size={20} className="text-white" />
          </div>
          <span className="text-white font-sans text-xl font-bold tracking-tight">MEET</span>
        </button>
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 relative z-10 py-10 w-full max-w-[72rem] mx-auto">
        <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          <div className="flex-1 text-center lg:text-left animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.2rem] font-sans font-black text-white tracking-tighter leading-[0.95] mb-6">
              Chat, call,<br />
              <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                connect.
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-md mb-8 leading-relaxed font-light">
              Experience a high-fidelity communication hub designed for the modern era. Organized channels, HD calls, and a sleek editorial interface.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <AuthModal defaultMode="signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary-hover text-white hover:opacity-90 rounded-full px-7 h-12 text-base font-bold shadow-glow-md group transition-all duration-500 hover:scale-105">
                  Get Started Free
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </AuthModal>
            </div>
          </div>



          <div className="flex-1 relative w-full lg:max-w-[50%] animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-primary-hover/30 rounded-[3rem] blur-[120px] opacity-20" />
            
            {/* Browser Frame */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary-hover/20 rounded-[2rem] blur-xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              
              <div className="relative bg-[#0d0d0f] border border-white/[0.08] rounded-[1.5rem] shadow-2xl overflow-hidden aspect-[16/10] transition-all duration-700 hover:scale-[1.01] hover:shadow-glow-lg">
                {/* Traffic Lights */}
                <div className="h-12 bg-white/[0.02] border-b border-white/[0.05] flex items-center px-5 gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <div className="ml-6 h-6 w-64 rounded-md bg-white/5 flex items-center px-4">
                    <div className="w-full h-1 bg-white/10 rounded-full" />
                  </div>
                </div>
                
                {/* High-Fidelity UI Preview */}
                <div className="flex h-full pb-12 bg-[#0d0d0f]">
                  {/* Sidebar */}
                  <div className="w-16 md:w-20 border-r border-white/[0.03] flex flex-col items-center py-5 gap-4 bg-white/[0.01]">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-lg shadow-primary/20">
                      <MessageSquare size={16} className="text-white" />
                    </div>
                    <div className="w-1.5 h-6 rounded-full bg-primary/30 my-2" />
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 hover:text-gray-400 transition-colors">
                      <Hash size={16} />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-600">
                      <Users size={16} />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-600">
                      <Plus size={16} />
                    </div>
                    <div className="mt-auto w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                  </div>
                  
                  {/* Chat Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Channel Header */}
                    <div className="h-12 border-b border-white/[0.03] flex items-center px-6 justify-between bg-white/[0.01]">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">#</span>
                        <span className="text-white text-xs font-bold tracking-tight">general-discovery</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-3.5 h-3.5 rounded bg-white/5" />
                        <div className="w-3.5 h-3.5 rounded bg-white/5" />
                      </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
                      {/* Message 1 */}
                      <div className="flex gap-3 animate-fade-up" style={{ animationDelay: "0.6s" }}>
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white shrink-0">JD</div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-white text-[11px] font-bold">John Doe</span>
                            <span className="text-[9px] text-gray-600">12:40 PM</span>
                          </div>
                          <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl rounded-tl-none px-4 py-2.5 text-gray-300 text-[11px] leading-relaxed max-w-[80%]">
                            Has anyone tried the new WebRTC stream? The latency is incredible. 🚀
                          </div>
                        </div>
                      </div>
                      
                      {/* Message 2 (Own) */}
                      <div className="flex gap-3 flex-row-reverse animate-fade-up" style={{ animationDelay: "0.8s" }}>
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0">AN</div>
                        <div className="flex flex-col gap-1.5 flex-1 items-end">
                          <div className="flex items-baseline gap-2 flex-row-reverse">
                            <span className="text-primary text-[11px] font-bold">You</span>
                            <span className="text-[9px] text-gray-600">12:42 PM</span>
                          </div>
                          <div className="bg-primary text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-[11px] leading-relaxed max-w-[80%] shadow-lg shadow-primary/10">
                            Just tested it. 15ms glass-to-glass! Setting up the Neo4j cluster now.
                          </div>
                        </div>
                      </div>
                      
                      {/* Message 3 */}
                      <div className="flex gap-3 animate-fade-up" style={{ animationDelay: "1s" }}>
                        <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">SK</div>
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-white text-[11px] font-bold">Sarah King</span>
                            <span className="text-[9px] text-gray-600">12:45 PM</span>
                          </div>
                          <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl rounded-tl-none px-4 py-2.5 text-gray-300 text-[11px] leading-relaxed max-w-[80%]">
                            That&apos;s insane. Let me know when the staging environment is ready for a test call.
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Input Field */}
                    <div className="p-4 mt-auto">
                      <div className="h-11 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center px-4 gap-3">
                        <div className="w-5 h-5 rounded-lg bg-white/5 flex items-center justify-center">
                          <Plus size={12} className="text-gray-500" />
                        </div>
                        <div className="text-gray-600 text-[11px]">Message #general-discovery</div>
                        <div className="ml-auto flex gap-2">
                          <div className="w-5 h-5 rounded-lg bg-white/5" />
                          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-glow-sm">
                            <Send size={12} className="text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}

      <section className="border-t border-white/[0.05] bg-white/[0.01] w-full mt-auto">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-px bg-white/[0.05]">
          {features.map(({ icon: Icon, label, desc }, i) => (
            <div 
              key={label} 
              className="bg-bg-base px-8 py-8 flex flex-col gap-4 hover:bg-white/[0.02] transition-all duration-500 group animate-fade-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:shadow-glow-md transition-all duration-500 text-primary group-hover:text-white">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1.5">{label}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed font-light">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Footer */}
      <footer className="py-12 px-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-8 bg-bg-base relative z-10">
        <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-300">
          <MessageSquare size={16} className="text-primary" />
          <span className="text-sm font-sans font-black tracking-[0.2em] uppercase text-white">Meet 2026</span>
        </div>
        <div className="flex gap-10 text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold">
          <a href="https://github.com/anshul-ab17/meet" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-all duration-300">Github</a>
        </div>
      </footer>

    </div>
  );
}

