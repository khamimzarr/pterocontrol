export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { aggregatePanels, type FetchPanelResult } from "@/lib/pterodactyl";
import { logout } from "@/lib/actions/auth-actions";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  return (
    <nav className="sticky top-0 z-50 h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">◈ PteroControl</Link>
        <div className="hidden md:flex items-center gap-6 text-[12px] tracking-[-0.12px] text-[#1d1d1f]">
          <Link href="/dashboard" className="font-medium text-[#0071e3]">Dasbor</Link>
          <Link href="/panels" className="hover:text-[#707070]">Panel</Link>
          {isAdmin && <Link href="/admin" className="hover:text-[#707070]">Admin</Link>}
          <Link href="/akun" className="hover:text-[#707070]">Akun</Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-[#707070] truncate max-w-[140px]">{email}</span>
          <form action={logout}><button className="rounded-full border border-[#d6d6d6] text-[12px] font-medium px-3 py-1.5 hover:bg-[#f5f5f7]">Keluar</button></form>
        </div>
      </div>
    </nav>
  );
}

export default async function DashboardPage() {
  const user = await requireApprovedUser();
  const supabase = await createClient();
  const { data: panels } = await supabase.from("linked_panels").select("id, panel_name, panel_url, encrypted_api_key").eq("user_id", user.id).order("created_at");
  const hasPanels = panels && panels.length > 0;
  let results: FetchPanelResult[] = [];
  let total = 0, ok = 0;
  if (hasPanels) {
    const withKeys = panels.map((p) => { try { return { id: p.id, panelName: p.panel_name, panelUrl: p.panel_url, apiKey: decrypt(p.encrypted_api_key) }; } catch { return null; } }).filter(Boolean) as never[];
    results = await aggregatePanels(withKeys as never);
    const failed = panels.length - (withKeys as never[]).length;
    if (failed > 0) for (const p of panels) try { decrypt(p.encrypted_api_key); } catch (e) { results.push({ panelId: p.id, panelName: p.panel_name, panelUrl: p.panel_url, ok: false, error: e instanceof Error ? e.message : "Gagal dekripsi", servers: [] }); }
    total = results.reduce((a, r) => a + r.servers.length, 0);
    ok = results.filter((r) => r.ok).length;
  }
  const all = results.flatMap((r) => r.servers);
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      <section className="animate-up bg-white border-b border-[#e8e8ed]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8">
          <p className="text-[11px] font-medium tracking-[0.04em] text-[#b64400]">Dasbor · Agregator</p>
          <h1 className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[28px] md:text-[32px] leading-none text-[#1d1d1f]">Semua server-mu, satu tempat.</h1>
          <p className="mt-2 text-[13px] text-[#707070]">
            {hasPanels ? `${panels!.length} panel · ${ok} online · ${total} server` : "Belum ada panel. Tambahkan dulu, bung."}
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/panels" className="rounded-full bg-[#0071e3] text-white text-[13px] font-medium px-5 py-2 hover:bg-[#0077ed] transition-all hover:scale-[1.02]">Kelola Panel</Link>
            {!hasPanels && <span className="rounded-full bg-[#f5f5f7] border border-[#e8e8ed] text-[11px] text-[#707070] px-3 py-2">Tips: pakai Client API key</span>}
          </div>
        </div>
      </section>
      <section className="bg-[#f5f5f7] py-6 flex-1">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          {!hasPanels ? (
            <div className="animate-up-1 rounded-[28px] bg-white p-8 border border-[#e8e8ed] text-center hover-lift">
              <p className="text-[11px] tracking-[0.04em] text-[#707070]">Kosong</p>
              <h2 className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[18px] text-[#1d1d1f]">Hubungkan panel pertamamu</h2>
              <p className="mt-1 text-[13px] text-[#707070]">URL + Client API key → terenkripsi AES-256-CBC.</p>
              <Link href="/panels" className="mt-4 inline-flex rounded-full bg-[#0071e3] text-white text-[13px] font-medium px-5 py-2 hover:bg-[#0077ed]">Tambah Panel ›</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger">
                <div className="rounded-[28px] bg-white p-5 border border-[#e8e8ed] hover-lift"><p className="text-[11px] tracking-[0.04em] text-[#707070]">Panel</p><p className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] text-[#1d1d1f]">{panels!.length}</p><p className="text-[11px] text-[#707070]">{ok} online</p></div>
                <div className="rounded-[28px] bg-white p-5 border border-[#e8e8ed] hover-lift"><p className="text-[11px] tracking-[0.04em] text-[#707070]">Server</p><p className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] text-[#1d1d1f]">{total}</p><p className="text-[11px] text-[#707070]">tergabung</p></div>
                <div className="rounded-[28px] bg-[#1d1d1f] p-5 text-white hover-lift"><p className="text-[11px] text-white/60">Status</p><p className="font-semibold text-[17px]">{ok === panels!.length ? "Semua Oke" : `${panels!.length - ok} error`}</p><p className="text-[11px] text-white/60">anti-nge-hang</p></div>
                <div className="rounded-[28px] bg-white p-5 border border-[#e8e8ed] hover-lift"><p className="text-[11px] tracking-[0.04em] text-[#707070]">Enkripsi</p><p className="font-semibold text-[17px] text-[#1d1d1f]">AES-256</p><p className="text-[11px] text-[#707070]">zero-knowledge</p></div>
              </div>
              <div className="mt-4 grid md:grid-cols-3 gap-3 stagger">
                {results.map((r) => (
                  <div key={r.panelId} className="rounded-[28px] bg-white p-5 border border-[#e8e8ed] hover-lift">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0"><p className="font-medium text-[13px] truncate text-[#1d1d1f]">{r.panelName}</p><p className="text-[11px] text-[#707070] truncate">{r.panelUrl}</p></div>
                      <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${r.ok ? "bg-[#f5f5f7] border border-[#e8e8ed]" : "bg-[#fff1f0] text-[#b64400] border border-[#ffd7d5]"}`}><span className={`w-1.5 h-1.5 rounded-full ${r.ok ? "bg-[#0071e3] animate-pulse-dot" : "bg-[#b64400]"}`} />{r.ok ? `${r.servers.length} srv` : "Error"}</span>
                    </div>
                    {!r.ok && r.error && <p className="mt-2 text-[11px] text-[#b64400] break-words">{r.error}</p>}
                  </div>
                ))}
              </div>
              <div className="animate-up mt-4 rounded-[28px] bg-white border border-[#e8e8ed] overflow-hidden hover-lift">
                <div className="px-6 py-4 border-b border-[#e8e8ed] flex justify-between"><h2 className="font-semibold text-[15px] text-[#1d1d1f]">Server</h2><span className="text-[11px] text-[#707070]">{all.length} baris</span></div>
                {all.length === 0 ? (
                  <div className="px-6 py-8 text-center text-[13px] text-[#707070]">Belum kebaca. Cek Client API key-mu, bung. <Link href="/panels" className="text-[#0066cc] hover:underline"> Cek panel ›</Link></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="bg-[#fafafc] text-[11px] tracking-[0.04em] text-[#707070] border-b border-[#e8e8ed]"><th className="px-6 py-2.5 font-medium">Server</th><th className="px-4 py-2.5 font-medium">Panel</th><th className="px-4 py-2.5 font-medium">Node</th><th className="px-4 py-2.5 font-medium">RAM</th><th className="px-4 py-2.5 font-medium">CPU</th><th className="px-6 py-2.5 font-medium">ID</th></tr></thead>
                      <tbody className="divide-y divide-[#f5f5f7]">{all.map((s) => (<tr key={`${s.panelId}-${s.identifier}`} className="hover:bg-[#f5f5f7]/60"><td className="px-6 py-3 text-[13px] font-medium text-[#1d1d1f] truncate max-w-[180px]">{s.name}</td><td className="px-4 py-3 text-[12px] text-[#474747]">{s.panelName}</td><td className="px-4 py-3 text-[12px] text-[#707070]">{s.node ?? "—"}</td><td className="px-4 py-3 text-[12px] text-[#1d1d1f]">{s.memoryLimit != null ? `${s.memoryLimit} MB` : "—"}</td><td className="px-4 py-3 text-[12px] text-[#1d1d1f]">{s.cpuLimit != null ? `${s.cpuLimit}%` : "—"}</td><td className="px-6 py-3 font-mono text-[11px] text-[#707070]">{s.identifier}</td></tr>))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
      <footer className="bg-[#f5f5f7] border-t border-[#d6d6d6] py-4"><div className="max-w-[1200px] mx-auto px-6 md:px-10 text-[11px] text-[#707070]">© 2025 PteroControl · RLS · AES-256</div></footer>
    </div>
  );
}
