"use client";

import Link from "next/link";
import { use } from "react";
import { LoginForm } from "@/components/auth-forms";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const errMsg = sp.error ? (decodeURIComponent(sp.error) === "rejected" ? "Account rejected. Contact admin." : decodeURIComponent(sp.error)) : null;
  
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M16 2C12 2 9 4 8 7c-2 5 1 9 4 11 1 1 3 1 5 1s4-1 5-2c2-2 3-5 2-8-1-3-4-5-8-5z" fill="#ffe228"/>
              <circle cx="16" cy="18" r="3" fill="#130e30"/>
            </svg>
            Pterodactyl
          </Link>
          
          <nav className="hidden md:flex items-center gap-32">
            <a href="/#features" className="nav-link">Features</a>
            <a href="/#security" className="nav-link">Security</a>
            <a href="/#pricing" className="nav-link">Pricing</a>
          </nav>
          
          <div className="nav-actions">
            <Link href="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>
      
      {/* Main Content - Login Form Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          {/* Decorative blob */}
          <div className="blob blob-yellow mb-8" style={{ top: "-60px", left: "50%", transform: "translateX(-50%)" }} />
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-10 h-10 rounded-full grid place-items-center bg-surface-hi-yellow-accent/20 text-hi-yellow font-bold text-lg shadow-sm">◈</span>
              <span className="hero-badge">Sign In</span>
            </div>
            <h1 className="font-hedvig-letters-serif font-bold text-heading-lg leading-none text-deep-ink mb-2">Welcome back.</h1>
            <p className="text-slate text-body-sm">Need APPROVED status to access panels.</p>
          </div>
          
          {/* Error Message */}
          {errMsg && (
            <div className="mb-6 rounded-lg bg-[#ffe228]/10 border border-[#ffe228] p-4">
              <p className="text-hi-yellow text-body-sm font-medium">{errMsg}</p>
            </div>
          )}
          
          {/* Login Form */}
          <LoginForm errMsg={errMsg} />
          
          {/* Footer Links */}
          <p className="mt-6 text-center text-body-sm text-slate">
            Don't have an account?{" "}
            <Link href="/register" className="text-hi-yellow hover:text-deep-ink font-medium inline-flex items-center gap-1 transition-colors">
              Register now →
            </Link>
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-4 text-center text-caption text-slate">
        © 2026 Pterodactyl Control Panel
      </footer>
    </div>
  );
}
