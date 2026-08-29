"use client";
import { useState } from "react";
import { changePassword } from "@/lib/actions/auth-actions";

export function AkunForm() {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const p1 = String(fd.get("newPassword") ?? "");
    const p2 = String(fd.get("confirmPassword") ?? "");
    const f: Record<string, string> = {};
    if (p1.length < 8) f.newPassword = "Min 8 karakter.";
    if (p2 !== p1) f.confirmPassword = "Tidak cocok.";
    if (Object.keys(f).length) { e.preventDefault(); setErrs(f); }
  };
  return (
    <form action={changePassword} onSubmit={onSubmit} noValidate className="mt-5 space-y-3">
      <label className="block">
        <span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Baru</span>
        <input name="newPassword" type="password" required minLength={8} placeholder="••••••••" aria-invalid={!!errs.newPassword} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[14px] ${errs.newPassword ? "!border-[#e46d4c]" : ""}`} />
        {errs.newPassword && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.newPassword}</span>}
      </label>
      <label className="block">
        <span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Ulangi</span>
        <input name="confirmPassword" type="password" required minLength={8} placeholder="••••••••" aria-invalid={!!errs.confirmPassword} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[14px] ${errs.confirmPassword ? "!border-[#e46d4c]" : ""}`} />
        {errs.confirmPassword && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.confirmPassword}</span>}
      </label>
      <button type="submit" className="w-full flash-violet rounded-[6px] py-2.5 text-[14px] font-medium text-white">Continue</button>
    </form>
  );
}
