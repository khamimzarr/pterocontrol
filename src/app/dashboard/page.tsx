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
        <Link href="/dashboard" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">
          <span className="grid place-items-center w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-[11px]">◈</span>
          PteroControl
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[12px] tracking-[-0.12px] text-[#1d1d1f]">
          <Link href="/dashboard" className="font-medium text-[#0071e3]">
            Dasbor
          </Link>
          <Link href="/panels" className="hover:text-[#707070] transition-colors">
            Panel
          </Link>
          {isAdmin && (
            <Link href="/admin" className="hover:text-[#707070] transition-colors">
              Admin
            </Link>
          )}
          <Link href="/akun" className="hover:text-[#707070] transition-colors">
            Akun
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[12px] tracking-[-0.12px] text-[#707070] truncate max-w-[160px]">{email}</span>
          <form action={logout}>
            <button className="inline-flex rounded-full border border-[#d6d6d6] text-[#1d1d1f] text-[12px] font-medium px-3 py-1.5 hover:bg-[#f5f5f7] transition-colors">
              Keluar
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default async function DashboardPage() {
  const user = await requireApprovedUser();
  const supabase = await createClient();

  const { data: panels } = await supabase
    .from("linked_panels")
    .select("id, panel_name, panel_url, encrypted_api_key, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const hasPanels = panels && panels.length > 0;

  let results: FetchPanelResult[] = [];
  let totalServers = 0;
  let okPanels = 0;

  if (hasPanels) {
    const withKeys = panels
      .map((p) => {
        try {
          return { id: p.id, panelName: p.panel_name, panelUrl: p.panel_url, apiKey: decrypt(p.encrypted_api_key) };
        } catch {
          return null;
        }
      })
      .filter(Boolean) as { id: string; panelName: string; panelUrl: string; apiKey: string }[];

    const decryptFailed = panels.length - withKeys.length;
    results = await aggregatePanels(withKeys);
    if (decryptFailed > 0) {
      for (const p of panels) {
        try {
          decrypt(p.encrypted_api_key);
        } catch (e) {
          results.push({
            panelId: p.id,
            panelName: p.panel_name,
            panelUrl: p.panel_url,
            ok: false,
            error: e instanceof Error ? e.message : "Gagal dekripsi",
            servers: [],
          });
        }
      }
    }
    totalServers = results.reduce((acc, r) => acc + r.servers.length, 0);
    okPanels = results.filter((r) => r.ok).length;
  }

  const allServers = results.flatMap((r) => r.servers);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />

      <section className="bg-white border-b border-[#e8e8ed]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-10">
          <p className="text-[12px] font-medium tracking-[0.04em] text-[#b64400]">Dasbor · Agregator</p>
          <h1 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[32px] md:text-[40px] leading-[36px] md:leading-[48px] tracking-[0.128px] text-[#1d1d1f]">
            Semua server-mu,
            <br />
            dalam satu tempat.
          </h1>
          <p className="mt-3 max-w-[560px] text-[14px] leading-[18px] tracking-[-0.224px] text-[#707070]">
            {hasPanels
              ? `${panels!.length} panel terhubung · ${okPanels} online · ${totalServers} server tergabung · GET /api/client paralel (timeout 10 dtk)`
              : "Kamu belum menghubungkan panel apa pun. Tambahkan panel pertamamu untuk melihat server di sini, bung."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/panels" className="inline-flex rounded-full bg-[#0071e3] text-white text-[14px] font-medium px-5 py-2.5 hover:bg-[#0077ed] transition-colors">
              Kelola Panel
            </Link>
            {!hasPanels && (
              <span className="inline-flex items-center rounded-full bg-[#f5f5f7] border border-[#e8e8ed] text-[#707070] text-[12px] px-4 py-2">
                Tips: pakai Client API key (bukan Application key) ya
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f7] py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          {!hasPanels ? (
            <div className="rounded-[28px] bg-white p-8 md:p-10 border border-[#e8e8ed] text-center">
              <p className="text-[12px] font-medium tracking-[0.04em] text-[#707070]">Belum ada panel</p>
              <h2 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[21px] leading-[29px] tracking-[0.011em] text-[#1d1d1f]">
                Hubungkan panel pertamamu
              </h2>
              <p className="mt-2 text-[14px] leading-[18px] tracking-[-0.224px] text-[#707070] max-w-[480px] mx-auto">
                Buka halaman Panel, lalu tambah URL host Pterodactyl-mu + Client API key. Akan dienkripsi pakai AES-256-CBC (IV acak) sebelum disimpan.
              </p>
              <Link
                href="/panels"
                className="mt-6 inline-flex rounded-full bg-[#0071e3] text-white text-[14px] font-medium px-5 py-2.5 hover:bg-[#0077ed] transition-colors"
              >
                Tambah Panel ›
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-[28px] bg-white p-6 border border-[#e8e8ed]">
                  <p className="text-[12px] tracking-[-0.12px] text-[#707070]">Panel</p>
                  <p className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[32px] leading-none tracking-[0.128px] text-[#1d1d1f]">
                    {panels!.length}
                  </p>
                  <p className="mt-1 text-[12px] tracking-[-0.12px] text-[#707070]">{okPanels} online</p>
                </div>
                <div className="rounded-[28px] bg-white p-6 border border-[#e8e8ed]">
                  <p className="text-[12px] tracking-[-0.12px] text-[#707070]">Server</p>
                  <p className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[32px] leading-none tracking-[0.128px] text-[#1d1d1f]">
                    {totalServers}
                  </p>
                  <p className="mt-1 text-[12px] tracking-[-0.12px] text-[#707070]">tergabung</p>
                </div>
                <div className="rounded-[28px] bg-[#1d1d1f] p-6 text-white">
                  <p className="text-[12px] tracking-[-0.12px] text-white/60">Status</p>
                  <p className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[21px] leading-none tracking-[0.011em] text-white">
                    {okPanels === panels!.length ? "Semua Oke" : `${panels!.length - okPanels} error`}
                  </p>
                  <p className="mt-1 text-[12px] tracking-[-0.12px] text-white/60">allSettled · anti-nge-hang</p>
                </div>
                <div className="rounded-[28px] bg-white p-6 border border-[#e8e8ed]">
                  <p className="text-[12px] tracking-[-0.12px] text-[#707070]">Enkripsi</p>
                  <p className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[21px] leading-none tracking-[0.011em] text-[#1d1d1f]">
                    AES-256-CBC
                  </p>
                  <p className="mt-1 text-[12px] tracking-[-0.12px] text-[#707070]">IV acak · zero-knowledge</p>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {results.map((r) => (
                  <div key={r.panelId} className="rounded-[28px] bg-white p-6 border border-[#e8e8ed]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-[14px] tracking-[-0.224px] text-[#1d1d1f] truncate">{r.panelName}</p>
                        <p className="text-[12px] tracking-[-0.12px] text-[#707070] truncate">{r.panelUrl}</p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${r.ok ? "bg-[#f5f5f7] text-[#1d1d1f] border border-[#e8e8ed]" : "bg-[#fff1f0] text-[#b64400] border border-[#ffd7d5]"}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${r.ok ? "bg-[#0071e3]" : "bg-[#b64400]"}`} />
                        {r.ok ? `${r.servers.length} srv` : "Error"}
                      </span>
                    </div>
                    {!r.ok && r.error && <p className="mt-3 text-[12px] leading-5 tracking-[-0.12px] text-[#b64400] break-words">{r.error}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[28px] bg-white border border-[#e8e8ed] overflow-hidden">
                <div className="px-6 md:px-8 py-5 border-b border-[#e8e8ed] flex items-center justify-between gap-4">
                  <h2 className="font-[var(--font-sf-pro-display)] font-semibold text-[17px] tracking-[-0.022em] text-[#1d1d1f]">Server tergabung</h2>
                  <span className="text-[12px] tracking-[-0.12px] text-[#707070]">{allServers.length} baris</span>
                </div>
                {allServers.length === 0 ? (
                  <div className="px-6 md:px-8 py-10 text-center">
                    <p className="text-[14px] tracking-[-0.224px] text-[#707070]">Belum ada server yang kebaca. Cek lagi API key-mu, pastikan itu Client API (bukan Application), bung.</p>
                    <Link href="/panels" className="mt-4 inline-flex text-[14px] tracking-[-0.224px] text-[#0066cc] hover:underline">
                      Cek panel ›
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#fafafc] text-[12px] tracking-[-0.12px] text-[#707070] border-b border-[#e8e8ed]">
                          <th className="px-6 py-3 font-medium whitespace-nowrap">Server</th>
                          <th className="px-4 py-3 font-medium whitespace-nowrap">Panel</th>
                          <th className="px-4 py-3 font-medium whitespace-nowrap">Node</th>
                          <th className="px-4 py-3 font-medium whitespace-nowrap">Memori</th>
                          <th className="px-4 py-3 font-medium whitespace-nowrap">CPU</th>
                          <th className="px-6 py-3 font-medium whitespace-nowrap">ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f5f5f7]">
                        {allServers.map((s) => (
                          <tr key={`${s.panelId}-${s.identifier}`} className="hover:bg-[#f5f5f7]/60 transition-colors">
                            <td className="px-6 py-3.5 text-[14px] font-medium tracking-[-0.224px] text-[#1d1d1f] max-w-[220px] truncate">{s.name}</td>
                            <td className="px-4 py-3.5 text-[13px] tracking-[-0.12px] text-[#474747] whitespace-nowrap">{s.panelName}</td>
                            <td className="px-4 py-3.5 text-[13px] tracking-[-0.12px] text-[#707070] whitespace-nowrap">{s.node ?? "—"}</td>
                            <td className="px-4 py-3.5 text-[13px] tracking-[-0.12px] text-[#1d1d1f] whitespace-nowrap">
                              {s.memoryLimit != null ? `${s.memoryLimit} MB` : "—"}
                            </td>
                            <td className="px-4 py-3.5 text-[13px] tracking-[-0.12px] text-[#1d1d1f] whitespace-nowrap">
                              {s.cpuLimit != null ? `${s.cpuLimit}%` : "—"}
                            </td>
                            <td className="px-6 py-3.5 font-mono text-[12px] tracking-[-0.12px] text-[#707070] whitespace-nowrap">{s.identifier}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-[28px] bg-[#1d1d1f] p-6 md:p-8 text-white flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium tracking-[0.04em] text-white/60">Catatan teknis</p>
                  <p className="mt-1 text-[14px] leading-[18px] tracking-[-0.224px] text-white/80 max-w-[560px]">
                    Tiap panel di-fetch pakai <code className="px-1 py-0.5 rounded bg-white/10 text-[12px]">Authorization: Bearer &lt;dekripsi&gt;</code> cuma di memori
                    server. Nggak pernah kelihatan di client. Satu panel down nggak bikin yang lain ikutan error.
                  </p>
                </div>
                <Link
                  href="/panels"
                  className="shrink-0 inline-flex justify-center rounded-full bg-white text-[#1d1d1f] text-[14px] font-medium px-5 py-2.5 hover:bg-[#f5f5f7] transition-colors"
                >
                  Tambah panel lagi
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="mt-auto bg-[#f5f5f7] border-t border-[#d6d6d6] py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-wrap gap-x-6 gap-y-2 text-[12px] tracking-[-0.12px] text-[#707070]">
          <span>© 2025 PteroControl</span>
          <Link href="/panels" className="hover:text-[#1d1d1f] hover:underline">
            Panel
          </Link>
          <span className="text-[#d6d6d6]">·</span>
          <span>Supabase RLS · AES-256-CBC · Vercel</span>
        </div>
      </footer>
    </div>
  );
}
