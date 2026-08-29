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
            className={`rounded-full px-4 py-2 text-[13px] font-medium shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center gap-2 ${t.kind === "err" ? "bg-[#1d0a0a] text-[#ffb4a8] border border-[rgba(228,109,76,0.32)]" : "bg-white text-[#05060f]"}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${t.kind === "err" ? "bg-[#e46d4c]" : "bg-[#663af3]"}`} /> {t.msg}
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
  confirmLabel = "Hapus",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  desc?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
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
      <div className="absolute inset-0 bg-[rgba(5,6,15,0.72)] backdrop-blur-[6px]" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-[400px] rounded-[16px] bg-[rgba(5,6,15,0.96)] border border-[rgba(186,215,247,0.12)] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(216,236,248,0.14)]">
        <h3 className="font-medium text-[16px] text-white">{title}</h3>
        {desc && <p className="mt-2 text-[13px] leading-[1.5] text-[#9da7ba]">{desc}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="pill-ghost rounded-full px-4 py-2 text-[13px] font-medium text-white">Batal</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="rounded-full bg-[#e46d4c] text-white px-4 py-2 text-[13px] font-medium hover:bg-[#ea7355] transition-colors">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
