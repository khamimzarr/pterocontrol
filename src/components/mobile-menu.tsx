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
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="md:hidden w-10 h-10 grid place-items-center rounded-full bg-surface-canvas border border-deep-ink/5 text-deep-ink hover:bg-surface-soft-meadow transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      
      {open && (
        <div className="md:hidden absolute top-[60px] left-0 right-0 bg-surface-soft-meadow border-b border-deep-ink/5 backdrop-blur-lg shadow-lg z-50">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg text-body font-medium transition-colors ${
                  l.active 
                    ? "bg-surface-canvas text-deep-ink font-semibold" 
                    : "text-slate hover:bg-white hover:text-deep-ink"
                }`}
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
