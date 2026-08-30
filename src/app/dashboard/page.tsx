export const dynamic = "force-dynamic";
import React from "react";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";
import { aggregatePanels, type FetchPanelResult, type AggregatedServer } from "@/lib/pterodactyl";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { DashboardTable } from "@/components/dashboard-table";
import { RealtimePanels } from "@/components/realtime";
import { ServerSyncTrigger } from "@/components/server-sync-trigger";

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
        { href: "/login", label: "Log In" },
        { href: "/register", label: "Register", active: true },
      ]
    : [
        { href: "/dashboard", label: "Dashboard", active: true },
        { href: "/panels", label: "Panels" },
        ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
        { href: "/akun", label: "Account" },
      ];
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href={isPreview ? "/" : "/dashboard"} className="nav-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C12 2 9 4 8 7c-2 5 1 9 4 11 1 1 3 1 5 1s4-1 5-2c2-2 3-5 2-8-1-3-4-5-8-5z" fill="#ffe228"/>
            <circle cx="16" cy="18" r="3" fill="#130e30"/>
          </svg>
          Pterodactyl
          <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-caption font-medium border ${isPreview ? "bg-hi-yellow/10 text-slate border-hi-yellow" : "bg-hi-yellow/20 text-deep-ink border-hi-yellow"}`}>{isPreview ? "preview" : "dashboard"}</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {isPreview ? (
            <>
              <span className="nav-link">Dashboard</span>
              <Link href="/login" className="nav-link">Log In</Link>
              <Link href="/register" className="nav-link">Register</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="nav-link">Dashboard</Link>
              <Link href="/panels" className="nav-link">Panels</Link>
              {isAdmin && <Link href="/admin" className="nav-link">Admin</Link>}
              <Link href="/akun" className="nav-link">Account</Link>
            </>
          )}
        </nav>
        
        <div className="nav-actions">
          {isPreview ? (
            <>
              <Link href="/login" className="btn-secondary">Log In</Link>
              <Link href="/register" className="btn-primary">Register</Link>
              <MobileMenu links={links} />
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-caption text-slate truncate max-w-[140px]">{email}</span>
              <form action={logout} className="hidden sm:block">
                <button className="btn-ghost text-body-sm">Log Out</button>
              </form>
              <MobileMenu links={links} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function PreviewBanner() {
  return (
    <div className="border-b border-hi-yellow/20 bg-hi-yellow/10">
      <div className="max-w-[1200px] mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-body-sm text-slate font-medium">Preview — sample data. Log in to see your real servers.</span>
        <div className="flex gap-2">
          <Link href="/login" className="btn-secondary py-2">Log In</Link>
          <Link href="/register" className="btn-primary py-2">Register</Link>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <section className="border-t border-deep-ink/5 bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10">
        <p className="text-center text-caption font-semibold tracking-wide uppercase text-slate mb-2">How it works</p>
        <h2 className="mt-2 text-center font-hedvig-letters-serif font-bold text-heading text-deep-ink">3 simple steps.</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { n: "01", t: "Register", d: "Email + password. Auto PENDING." },
            { n: "02", t: "Admin approval", d: "Without APPROVED, live dashboard stays locked." },
            { n: "03", t: "Connect panels", d: "URL + ptlc_... → AES-256. Aggregate instantly." },
          ].map((s) => (
            <div key={s.n} className="feature-card">
              <p className="text-caption font-semibold tracking-wide uppercase text-hi-yellow">{s.n}</p>
              <h3 className="feature-title mt-2">{s.t}</h3>
              <p className="feature-text">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/register" className="btn-primary">Register</Link>
          <Link href="/login" className="btn-secondary">Log In →</Link>
        </div>
      </div>
    </section>
  );
}

/* Reusable stat card */
function StatCard({ label, value, sub, highlight }: { label: string; value: React.ReactNode; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border border-deep-ink/5 hover-lift ${highlight ? "bg-gradient-to-br from-hi-yellow to-[#fcd34d] text-deep-ink shadow-sm" : "bg-surface-soft-meadow"}`}>
      <p className={`text-caption font-semibold tracking-wide uppercase ${highlight ? "text-deep-ink/70" : "text-slate"}`}>{label}</p>
      <p className="font-hedvig-letters-serif font-bold text-[28px] leading-none mt-1">{value}</p>
      {sub && <p className={`text-caption mt-1 ${highlight ? "text-deep-ink/70" : "text-slate"}`}>{sub}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  const isPreview = !user || user.status !== "APPROVED";

  if (isPreview) {
    // Public preview — no decrypt, no fetch
    const previewPanels = PREVIEW_RESULTS;
    const total = PREVIEW_SERVERS.length;
    const ok = previewPanels.filter((r) => r.ok).length;
    return (
      <div className="min-h-screen bg-surface-canvas flex flex-col">
        <TopNav isPreview />
        <PreviewBanner />
        <section className="border-b border-deep-ink/5 bg-white">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-7">
            <p className="text-caption font-semibold tracking-wide uppercase text-slate mb-2">Dashboard · Preview</p>
            <h1 className="font-hedvig-letters-serif font-bold text-heading-lg text-deep-ink mb-3">All servers — sample.</h1>
            <p className="text-slate text-body-sm">{3} panels · {ok}/3 online · {total} servers (dummy data).</p>
            <div className="mt-4 flex gap-3 flex-wrap">
              <Link href="/register" className="btn-primary">Register for live</Link>
              <Link href="/login" className="btn-secondary">Log In →</Link>
            </div>
          </div>
        </section>
        <section className="flex-1 py-8">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
              <StatCard label="Panels" value="3" sub={`${ok} online · preview`} />
              <StatCard label="Servers" value={total} sub="sample" />
              <StatCard label="Mode" value="Preview" sub="register for live" highlight />
              <StatCard label="Encryption" value="AES-256" sub="live needs login" />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {previewPanels.map((r) => (
                <div key={r.panelId} className="rounded-xl bg-white p-5 border border-deep-ink/5 hover:border-deep-ink/10 transition-colors hover-lift">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-body text-deep-ink truncate">{r.panelName}</p>
                      <p className="text-caption text-slate truncate">{r.panelUrl}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium border ${r.ok ? "bg-[#59e25d]/10 text-[#59e25d] border-[#59e25d]" : "bg-[#e46d4c]/10 text-[#e46d4c] border-[#e46d4c]"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${r.ok ? "bg-[#59e25d] animate-pulse-dot" : "bg-[#e46d4c]"}`} />
                      {r.ok ? `${r.servers.length}` : "Error"}
                    </span>
                  </div>
                  {!r.ok && r.error && <p className="mt-2 text-caption text-[#e46d4c] break-words">{r.error}</p>}
                </div>
              ))}
            </div>
            
            <div className="animate-slide-up animate-delay-200">
              <DashboardTable servers={PREVIEW_SERVERS} />
            </div>
            <p className="text-center text-caption text-slate">Above is sample data — search & filter are testable.</p>
          </div>
        </section>
        <HowItWorks />
        <footer className="py-4 text-center text-caption text-slate border-t border-deep-ink/5 bg-white">
          <p>© 2026 Pterodactyl Control Panel · Preview</p>
        </footer>
      </div>
    );
  }

  // Live — APPROVED user
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
  
  // NOTE: server_links sync + revalidatePath is intentionally NOT run during render.
  // Calling revalidatePath during render throws in Next.js and crashes the page.
  // Server list is shown live from aggregatePanels() above; server_links (control
  // cards) sync is handled separately when its table + triggers are available.
  
  // Fetch synced server_links for clickable cards (optional; empty if table/rows missing)
  const { data: serverLinks } = await supabase
    .from("server_links")
    .select("id, identifier, name, state, memory_limit, cpu_limit, disk_limit, panel_id, linked_panels(panel_name)")
    .eq("user_id", user.id);
  
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col">
      <ServerSyncTrigger />
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      <RealtimePanels userId={user.id} />
      
      {/* Page Header */}
      <section className="border-b border-deep-ink/5 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-7">
          <p className="text-caption font-semibold tracking-wide uppercase text-slate mb-2">Dashboard · Live</p>
          <h1 className="font-hedvig-letters-serif font-bold text-heading-lg text-deep-ink mb-3">All servers.</h1>
          <p className="text-slate text-body-sm mb-4">
            {hasPanels ? `${panels!.length} panel${panels!.length !== 1 ? "s" : ""} · ${ok}/${panels!.length} online · ${total} server${total !== 1 ? "s" : ""}` : "No panels connected yet."}
          </p>
          <div className="mt-2 flex gap-3 flex-wrap">
            <Link href="/panels" className="btn-primary">Manage Panels</Link>
            {!hasPanels && (
              <span className="inline-flex items-center rounded-full bg-surface-soft-meadow border border-deep-ink/5 text-caption text-slate px-4 py-2">
                Client API key required
              </span>
            )}
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          {!hasPanels ? (
            /* Empty state — no panels added yet */
            <div className="rounded-xl bg-white p-8 text-center border border-deep-ink/5">
              <div className="w-12 h-12 mx-auto rounded-full grid place-items-center bg-hi-yellow/20 text-hi-yellow text-xl mb-4">◈</div>
              <p className="text-caption font-semibold tracking-wide uppercase text-slate mb-2">Empty</p>
              <h2 className="font-hedvig-letters-serif font-bold text-heading text-deep-ink mb-2">No panels yet.</h2>
              <p className="text-slate text-body-sm mb-6">Add your panel URL and API key to get started.</p>
              <Link href="/panels" className="btn-primary">Add Panel →</Link>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
                <StatCard label="Panels" value={panels!.length} sub={`${ok} online`} />
                <StatCard label="Servers" value={total} sub={total === 0 ? "—" : "total"} />
                <StatCard 
                  label="Status" 
                  value={ok === panels!.length ? "All OK" : `${panels!.length - ok} error`} 
                  sub={ok === panels!.length ? "—" : "check panels"} 
                  highlight 
                />
                <StatCard label="Encryption" value="AES-256" sub="CBC" />
              </div>
              
              {/* Panel status cards */}
              <div className="mt-4 grid md:grid-cols-3 gap-4 animate-slide-up animate-delay-100">
                {results.map((r) => (
                  <div key={r.panelId} className="rounded-xl bg-white p-5 border border-deep-ink/5 hover:border-deep-ink/10 transition-colors hover-lift">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-body text-deep-ink truncate">{r.panelName}</p>
                        <p className="text-caption text-slate truncate">{r.panelUrl}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium border ${r.ok ? "bg-[#59e25d]/10 text-[#59e25d] border-[#59e25d]" : "bg-[#e46d4c]/10 text-[#e46d4c] border-[#e46d4c]"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${r.ok ? "bg-[#59e25d] animate-pulse-dot" : "bg-[#e46d4c]"}`} />
                        {r.ok ? `${r.servers.length}` : "Error"}
                      </span>
                    </div>
                    {!r.ok && r.error && <p className="mt-2 text-caption text-[#e46d4c] break-words">{r.error}</p>}
                  </div>
                ))}
              </div>
              
              {/* Server control cards */}
              {serverLinks && serverLinks.length > 0 ? (
                <div className="mt-6">
                  <p className="text-caption font-semibold tracking-wide uppercase text-slate mb-3">Servers — click to control</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {serverLinks.map((sl: any) => {
                      const isOn = sl.state === "online";
                      const isStart = sl.state === "starting";
                      const isStop = sl.state === "stopping";
                      const statusCls = isOn
                        ? "bg-[#59e25d]/10 text-[#59e25d] border-[#59e25d]"
                        : isStart
                          ? "bg-hi-yellow/10 text-deep-ink border-hi-yellow"
                          : isStop
                            ? "bg-[#e46d4c]/10 text-[#e46d4c] border-[#e46d4c]"
                            : "bg-surface-soft-meadow text-slate border-deep-ink/5";
                      const dotCls = isOn ? "bg-[#59e25d] animate-pulse-dot" : isStart ? "bg-hi-yellow animate-pulse-dot" : isStop ? "bg-[#e46d4c]" : "bg-slate";
                      return (
                        <Link key={sl.id} href={`/server/${sl.id}/${sl.identifier}`} className="rounded-xl bg-white p-5 border border-deep-ink/5 hover:border-deep-ink/10 transition-colors group block">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-body text-deep-ink truncate">{sl.name}</p>
                              <p className="text-caption text-slate truncate font-mono">{sl.identifier}</p>
                            </div>
                            <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium border ${statusCls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
                              {sl.state?.toUpperCase() || "OFF"}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-caption text-slate">
                              RAM {sl.memory_limit ? sl.memory_limit + "MB" : "—"} · CPU {sl.cpu_limit ? sl.cpu_limit + "%" : "—"}
                            </span>
                            <span className="text-caption text-hi-yellow opacity-0 group-hover:opacity-100 transition-opacity font-medium">Control →</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Control cards rely on the server_links table + sync which is
                // intentionally not run during render (revalidatePath crash). The
                // live aggregated list below is the primary server view.
                null
              )}
              
              {/* Aggregated server table */}
              <div className="mt-4">
                <DashboardTable servers={all} />
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-4 text-center text-caption text-slate border-t border-deep-ink/5 bg-white">
        <p>© 2026 Pterodactyl Control Panel · RLS · Live</p>
      </footer>
    </div>
  );
}