"use client";
import { useState } from "react";
import { addPanel, deletePanel, editPanel } from "@/lib/actions/auth-actions";
import { useToast, ConfirmDialog } from "@/components/toast";

function fieldErr(form: FormData, field: string): string | null {
  const v = String(form.get(field) ?? "").trim();
  if (!v) return "This field is required.";
  if (field === "panelUrl") try { new URL(v); if (!v.startsWith("http://") && !v.startsWith("https://")) return "Must be http(s)://"; } catch { return "Invalid URL."; }
  if (field === "apiKey" && v.length < 5) return "Minimum 5 characters.";
  if (field === "panelName" && v.length > 100) return "Maximum 100 characters.";
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
    if (hasErr) { e.preventDefault(); setErrs(fields); push("Check the form.", "err"); return; }
    setPending(true);
    setErrs({});
  };
  return (
    <form action={addPanel} onSubmit={onSubmit} noValidate className="grid md:grid-cols-3 gap-4">
      <label className="block">
        <span className="text-caption font-semibold tracking-wide uppercase text-slate">Name</span>
        <input name="panelName" required maxLength={100} placeholder="eu-1" aria-invalid={!!errs.panelName} className={`input-pill mt-2 w-full py-3 ${errs.panelName ? "!border-[#e46d4c]" : ""}`} />
        {errs.panelName && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.panelName}</span>}
      </label>
      <label className="block">
        <span className="text-caption font-semibold tracking-wide uppercase text-slate">URL</span>
        <input name="panelUrl" type="url" required placeholder="https://panel.example.com" aria-invalid={!!errs.panelUrl} className={`input-pill mt-2 w-full py-3 ${errs.panelUrl ? "!border-[#e46d4c]" : ""}`} />
        {errs.panelUrl && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.panelUrl}</span>}
      </label>
      <label className="block">
        <span className="text-caption font-semibold tracking-wide uppercase text-slate">API Key</span>
        <input name="apiKey" type="password" required minLength={5} placeholder="ptlc_••••" aria-invalid={!!errs.apiKey} className={`input-pill mt-2 w-full py-3 ${errs.apiKey ? "!border-[#e46d4c]" : ""}`} />
        {errs.apiKey && <span className="mt-1 block text-caption text-[#e46d4c]">{errs.apiKey}</span>}
      </label>
      <div className="md:col-span-3 flex items-center gap-3 pt-1">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Saving..." : "Save Panel"}</button>
        <span className="text-caption text-slate">AES-256 · Press Enter to save</span>
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
    <form action={editPanel} onSubmit={onSubmit} noValidate className="grid md:grid-cols-3 gap-4 border-t border-deep-ink/5 pt-4">
      <input type="hidden" name="id" value={id} />
      <label className="block"><input name="panelName" required defaultValue={name} placeholder="Name" aria-invalid={!!errs.panelName} className={`input-pill w-full py-3 ${errs.panelName ? "!border-[#e46d4c]" : ""}`} />{errs.panelName && <span className="text-caption text-[#e46d4c]">{errs.panelName}</span>}</label>
      <label className="block"><input name="panelUrl" type="url" required defaultValue={url} placeholder="URL" aria-invalid={!!errs.panelUrl} className={`input-pill w-full py-3 ${errs.panelUrl ? "!border-[#e46d4c]" : ""}`} />{errs.panelUrl && <span className="text-caption text-[#e46d4c]">{errs.panelUrl}</span>}</label>
      <label className="block"><input name="apiKey" type="password" required minLength={5} placeholder="ptlc_ new" aria-invalid={!!errs.apiKey} className={`input-pill w-full py-3 ${errs.apiKey ? "!border-[#e46d4c]" : ""}`} />{errs.apiKey && <span className="text-caption text-[#e46d4c]">{errs.apiKey}</span>}</label>
      <div className="md:col-span-3"><button type="submit" className="btn-secondary">Save Changes</button></div>
    </form>
  );
}

export function DeletePanelButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-full bg-[#e46d4c]/10 border border-[#e46d4c]/30 text-[#e46d4c] text-caption font-medium px-4 py-2 hover:bg-[#e46d4c]/16 transition-colors">Delete</button>
      <ConfirmDialog
        open={open}
        title={`Delete ${name}?`}
        desc="The encrypted API key will be permanently removed."
        confirmLabel="Delete"
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

export function ServerControlForm({ server }: { server: any }) {
  const isOnline = server.state === "online";
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <button 
        type="submit" 
        name="action" 
        value="start" 
        disabled={!isOnline}
        className={`btn-primary py-2.5 ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Start Server
      </button>
      
      <button 
        type="submit" 
        name="action" 
        value="stop"
        className="btn-secondary py-2.5"
      >
        Stop Server
      </button>
      
      <button 
        type="submit" 
        name="action" 
        value="restart"
        className="col-span-2 btn-ghost py-2.5"
      >
        Restart Server
      </button>
    </div>
  );
}