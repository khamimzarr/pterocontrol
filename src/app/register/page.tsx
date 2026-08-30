"use client";

import Link from "next/link";
import { use } from "react";
import { RegisterForm } from "@/components/auth-forms";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const pending = sp.status === "pending";
  const err = sp.error ? decodeURIComponent(sp.error) : null;
  
  if (pending) {
    // Pending success state
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
            
            <div className="hidden md:flex items-center gap-32">
              <a href="/#features" className="nav-link">Features</a>
              <a href="/#security" className="nav-link">Security</a>
              <a href="/#pricing" className="nav-link">Pricing</a>
            </div>
            
            <div className="nav-actions">
              <Link href="/login" className="btn-secondary">Log In</Link>
            </div>
          </div>
        </nav>
        
        {/* Success State */}
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[500px] text-center">
            {/* Success Icon */}
            <div className="mb-6 inline-flex">
              <div className="w-16 h-16 rounded-full grid place-items-center bg-[#59e25d]/10 border border-[#59e25d] shadow-sm">
                <span className="w-4 h-4 rounded-full bg-[#59e25d] animate-pulse-dot" />
              </div>
            </div>
            
            <p className="hero-badge mb-4">Submitted</p>
            <h1 className="font-hedvig-letters-serif font-bold text-heading-lg leading-none text-deep-ink mb-3">Waiting for approval.</h1>
            <p className="text-slate text-body-sm max-w-md mx-auto mb-8">
              Your status is currently <span className="font-semibold text-deep-ink">PENDING</span>. Admin will review your request shortly.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login" className="btn-primary">Go to Login</Link>
              <Link href="/" className="btn-secondary">Home</Link>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-4 text-center text-caption text-slate">
          © 2026 Pterodactyl Control Panel
        </footer>
      </div>
    );
  }
  
  // Registration form state
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
          
          <div className="hidden md:flex items-center gap-32">
            <a href="/#features" className="nav-link">Features</a>
            <a href="/#security" className="nav-link">Security</a>
            <a href="/#pricing" className="nav-link">Pricing</a>
          </div>
          
          <div className="nav-actions">
            <Link href="/login" className="btn-secondary">Log In</Link>
          </div>
        </div>
      </nav>
      
      {/* Main Content - Registration Form Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          {/* Decorative blob */}
          <div className="blob blob-fuchsia mb-8" style={{ top: "-60px", right: "50%", transform: "translateX(50%)" }} />
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-10 h-10 rounded-full grid place-items-center bg-surface-hi-yellow-accent/20 text-hi-yellow font-bold text-lg shadow-sm">◈</span>
              <span className="hero-badge">Sign Up</span>
            </div>
            <h1 className="font-hedvig-letters-serif font-bold text-heading-lg leading-none text-deep-ink mb-2">Create your account.</h1>
            <p className="text-slate text-body-sm">
              Status will be <span className="font-semibold text-deep-ink">PENDING</span> until admin approves.
            </p>
          </div>
          
          {/* Error Message */}
          {err && (
            <div className="mb-6 rounded-lg bg-[#ffe228]/10 border border-[#ffe228] p-4">
              <p className="text-hi-yellow text-body-sm font-medium">{err}</p>
            </div>
          )}
          
          {/* Registration Form */}
          <RegisterForm err={err} />
          
          {/* Footer Links */}
          <p className="mt-6 text-center text-body-sm text-slate">
            Already have an account?{" "}
            <Link href="/login" className="text-hi-yellow hover:text-deep-ink font-medium inline-flex items-center gap-1 transition-colors">
              Log in →
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
