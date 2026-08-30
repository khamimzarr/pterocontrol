export const dynamic = "force-dynamic";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { aggregatePanels, type FetchPanelResult, type AggregatedServer } from "@/lib/pterodactyl";
import { logout } from "@/lib/actions/auth-actions";
import { syncServers } from "@/lib/actions/server-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { DashboardTable } from "@/components/dashboard-table";
import { RealtimePanels } from "@/components/realtime";

const PREVIEW_SERVERS: AggregatedServer[] = [
  { panelId: "pv-eu", panelName: "eu-1", panelUrl: "https://panel.eu.example", identifier: "a1b2c3d4", name: "survival-01", node: "eu-node-1", memoryLimit: 2048, cpuLimit: 120 },
  { panelId: "pv-eu", panelName: "eu-1", panelUrl: "https://panel.eu.example", identifier: "e5f6g7h8", name: "creative-02", node: "eu-node-1", memoryLimit: 4096, cpuLimit: 200 },
  { panelId: "pv-us", panelName: "us-2", panelUrl: "https://panel.us.example", identifier: "i9j0k1l2", name: "lobby-us-02", node: "us-node-2", memoryLimit: 1024, cpuLimit: 80 },
  { panelId: "pv-us", panelName: "us-2", panelUrl: "https://panel.us.example", identifier: "m3n4o5p6", name: "minigame-03", node: "us-node-2", memoryLimit: 2048, cpuLimit: 150 },
  { panelId: "pv-asia", panelName: "asia", panelUrl: "https://panel.asia.example", identifier: "q7r8s9t0", name: "modpack-asia", node: "asia-node-1", memoryLimit: 8192, cpuLimit: 300 },
  { panelId: "pv-asia", panelName: "asia", panelUrl: "https://panel.asia.example", identifier: "u1v2w3x4", name: "vanilla-asia", node: "asia-node-1", memoryLimit: 1024, cpuLimit: 100 },
];

const PREVIEW_RESULTS: FetchPanelResult[] = [
  { panelId: "pv-eu", panelName: "eu-1", panelUrl: "https://panel.eu.example", ok: true, servers: PREVIEW_SERVERS.filter((s) => s.panelName === "eu-1") },
  { panelId: "pv-us", panelName: "us-2", panelUrl: "https://panel.us.example", ok: true, servers: PREVIEW_SERVERS.filter((s) => s.panelName === "us-2") },
  { panelId: "pv-asia", panelName: "asia", panelUrl: "https://panel.asia.example", ok: false, error: "Contoh — panel tidak terjangkau (pratinjau)", servers: [] },
];

function TopNav({ email, isAdmin, isPreview }: { email?: string | null; isAdmin?: boolean; isPreview?: boolean }) {
  const links = isPreview
    ? [
        { href: "/login", label: "Masuk" },
        { href: "/register", label: "Daftar", active: true },
      ]
    : [
        { href: "/dashboard", label: "Dasbor", active: true },
        { href: "/panels", label: "Panel" },
        ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
        { href: "/akun", label: "Akun" },
      ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between gap-2">
        <Link href={isPreview ? "/" : "/dashboard"} className="flex items-center gap-2.5 shrink-0">
          <span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] shadow-[0_0_10px_rgba(102,58,243,0.8)] animate-shimmer-dot" /></span>
          <span className="font-medium text-[15px] text-[#d1e4fa]">PteroControl</span>
          <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${isPreview ? "bg-[rgba(228,109,76,0.14)] text-[#e46d4c] border-[rgba(228,109,76,0.20)]" : "bg-[rgba(199,211,234,0.10)] text-[#c7d3ea] border-[rgba(186,215,247,0.06)]"}`}>{isPreview ? "pratinjau" : "dasbor"}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          {isPreview ? (
            <>
              <span className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Dasbor</span>
              <Link href="/login" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Masuk</Link>
              <Link href="/register" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Daftar</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Dasbor</Link>
              <Link href="/panels" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Panel</Link>
              {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Admin</Link>}
              <Link href="/akun" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Akun</Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {isPreview ? (
            <>
              <Link href="/login" className="hidden sm:inline-flex pill-ghost rounded-full px-4 py-1.5 text-[13px] font-medium text-white">Masuk</Link>
              <Link href="/register" className="hidden sm:inline-flex flash-violet rounded-full px-4 py-1.5 text-[13px] font-medium text-white">Daftar</Link>
              <MobileMenu links={links} />
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-[11px] text-[#9da7ba] truncate max-w-[140px]">{email}</span>
              <form action={logout} className="hidden sm:block"><button className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Keluar</button></form>
              <MobileMenu links={links} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function PreviewBanner() {
  return (
    <div className="border-b border-[rgba(186,215,247,0.08)] bg-[rgba(228,109,76,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-[12px]">
        <span className="text-[#e46d4c] font-medium">Pratinjau — data contoh. Masuk untuk lihat server aslimu.</span>
        <div className="flex gap-2"><Link href="/login" className="pill-ghost rounded-full px-3 py-1 text-[12px] font-medium text-white">Masuk</Link><Link href="/register" className="flash-violet rounded-full px-3 py-1 text-[12px] font-medium text-white">Daftar</Link></div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="relative border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)]">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-10">
        <p className="text-center text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Cara kerja</p>
        <h2 className="mt-2 text-center font-[var(--font-aeonikpro)] font-medium text-[22px] text-[#d8ecf8]">3 langkah.</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { n: "01", t: "Daftar", d: "Email + sandi. Auto PENDING." },
            { n: "02", t: "Admin setujui", d: "Tanpa APPROVED, tidak bisa buka dasbor live." },
            { n: "03", t: "Hubungkan panel", d: "URL + ptlc_… → AES-256. Langsung agregat." },
          ].map((s) => (
            <div key={s.n} className="glass-card rounded-[16px] p-5">
              <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#663af3]">{s.n}</p>
              <h3 className="mt-1 font-medium text-[15px] text-white">{s.t}</h3>
              <p className="mt-1 text-[13px] text-[#9da7ba]">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-2"><Link href="/register" className="flash-violet rounded-full px-5 py-2.5 text-[13px] font-medium text-white">Daftar</Link><Link href="/login" className="pill-ghost rounded-full px-5 py-2.5 text-[13px] font-medium text-white">Masuk →</Link></div>
      </div>
    </section>
  );
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  const isPreview = !user || user.status !== "APPROVED";

  if (isPreview) {
    // Pratinjau publik — tidak decrypt, tidak fetch
    const previewPanels = PREVIEW_RESULTS;
    const total = PREVIEW_SERVERS.length;
    const ok = previewPanels.filter((r) => r.ok).length;
    return (
      <div className="min-h-screen bg-[#05060f] flex flex-col">
        <TopNav isPreview />
        <PreviewBanner />
        <section className="relative overflow-hidden border-b border-[rgba(186,215,247,0.06)]">
          <div className="absolute inset-0 bg-grid opacity-[0.22] pointer-events-none" aria-hidden />
          <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-7">
            <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Dasbor · Pratinjau</p>
            <h1 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[26px] md:text-[30px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Semua server — contoh.</h1>
            <p className="mt-2 text-[13px] text-[#9da7ba]">3 panel · {ok}/3 online · {total} server (data dummy).</p>
            <div className="mt-4 flex gap-2 flex-wrap"><Link href="/register" className="flash-violet rounded-full px-5 py-2 text-[13px] font-medium text-white">Daftar untuk live</Link><Link href="/login" className="pill-ghost rounded-full px-5 py-2 text-[13px] font-medium text-white">Masuk →</Link></div>
          </div>
        </section>
        <section className="flex-1 py-6 bg-[#05060f]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="glass-card rounded-[16px] p-5"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Panel</p><p className="font-[var(--font-aeonikpro)] font-medium text-[28px] leading-none text-white mt-1">3</p><p className="text-[11px] text-[#9da7ba]">{ok} online · pratinjau</p></div>
              <div className="glass-card rounded-[16px] p-5"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Server</p><p className="font-[var(--font-aeonikpro)] font-medium text-[28px] leading-none text-white mt-1">{total}</p><p className="text-[11px] text-[#9da7ba]">contoh</p></div>
              <div className="rounded-[16px] bg-[#663af3] p-5 text-white shadow-[0_8px_24px_rgba(102,58,243,0.35)]"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-white/70">Mode</p><p className="font-medium text-[15px] mt-1">Pratinjau</p><p className="text-[11px] text-white/70">daftar untuk live</p></div>
              <div className="glass-card rounded-[16px] p-5"><p className="text-[11px] tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Enkripsi</p><p className="font-medium text-[15px] text-white mt-1">AES-256</p><p className="text-[11px] text-[#9da7ba]">live butuh login</p></div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {previewPanels.map((r) => (
                <div key={r.panelId} className="glass-card rounded-[16px] p-5">
                  <div className="flex justify-between gap-3"><div className="min-w-0"><p className="font-medium text-[13px] truncate text-white">{r.panelName}</p><p className="text-[11px] text-[#9da7ba] truncate">{r.panelUrl}</p></div><span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${r.ok ? "bg-[rgba(199,211,234,0.10)] text-[#d1e4fa] border-[rgba(186,215,247,0.08)]" : "bg-[rgba(228,109,76,0.12)] text-[#e46d4c] border-[rgba(228,109,76,0.22)]"}`}><span className={`w-1.5 h-1.5 rounded-full ${r.ok ? "bg-[#663af3] animate-pulse-dot" : "bg-[#e46d4c]"}`} />{r.ok ? `${r.servers.length}` : "Error"}</span></div>
                  {!r.ok && r.error && <p className="mt-2 text-[11px] text-[#e46d4c] break-words">{r.error}</p>}
                </div>
              ))}
            </div>
            <DashboardTable servers={PREVIEW_SERVERS} />
            <p className="text-center text-[11px] text-[#9da7ba]">Di atas data contoh — search & filter bisa dicoba.</p>
          </div>
        </section>
        <HowItWorks />
        <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4"><div className="mx-auto max-w-[1200px] px-6 md:px-10 text-[11px] text-[#9da7ba]">© 2025 PteroControl · Pratinjau</div></footer>
      </div>
    );
  }

  // Live — APPROVED
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
  
  // Sync servers to server_links for control features
  await syncServers();
  
  // Fetch synced server_links for clickable cards
  const { data: serverLinks } = await supabase
    .from("server_links")
    .select("id, identifier, name, state, memory_limit, cpu_limit, disk_limit, panel_id, linked_panels(panel_name)")
    .eq("user_id", user.id);
  
  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      <RealtimePanels userId={user.id} />
      <section className="relative overflow-hidden border-b border-[rgba(186,215,247,0.06)]">
        <div className="absolute inset-0 bg-grid opacity-[0.22] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-7">
          <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Dasbor · Live</p>
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
              {/* Server control cards */}
              {serverLinks && serverLinks.length > 0 ? (
                <div className="mt-6">
                  <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba] mb-3">Server — klik untuk kontrol</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {serverLinks.map((sl: any) => (
                      <Link key={sl.id} href={`/server/${sl.id}/${sl.identifier}`} className="glass-card rounded-[16px] p-5 block hover:border-[rgba(186,215,247,0.18)] transition-colors group">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium text-[13px] truncate text-white">{sl.name}</p>
                            <p className="text-[11px] text-[#9da7ba] truncate">{sl.identifier}</p>
                          </div>
                          <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${sl.state === "online" ? "bg-[rgba(40,200,64,0.12)] text-[#28c840] border-[rgba(40,200,64,0.20)]" : sl.state === "starting" ? "bg-[rgba(102,58,243,0.12)] text-[#a78bfa] border-[rgba(102,58,243,0.20)]" : sl.state === "stopping" ? "bg-[rgba(228,109,76,0.12)] text-[#e46d4c] border-[rgba(228,109,76,0.20)]" : "bg-[rgba(199,211,234,0.08)] text-[#9da7ba] border-[rgba(186,215,247,0.08)]"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sl.state === "online" ? "bg-[#28c840] animate-pulse-dot" : sl.state === "starting" ? "bg-[#663af3] animate-pulse-dot" : sl.state === "stopping" ? "bg-[#e46d4c]" : "bg-[#707070]"}`} />
                            {sl.state?.toUpperCase() || "OFF"}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] text-[#9da7ba]">RAM {sl.memory_limit ? sl.memory_limit + "MB" : "—"} · CPU {sl.cpu_limit ? sl.cpu_limit + "%" : "—"}</span>
                          <span className="text-[11px] text-[#663af3] opacity-0 group-hover:opacity-100 transition-opacity">Kontrol →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : hasPanels ? (
                <div className="mt-4 rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.10)] p-6 text-center">
                  <p className="text-[13px] text-[#9da7ba]">Syncing servers…</p>
                </div>
              ) : null}
              <div className="mt-4">
                <DashboardTable servers={all} />
              </div>
            </>
          )}
        </div>
      </section>
      <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4"><div className="mx-auto max-w-[1200px] px-6 md:px-10 text-[11px] text-[#9da7ba]">© 2025 PteroControl · RLS · Live</div></footer>
    </div>
  );
}
