"use client";

import { type FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUserStore } from "../store/useUserStore";
import type { User } from "../types";

const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:3003";

type Mode = "signup" | "signin";
type Step = "form" | "otp";

interface AuthModalProps {
  children: ReactNode;
  defaultMode?: Mode;
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group select-none">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all duration-150 ${
          checked
            ? "bg-primary border-primary"
            : "bg-transparent border-white/20 group-hover:border-white/40"
        }`}
      >
        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
      </button>
      <span className="text-xs text-gray-400 leading-relaxed">{label}</span>
    </label>
  );
}

export function AuthModal({ children, defaultMode = "signup" }: AuthModalProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [step, setStep] = useState<Step>("form");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // OTP step
  const [otp, setOtp] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setSession = useUserStore((s) => s.setSession);

  const reset = (m: Mode) => {
    setMode(m);
    setStep("form");
    setName(""); setEmail(""); setPassword("");
    setAgreed(false); setRememberMe(false);
    setOtp(""); setPendingUserId("");
    setError("");
  };

  // Step 1 — signup/signin form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = mode === "signup"
        ? { name: name.trim(), email: email.trim(), password }
        : { name: name.trim(), password, rememberMe };

      const res = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as
        | { pending: true; userId: string }
        | { user: User; token: string }
        | { error: string };

      if (!res.ok) {
        setError("error" in data ? data.error : "Something went wrong");
        return;
      }

      if ("pending" in data) {
        setPendingUserId(data.userId);
        setStep("otp");
        return;
      }

      if ("token" in data) {
        setSession(data.user, data.token);
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — OTP verification
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: pendingUserId, otp }),
      });
      const data = (await res.json()) as { user: User; token: string } | { error: string };
      if (!res.ok) {
        setError("error" in data ? data.error : "Invalid OTP");
        return;
      }
      if ("token" in data) {
        setSession(data.user, data.token);
        setOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const isSignupDisabled = loading || !name.trim() || !email.trim() || !password || !agreed;
  const isSigninDisabled = loading || !name.trim() || !password;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(mode); }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>

        {/* ── OTP Step ── */}
        {step === "otp" ? (
          <>
            <button
              type="button"
              onClick={() => { setStep("form"); setOtp(""); setError(""); }}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 mb-5 transition-colors"
            >
              <ArrowLeft size={13} /> Back
            </button>

            <div className="mb-6">
              <h2 className="text-white font-bold text-xl tracking-tight mb-1">Check your email</h2>
              <p className="text-gray-500 text-sm">
                We sent a 6-digit code to <span className="text-gray-300">{email}</span>. It expires in 10 minutes.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
              <Input
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-[0.5em] font-bold"
                autoFocus
                maxLength={6}
              />
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full mt-2 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 font-semibold"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : "Verify & Continue"}
              </Button>
            </form>
          </>
        ) : (

        /* ── Auth Form Step ── */
        <>
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
                type="button"
                onClick={() => reset(m)}
                className={`flex-1 pb-3 text-sm font-semibold transition-all duration-200 relative ${
                  mode === m ? "text-white" : "text-gray-500 hover:text-gray-300"
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
            {mode === "signup" && (
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {mode === "signup" ? (
              <Checkbox
                checked={agreed}
                onChange={setAgreed}
                label={
                  <>
                    I agree to the{" "}
                    <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
                    {" "}and{" "}
                    <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
                  </>
                }
              />
            ) : (
              <Checkbox
                checked={rememberMe}
                onChange={setRememberMe}
                label="Remember me for 30 days"
              />
            )}

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={mode === "signup" ? isSignupDisabled : isSigninDisabled}
              className="w-full mt-2 shadow-glow-sm hover:shadow-glow-md transition-all duration-300 font-semibold"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "signup" ? "Sending code..." : "Signing in..."}
                </span>
              ) : (
                mode === "signup" ? "Send Verification Code" : "Sign In"
              )}
            </Button>
          </form>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}
