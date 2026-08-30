"use client";
import { createContext, useCallback, useContext, useState, useEffect } from "react";

type Toast = { id: string; msg: string; kind?: "ok" | "err" };
const Ctx = createContext<{ push: (msg: string, kind?: Toast["kind"]) => void } | null>(null);

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast outside ToastProvider");
  return c;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, kind: Toast["kind"] = "ok") => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{ animation: "copyPop 280ms cubic-bezier(0.16,1,0.3,1)" }}
            className={`rounded-full px-4 py-2.5 text-body-sm font-medium shadow-lg flex items-center gap-2 ${
              t.kind === "err" 
                ? "bg-surface-soft-meadow text-[#e46d4c] border border-[#e46d4c]/30" 
                : "bg-hi-yellow text-deep-ink border border-hi-yellow"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${t.kind === "err" ? "bg-[#e46d4c]" : "bg-hi-yellow"}`} /> {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function ConfirmDialog({
  open,
  title,
  desc,
  confirmLabel = "Delete",
  onConfirm,
  onClose,
  confirmStyle = "danger",
}: {
  open: boolean;
  title: string;
  desc?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmStyle?: "danger" | "primary";
}) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-deep-ink/40 backdrop-blur-[4px]" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-[400px] rounded-[24px] bg-white border border-deep-ink/5 p-6 shadow-lg">
        <div className="w-10 h-10 rounded-full grid place-items-center bg-hi-yellow/20 text-hi-yellow text-lg mb-4">◈</div>
        <h3 className="font-hedvig-letters-serif font-bold text-heading-sm text-deep-ink">{title}</h3>
        {desc && <p className="mt-2 text-body-sm leading-relaxed text-slate">{desc}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost py-2">Cancel</button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`py-2 ${confirmStyle === "danger" ? "rounded-full bg-[#e46d4c] text-white px-5 font-medium hover:bg-[#ea7355] transition-colors" : "btn-primary"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}