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
    if (!EMAIL_RE.test(email)) f.email = "Email tidak valid.";
    if (!pass) f.password = "Wajib diisi.";
    if (Object.keys(f).length) { e.preventDefault(); setErrs(f); }
  };
  return (
    <>
      {errMsg && <div className="mt-5 rounded-[10px] bg-[rgba(228,109,76,0.10)] border border-[rgba(228,109,76,0.22)] px-4 py-2.5 text-[13px] text-[#e46d4c]">{errMsg}</div>}
      <form action={login} onSubmit={onSubmit} noValidate className="mt-6 space-y-3.5">
        <label className="block"><span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="kamu@email.com" aria-invalid={!!errs.email} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[14px] ${errs.email ? "!border-[#e46d4c]" : ""}`} />
          {errs.email && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.email}</span>}</label>
        <label className="block"><span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Kata sandi</span>
          <input name="password" type="password" required autoComplete="current-password" placeholder="••••••••" aria-invalid={!!errs.password} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[14px] ${errs.password ? "!border-[#e46d4c]" : ""}`} />
          {errs.password && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.password}</span>}</label>
        <button type="submit" className="w-full mt-1 flash-violet rounded-[6px] py-2.5 text-[14px] font-medium text-white">Continue</button>
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
    if (!EMAIL_RE.test(email)) f.email = "Email tidak valid.";
    if (pass.length < 8) f.password = "Min 8 karakter.";
    if (Object.keys(f).length) { e.preventDefault(); setErrs(f); }
  };
  return (
    <>
      {err && <div className="mt-4 rounded-[10px] bg-[rgba(228,109,76,0.10)] border border-[rgba(228,109,76,0.22)] px-4 py-2.5 text-[13px] text-[#e46d4c]">{err === "invalid" ? "Email/sandi tidak valid. Min 8 karakter." : err}</div>}
      <form action={register} onSubmit={onSubmit} noValidate className="mt-5 space-y-3.5">
        <label className="block"><span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="kamu@email.com" aria-invalid={!!errs.email} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[14px] ${errs.email ? "!border-[#e46d4c]" : ""}`} />
          {errs.email && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.email}</span>}</label>
        <label className="block"><span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Kata sandi</span>
          <input name="password" type="password" required autoComplete="new-password" placeholder="Min 8 karakter" aria-invalid={!!errs.password} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[14px] ${errs.password ? "!border-[#e46d4c]" : ""}`} />
          {errs.password && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.password}</span>}</label>
        <button type="submit" className="w-full mt-1 flash-violet rounded-[6px] py-2.5 text-[14px] font-medium text-white">Continue</button>
      </form>
    </>
  );
}
