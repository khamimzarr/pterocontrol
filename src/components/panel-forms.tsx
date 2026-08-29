"use client";
import { useState } from "react";
import { addPanel, deletePanel, editPanel } from "@/lib/actions/auth-actions";
import { useToast, ConfirmDialog } from "@/components/toast";

function fieldErr(form: FormData, field: string): string | null {
  const v = String(form.get(field) ?? "").trim();
  if (!v) return "Wajib diisi.";
  if (field === "panelUrl") try { new URL(v); if (!v.startsWith("http://") && !v.startsWith("https://")) return "Harus http(s)://"; } catch { return "URL tidak valid."; }
  if (field === "apiKey" && v.length < 5) return "Min 5 karakter.";
  if (field === "panelName" && v.length > 100) return "Maks 100 karakter.";
  return null;
}

export function AddPanelForm() {
  const { push } = useToast();
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const fields: Record<string, string> = {};
    let hasErr = false;
    for (const f of ["panelName", "panelUrl", "apiKey"]) {
      const er = fieldErr(fd, f);
      if (er) { fields[f] = er; hasErr = true; }
    }
    if (hasErr) { e.preventDefault(); setErrs(fields); push("Periksa form.", "err"); return; }
    setPending(true);
    setErrs({});
  };
  return (
    <form action={addPanel} onSubmit={onSubmit} noValidate className="mt-5 grid md:grid-cols-3 gap-3">
      <label className="block">
        <span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Nama</span>
        <input name="panelName" required maxLength={100} placeholder="eu-1" aria-invalid={!!errs.panelName} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[13px] ${errs.panelName ? "!border-[#e46d4c]" : ""}`} />
        {errs.panelName && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.panelName}</span>}
      </label>
      <label className="block">
        <span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">URL</span>
        <input name="panelUrl" type="url" required placeholder="https://panel.contoh.com" aria-invalid={!!errs.panelUrl} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[13px] ${errs.panelUrl ? "!border-[#e46d4c]" : ""}`} />
        {errs.panelUrl && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.panelUrl}</span>}
      </label>
      <label className="block">
        <span className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">API key</span>
        <input name="apiKey" type="password" required minLength={5} placeholder="ptlc_••••" aria-invalid={!!errs.apiKey} className={`auth-input mt-1.5 w-full px-3 py-2.5 text-[13px] ${errs.apiKey ? "!border-[#e46d4c]" : ""}`} />
        {errs.apiKey && <span className="mt-1 block text-[11px] text-[#e46d4c]">{errs.apiKey}</span>}
      </label>
      <div className="md:col-span-3 flex items-center gap-3 pt-1">
        <button type="submit" disabled={pending} className="flash-violet rounded-[6px] px-5 py-2.5 text-[13px] font-medium text-white disabled:opacity-60">{pending ? "Menyimpan…" : "Continue"}</button>
        <span className="text-[11px] text-[#9da7ba]">AES-256 · Enter untuk simpan</span>
      </div>
    </form>
  );
}

export function EditPanelForm({ id, name, url }: { id: string; name: string; url: string }) {
  const [errs, setErrs] = useState<Record<string, string>>({});
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const fd = new FormData(e.currentTarget);
    const fields: Record<string, string> = {};
    let bad = false;
    for (const f of ["panelName", "panelUrl", "apiKey"]) {
      const er = fieldErr(fd, f);
      if (er) { fields[f] = er; bad = true; }
    }
    if (bad) { e.preventDefault(); setErrs(fields); }
  };
  return (
    <form action={editPanel} onSubmit={onSubmit} noValidate className="mt-3 grid md:grid-cols-3 gap-3 border-t border-[rgba(186,215,247,0.08)] pt-3">
      <input type="hidden" name="id" value={id} />
      <label className="block"><input name="panelName" required defaultValue={name} placeholder="Nama" aria-invalid={!!errs.panelName} className={`auth-input w-full px-3 py-2.5 text-[13px] ${errs.panelName ? "!border-[#e46d4c]" : ""}`} />{errs.panelName && <span className="text-[11px] text-[#e46d4c]">{errs.panelName}</span>}</label>
      <label className="block"><input name="panelUrl" type="url" required defaultValue={url} placeholder="URL" aria-invalid={!!errs.panelUrl} className={`auth-input w-full px-3 py-2.5 text-[13px] ${errs.panelUrl ? "!border-[#e46d4c]" : ""}`} />{errs.panelUrl && <span className="text-[11px] text-[#e46d4c]">{errs.panelUrl}</span>}</label>
      <label className="block"><input name="apiKey" type="password" required minLength={5} placeholder="ptlc_ baru" aria-invalid={!!errs.apiKey} className={`auth-input w-full px-3 py-2.5 text-[13px] ${errs.apiKey ? "!border-[#e46d4c]" : ""}`} />{errs.apiKey && <span className="text-[11px] text-[#e46d4c]">{errs.apiKey}</span>}</label>
      <div className="md:col-span-3"><button type="submit" className="pill-ghost rounded-full px-4 py-2 text-[12px] font-medium text-white">Simpan</button></div>
    </form>
  );
}

export function DeletePanelButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-full bg-[rgba(228,109,76,0.10)] border border-[rgba(228,109,76,0.20)] text-[#e46d4c] text-[11px] font-medium px-3 py-1.5 hover:bg-[rgba(228,109,76,0.16)] transition-colors">Hapus</button>
      <ConfirmDialog
        open={open}
        title={`Hapus ${name}?`}
        desc="API key terenkripsi akan terhapus. Tidak bisa dibatalkan."
        confirmLabel="Hapus"
        onClose={() => setOpen(false)}
        onConfirm={() => {
          const fd = new FormData();
          fd.set("id", id);
          deletePanel(fd);
        }}
      />
    </>
  );
}
