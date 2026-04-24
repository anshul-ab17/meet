"use client";

import { type FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUserStore } from "../store/useUserStore";
import type { User } from "../types";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3003";

type Mode = "signup" | "signin";

interface AuthModalProps {
  children: React.ReactNode;
  defaultMode?: Mode;
}

export function AuthModal({ children, defaultMode = "signup" }: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useUserStore((s) => s.setSession);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), password }),
      });
      const body = (await res.json()) as { user: User; token: string } | { error: string };
      if (!res.ok) {
        setError("error" in body ? body.error : "Something went wrong");
        return;
      }
      if ("token" in body) {
        setSession(body.user, body.token);
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-white font-bold text-xl tracking-tight mb-1">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-gray-500 text-sm">
            {mode === "signup" ? "Start chatting in seconds." : "Sign in to continue."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-5 border-b border-white/[0.07]">
          {(["signup", "signin"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 pb-3 text-sm font-semibold transition-all duration-200 relative ${
                mode === m
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {m === "signup" ? "Sign Up" : "Sign In"}
              {mode === m && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading || !name.trim() || !password}
            className="w-full mt-2 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 font-semibold"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === "signup" ? "Creating..." : "Signing in..."}
              </span>
            ) : (
              mode === "signup" ? "Create Account" : "Sign In"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
