export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { addPanel, deletePanel, editPanel } from "@/lib/actions/auth-actions";
import { logout } from "@/lib/actions/auth-actions";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  return (
    <nav className="sticky top-0 z-50 h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold text-[12px] tracking-[0.04em] text-[#1d1d1f]">◈ PteroControl</Link>
        <div className="hidden md:flex gap-6 text-[12px] text-[#1d1d1f]">
          <Link href="/dashboard" className="hover:text-[#707070]">Dasbor</Link>
          <Link href="/panels" className="font-medium text-[#0071e3]">Panel</Link>
          {isAdmin && <Link href="/admin" className="hover:text-[#707070]">Admin</Link>}
          <Link href="/akun" className="hover:text-[#707070]">Akun</Link>
        </div>
        <div className="flex items-center gap-2"><span className="hidden sm:inline text-[11px] text-[#707070] truncate max-w-[120px]">{email}</span><form action={logout}><button className="rounded-full border border-[#d6d6d6] text-[12px] font-medium px-3 py-1.5">Keluar</button></form></div>
      </div>
    </nav>
  );
}

export default async function PanelsPage() {
  const user = await requireApprovedUser();
  const supabase = await createClient();
  const { data: panels } = await supabase.from("linked_panels").select("id, panel_name, panel_url, created_at").eq("user_id", user.id).order("created_at");
  const count = panels?.length ?? 0;
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      <section className="animate-up bg-white border-b border-[#e8e8ed]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8">
          <p className="text-[11px] font-medium tracking-[0.04em] text-[#b64400]">{count} panel</p>
          <h1 className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none text-[#1d1d1f]">Kelola panel-mu.</h1>
          <p className="mt-2 text-[13px] text-[#707070]">URL + Client API key → terenkripsi. Zero-knowledge.</p>
        </div>
      </section>
      <section className="flex-1 py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-4">
          <div className="animate-up-1 rounded-[28px] bg-white p-6 border border-[#e8e8ed] hover-lift">
            <h2 className="font-semibold text-[17px] text-[#1d1d1f]">Tambah panel</h2>
            <p className="text-[11px] text-[#707070]">Pakai Client API key, bukan Application.</p>
            <form action={addPanel} className="mt-4 grid md:grid-cols-3 gap-3">
              <label className="block"><span className="text-[11px] font-medium text-[#1d1d1f]">Nama</span><input name="panelName" required maxLength={100} placeholder="eu-1 · Contabo" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-2.5 text-[13px] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" /></label>
              <label className="block"><span className="text-[11px] font-medium text-[#1d1d1f]">URL</span><input name="panelUrl" type="url" required placeholder="https://panel.contoh.com" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-2.5 text-[13px] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" /></label>
              <label className="block"><span className="text-[11px] font-medium text-[#1d1d1f]">API key</span><input name="apiKey" type="password" required minLength={5} placeholder="ptlc_••••" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-2.5 text-[13px] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" /></label>
              <div className="md:col-span-3 flex items-center gap-2 pt-1"><button type="submit" className="rounded-full bg-[#0071e3] text-white text-[13px] font-medium px-5 py-2 hover:bg-[#0077ed] transition-all hover:scale-[1.02]">Simpan</button><span className="text-[11px] text-[#707070]">Dienkripsi otomatis</span></div>
            </form>
          </div>
          {count === 0 ? (
            <div className="rounded-[28px] bg-white p-8 border border-[#e8e8ed] text-center text-[13px] text-[#707070]">Belum ada panel. Tambah di atas dulu, bung.</div>
          ) : (
            <div className="grid gap-3 stagger">
              {panels!.map((p) => (
                <div key={p.id} className="rounded-[28px] bg-white p-5 border border-[#e8e8ed] hover-lift">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0"><h3 className="font-semibold text-[15px] truncate text-[#1d1d1f]">{p.panel_name}</h3><p className="text-[11px] text-[#707070] truncate">{p.panel_url}</p><p className="text-[11px] text-[#707070]">{new Date(p.created_at).toLocaleDateString("id-ID")} · terenkripsi</p></div>
                    <form action={deletePanel}><input type="hidden" name="id" value={p.id} /><button className="rounded-full bg-[#fff1f0] border border-[#ffd7d5] text-[#b64400] text-[11px] font-medium px-3 py-1.5 hover:bg-[#ffd7d5]">Hapus</button></form>
                  </div>
                  <details className="mt-4 group"><summary className="text-[13px] text-[#0066cc] cursor-pointer">Edit ›</summary>
                    <form action={editPanel} className="mt-3 grid md:grid-cols-3 gap-3 border-t border-[#f5f5f7] pt-3">
                      <input type="hidden" name="id" value={p.id} />
                      <input name="panelName" required defaultValue={p.panel_name} className="rounded-full border border-[#d6d6d6] px-4 py-2 text-[13px] outline-none" />
                      <input name="panelUrl" type="url" required defaultValue={p.panel_url} className="rounded-full border border-[#d6d6d6] px-4 py-2 text-[13px] outline-none" />
                      <input name="apiKey" type="password" required minLength={5} placeholder="ptlc_ baru" className="rounded-full border border-[#d6d6d6] px-4 py-2 text-[13px] outline-none" />
                      <div className="md:col-span-3"><button type="submit" className="rounded-full bg-[#1d1d1f] text-white text-[12px] px-4 py-2">Simpan perubahan</button></div>
                    </form>
                  </details>
                </div>
              ))}
            </div>
          )}
          <div className="rounded-[28px] bg-[#1d1d1f] p-6 text-white flex justify-between items-center gap-4 hover-lift"><p className="font-semibold text-[14px]">Lihat dasbor agregat.</p><Link href="/dashboard" className="shrink-0 rounded-full bg-white text-[#1d1d1f] text-[12px] font-medium px-4 py-2">Buka dasbor</Link></div>
        </div>
      </section>
      <footer className="bg-white border-t border-[#d6d6d6] py-4"><div className="max-w-[1200px] mx-auto px-6 md:px-10 text-[11px] text-[#707070]">© 2025 · AES-256-CBC</div></footer>
    </div>
  );
}
