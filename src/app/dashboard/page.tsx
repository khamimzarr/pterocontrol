export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { aggregatePanels, type FetchPanelResult } from "@/lib/pterodactyl";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { DashboardTable } from "@/components/dashboard-table";
import { RealtimePanels } from "@/components/realtime";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  const links = [
    { href: "/dashboard", label: "Dasbor", active: true },
    { href: "/panels", label: "Panel" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/akun", label: "Akun" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between gap-2">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] shadow-[0_0_10px_rgba(102,58,243,0.8)] animate-shimmer-dot" /></span>
          <span className="font-medium text-[15px] text-[#d1e4fa]">PteroControl</span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium text-[#c7d3ea] bg-[rgba(199,211,234,0.10)] border border-[rgba(186,215,247,0.06)]">dasbor</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Dasbor</Link>
          <Link href="/panels" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Panel</Link>
          {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Admin</Link>}
          <Link href="/akun" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Akun</Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-[#9da7ba] truncate max-w-[140px]">{email}</span>
          <form action={logout} className="hidden sm:block"><button className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Keluar</button></form>
          <MobileMenu links={links} />
        </div>
      </div>
    </header>
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
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      <RealtimePanels userId={user.id} />
      <section className="relative overflow-hidden border-b border-[rgba(186,215,247,0.06)]">
        <div className="absolute inset-0 bg-grid opacity-[0.22] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-7">
          <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Dasbor</p>
          <h1 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[26px] md:text-[30px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Semua server.</h1>
          <p className="mt-2 text-[13px] text-[#9da7ba]">{hasPanels ? `${panels!.length} panel · ${ok}/${panels!.length} online · ${total} server` : "Belum ada panel."}</p>
          <div className="mt-4 flex gap-2 flex-wrap"><Link href="/panels" className="flash-violet rounded-full px-5 py-2 text-[13px] font-medium text-white">Kelola Panel</Link>{!hasPanels && <span className="inline-flex items-center rounded-full bg-[rgba(199,211,234,0.08)] border border-[rgba(186,215,247,0.08)] text-[11px] text-[#9da7ba] px-3 py-2">Client API key</span>}</div>
        </div>
      </section>
      <section className="flex-1 py-6 bg-[#05060f]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10">
          {!hasPanels ? (
            <div className="rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.10)] p-8 text-center">
              <div className="w-10 h-10 mx-auto rounded-full grid place-items-center bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.10)]"><span className="w-2 h-2 rounded-full bg-[#663af3] animate-pulse-dot" /></div>
              <p className="mt-3 text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Kosong</p>
              <h2 className="mt-1 font-medium text-[16px] text-white">Belum ada panel.</h2>
              <p className="mt-1 text-[13px] text-[#9da7ba]">Tambah URL + API key.</p>
              <Link href="/panels" className="mt-4 inline-flex flash-violet rounded-full px-5 py-2 text-[13px] font-medium text-white">Tambah →</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="glass-card rounded-[16px] p-5"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Panel</p><p className="font-[var(--font-aeonikpro)] font-medium text-[28px] leading-none text-white mt-1">{panels!.length}</p><p className="text-[11px] text-[#9da7ba]">{ok} online</p></div>
                <div className="glass-card rounded-[16px] p-5"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Server</p><p className="font-[var(--font-aeonikpro)] font-medium text-[28px] leading-none text-white mt-1">{total}</p><p className="text-[11px] text-[#9da7ba]">{total === 0 ? "—" : "total"}</p></div>
                <div className="rounded-[16px] bg-[#663af3] p-5 text-white shadow-[0_8px_24px_rgba(102,58,243,0.35)]"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-white/70">Status</p><p className="font-medium text-[15px] mt-1">{ok === panels!.length ? "Semua oke" : `${panels!.length - ok} error`}</p><p className="text-[11px] text-white/70">{ok === panels!.length ? "—" : "cek panel"}</p></div>
                <div className="glass-card rounded-[16px] p-5"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Enkripsi</p><p className="font-medium text-[15px] text-white mt-1">AES-256</p><p className="text-[11px] text-[#9da7ba]">CBC</p></div>
              </div>
              <div className="mt-4 grid md:grid-cols-3 gap-3">
                {results.map((r) => (
                  <div key={r.panelId} className="glass-card rounded-[16px] p-5">
                    <div className="flex justify-between gap-3"><div className="min-w-0"><p className="font-medium text-[13px] truncate text-white">{r.panelName}</p><p className="text-[11px] text-[#9da7ba] truncate">{r.panelUrl}</p></div><span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${r.ok ? "bg-[rgba(199,211,234,0.10)] text-[#d1e4fa] border-[rgba(186,215,247,0.08)]" : "bg-[rgba(228,109,76,0.12)] text-[#e46d4c] border-[rgba(228,109,76,0.22)]"}`}><span className={`w-1.5 h-1.5 rounded-full ${r.ok ? "bg-[#663af3] animate-pulse-dot" : "bg-[#e46d4c]"}`} />{r.ok ? `${r.servers.length}` : "Error"}</span></div>
                    {!r.ok && r.error && <p className="mt-2 text-[11px] text-[#e46d4c] break-words">{r.error}</p>}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <DashboardTable servers={all} />
              </div>
            </>
          )}
        </div>
      </section>
      <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4"><div className="mx-auto max-w-[1200px] px-6 md:px-10 text-[11px] text-[#9da7ba]">© 2025 PteroControl · RLS · Live via Realtime</div></footer>
    </div>
  );
}
