"use client";

import React, { useEffect, useState } from "react";
import Background from "@/components/Background";
import FadeIn from "@/components/FadeIn";
import { MessageSquare, Shield, Zap, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phoneCodeHash, setPhoneCodeHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = localStorage.getItem("tg_session");
    if (session) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/telegram/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to send code");
      setPhoneCodeHash(data.phone_code_hash);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/telegram/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneNumber,
          code: otp,
          phone_code_hash: phoneCodeHash,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Invalid code");
      // Store session if needed
      if (data.session_string) {
        localStorage.setItem("tg_session", data.session_string);
      }
      if (data.user) {
        localStorage.setItem("tg_user", JSON.stringify(data.user));
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <Background />

      <div className="z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <FadeIn direction="left">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Telegram Broadcast Pro
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Scale Your <span className="text-blue-500 text-glow">Reach</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-md">
              The most advanced Telegram broadcasting platform. Schedule messages, manage groups, and track analytics in real-time.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Feature icon={<Shield className="w-5 h-5" />} title="Secure" />
              <Feature icon={<TrendingUp className="w-5 h-5" />} title="Growth" />
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="right" delay={0.2}>
          <div className="blue-glass p-8 rounded-2xl shadow-2xl space-y-6">
            <h2 className="text-2xl font-semibold text-center">Get Started</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="12345"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm text-slate-500 hover:text-blue-400 transition-colors"
                >
                  Change phone number
                </button>
              </form>
            )}

            <p className="text-xs text-center text-slate-500">
              By joining, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="absolute bottom-8 text-slate-600 text-sm">
        © 2026 Telegram Broadcast Pro. All rights reserved.
      </div>

      <style jsx>{`
        .text-glow {
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </main>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center space-x-2 text-slate-300">
      <div className="p-2 rounded-lg bg-slate-800/50">
        {icon}
      </div>
      <span className="font-medium">{title}</span>
    </div>
  );
}
