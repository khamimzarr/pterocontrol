"use client";
import { useState } from "react";
import { login, register } from "@/lib/actions/auth-actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm({ errMsg }: { errMsg?: string | null }) {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const pass = String(fd.get("password") ?? "");
    const f: Record<string, string> = {};
    if (!EMAIL_RE.test(email)) f.email = "Invalid email address.";
    if (!pass) f.password = "Password is required.";
    if (Object.keys(f).length) { e.preventDefault(); setErrs(f); }
  };
  return (
    <>
      {errMsg && <div className="mt-5 rounded-lg bg-[#ffe228]/10 border border-[#ffe228] px-4 py-3 text-body-sm text-deep-ink">{errMsg}</div>}
      <form action={login} onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
        <label className="block">
          <span className="text-caption font-semibold tracking-wide uppercase text-slate">Email Address</span>
          <input 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            placeholder="you@email.com" 
            aria-invalid={!!errs.email} 
            className={`input-pill mt-2 w-full ${errs.email ? "!border-[#e46d4c]" : ""}`} 
          />
          {errs.email && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.email}</span>}
        </label>
        
        <label className="block">
          <span className="text-caption font-semibold tracking-wide uppercase text-slate">Password</span>
          <input 
            name="password" 
            type="password" 
            required 
            autoComplete="current-password" 
            placeholder="••••••••" 
            aria-invalid={!!errs.password} 
            className={`input-pill mt-2 w-full ${errs.password ? "!border-[#e46d4c]" : ""}`} 
          />
          {errs.password && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.password}</span>}
        </label>
        
        <button 
          type="submit" 
          className="w-full mt-2 btn-primary py-3 text-body-sm"
        >
          Continue
        </button>
      </form>
    </>
  );
}

export function RegisterForm({ err }: { err?: string | null }) {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const pass = String(fd.get("password") ?? "");
    const f: Record<string, string> = {};
    if (!EMAIL_RE.test(email)) f.email = "Invalid email address.";
    if (pass.length < 8) f.password = "Minimum 8 characters.";
    if (Object.keys(f).length) { e.preventDefault(); setErrs(f); }
  };
  return (
    <>
      {err && <div className="mt-4 rounded-lg bg-[#ffe228]/10 border border-[#ffe228] px-4 py-3 text-body-sm text-deep-ink">
        {err === "invalid" ? "Invalid email or password. Must be at least 8 characters." : err}
      </div>}
      
      <form action={register} onSubmit={onSubmit} noValidate className="mt-5 space-y-4">
        <label className="block">
          <span className="text-caption font-semibold tracking-wide uppercase text-slate">Email Address</span>
          <input 
            name="email" 
            type="email" 
            required 
            autoComplete="email" 
            placeholder="you@email.com" 
            aria-invalid={!!errs.email} 
            className={`input-pill mt-2 w-full ${errs.email ? "!border-[#e46d4c]" : ""}`} 
          />
          {errs.email && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.email}</span>}
        </label>
        
        <label className="block">
          <span className="text-caption font-semibold tracking-wide uppercase text-slate">Password</span>
          <input 
            name="password" 
            type="password" 
            required 
            autoComplete="new-password" 
            placeholder="Min 8 characters" 
            aria-invalid={!!errs.password} 
            className={`input-pill mt-2 w-full ${errs.password ? "!border-[#e46d4c]" : ""}`} 
          />
          {errs.password && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.password}</span>}
        </label>
        
        <button 
          type="submit" 
          className="w-full mt-2 btn-primary py-3 text-body-sm"
        >
          Create Account
        </button>
      </form>
    </>
  );
}
