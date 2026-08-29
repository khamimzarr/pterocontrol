"use client";
import { useState } from "react";
import Link from "next/link";

export function MobileMenu({
  links,
}: {
  links: { href: string; label: string; active?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        aria-label={open ? "Tutup menu" : "Buka menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden w-9 h-9 grid place-items-center rounded-full bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)] text-[#d1e4fa] hover:bg-[rgba(186,214,247,0.12)] transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <div className="md:hidden absolute top-[52px] left-0 right-0 bg-[rgba(5,6,15,0.98)] border-b border-[rgba(186,215,247,0.12)] backdrop-blur-[16px] shadow-[0_16px_32px_rgba(0,0,0,0.4)] z-40">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-2.5 rounded-[10px] text-[14px] font-medium transition-colors ${l.active ? "bg-[rgba(199,211,234,0.12)] text-white" : "text-[#c7d3ea] hover:bg-[rgba(186,214,247,0.06)] hover:text-white"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
