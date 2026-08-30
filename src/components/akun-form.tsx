"use client";
import { useState } from "react";
import { changePassword } from "@/lib/actions/auth-actions";

export function AkunForm({ user, success, error }: { user?: any; success?: boolean; error?: string | null }) {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const p1 = String(fd.get("newPassword") ?? "");
    const p2 = String(fd.get("confirmPassword") ?? "");
    const f: Record<string, string> = {};
    if (p1.length < 8) f.newPassword = "Minimum 8 characters required.";
    if (p2 !== p1) f.confirmPassword = "Passwords do not match.";
    if (Object.keys(f).length) { e.preventDefault(); setErrs(f); }
  };
  
  return (
    <>
      {success && (
        <div className="mb-6 rounded-lg bg-[#59e25d]/10 border border-[#59e25d] px-4 py-3">
          <p className="text-[#59e25d] text-body-sm font-medium">✓ Changes saved successfully!</p>
        </div>
      )}
      {error && !success && (
        <div className="mb-6 rounded-lg bg-hi-yellow/10 border border-hi-yellow px-4 py-3">
          <p className="text-deep-ink text-body-sm font-medium">⚠ {error}</p>
        </div>
      )}
    <form action={changePassword} onSubmit={onSubmit} noValidate className="space-y-4">
      <label className="block">
        <span className="text-caption font-semibold tracking-wide uppercase text-slate">New Password</span>
        <input 
          name="newPassword" 
          type="password" 
          required 
          minLength={8} 
          placeholder="••••••••" 
          aria-invalid={!!errs.newPassword} 
          className={`input-pill mt-2 w-full ${errs.newPassword ? "!border-[#e46d4c]" : ""}`} 
        />
        {errs.newPassword && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.newPassword}</span>}
      </label>
      
      <label className="block">
        <span className="text-caption font-semibold tracking-wide uppercase text-slate">Confirm Password</span>
        <input 
          name="confirmPassword" 
          type="password" 
          required 
          minLength={8} 
          placeholder="••••••••" 
          aria-invalid={!!errs.confirmPassword} 
          className={`input-pill mt-2 w-full ${errs.confirmPassword ? "!border-[#e46d4c]" : ""}`} 
        />
        {errs.confirmPassword && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.confirmPassword}</span>}
      </label>
      
      <button 
        type="submit" 
        className="w-full btn-primary py-3 mt-2"
      >
        Save Changes
      </button>
    </form>
    </>
  );
}
