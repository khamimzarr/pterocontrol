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
        <Link href="/dashboard" className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.04em] text-[#1d1d1f]">
          <span className="grid place-items-center w-7 h-7 rounded-full bg-[#1d1d1f] text-white text-[11px]">◈</span>
          PteroControl
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[12px] tracking-[-0.12px] text-[#1d1d1f]">
          <Link href="/dashboard" className="hover:text-[#707070] transition-colors">
            Dasbor
          </Link>
          <Link href="/panels" className="font-medium text-[#0071e3]">
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

export default async function PanelsPage() {
  const user = await requireApprovedUser();
  const supabase = await createClient();
  const { data: panels } = await supabase
    .from("linked_panels")
    .select("id, panel_name, panel_url, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const count = panels?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />

      <section className="bg-white border-b border-[#e8e8ed]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-10">
          <p className="text-[12px] font-medium tracking-[0.04em] text-[#b64400]">Panel · {count} terhubung</p>
          <h1 className="mt-2 font-[var(--font-sf-pro-display)] font-semibold text-[32px] md:text-[40px] leading-[36px] md:leading-[48px] tracking-[0.128px] text-[#1d1d1f]">
            Kelola
            <br />
            panel-mu.
          </h1>
          <p className="mt-3 max-w-[560px] text-[14px] leading-[18px] tracking-[-0.224px] text-[#707070]">
            Tambahkan URL tiap host Pterodactyl dan <span className="font-medium text-[#1d1d1f]">Client API key</span>-mu. Akan dienkripsi AES-256-CBC (IV acak) sebelum disimpan. Nggak pernah dalam bentuk teks biasa, bung.
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#f5f5f7] border border-[#e8e8ed] px-4 py-2 text-[12px] tracking-[-0.12px] text-[#707070]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" /> Panel tanpa batas · RLS per user · zero-knowledge
          </p>
        </div>
      </section>

      <section className="flex-1 py-8">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-6">
          <div className="rounded-[28px] bg-white p-6 md:p-8 border border-[#e8e8ed]">
            <h2 className="font-[var(--font-sf-pro-display)] font-semibold text-[21px] leading-[29px] tracking-[0.011em] text-[#1d1d1f]">
              Tambah panel
            </h2>
            <p className="mt-1 text-[12px] tracking-[-0.12px] text-[#707070]">
              Pakai Client API key (Account API) ya, bukan Application API.
            </p>
            <form action={addPanel} className="mt-6 grid md:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">Nama panel</span>
                <input
                  name="panelName"
                  required
                  maxLength={100}
                  placeholder="eu-1 · Contabo"
                  className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-3 text-[14px] tracking-[-0.12px] text-[#1d1d1f] placeholder:text-[#707070] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">URL panel</span>
                <input
                  name="panelUrl"
                  type="url"
                  required
                  placeholder="https://panel.contoh.com"
                  className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-3 text-[14px] tracking-[-0.12px] text-[#1d1d1f] placeholder:text-[#707070] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
                />
              </label>
              <label className="block">
                <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">Client API key</span>
                <input
                  name="apiKey"
                  type="password"
                  required
                  minLength={5}
                  placeholder="ptlc_••••••••"
                  className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-3 text-[14px] tracking-[-0.12px] text-[#1d1d1f] placeholder:text-[#707070] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
                />
              </label>
              <div className="md:col-span-3 flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex rounded-full bg-[#0071e3] text-white text-[14px] font-medium px-6 py-2.5 hover:bg-[#0077ed] active:bg-[#006edb] transition-colors"
                >
                  Simpan panel
                </button>
                <span className="text-[12px] tracking-[-0.12px] text-[#707070]">Akan dienkripsi pakai ENCRYPTION_KEY-mu</span>
              </div>
            </form>
          </div>

          {count === 0 ? (
            <div className="rounded-[28px] bg-white p-10 border border-[#e8e8ed] text-center">
              <p className="text-[12px] font-medium tracking-[0.04em] text-[#707070]">Belum ada panel</p>
              <p className="mt-2 text-[14px] tracking-[-0.224px] text-[#707070]">Tambah panel pertamamu di atas biar dasbor agregator muncul, bung.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {panels!.map((p) => (
                <div key={p.id} className="rounded-[28px] bg-white p-6 md:p-7 border border-[#e8e8ed]">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-[var(--font-sf-pro-display)] font-semibold text-[17px] leading-[25px] tracking-[-0.374px] text-[#1d1d1f] truncate">
                        {p.panel_name}
                      </h3>
                      <p className="text-[12px] tracking-[-0.12px] text-[#707070] truncate">{p.panel_url}</p>
                      <p className="mt-1 text-[12px] tracking-[-0.12px] text-[#707070]">
                        Dibuat {new Date(p.created_at).toLocaleDateString("id-ID")} · <span className="font-mono text-[11px]">{p.id.slice(0, 8)}…</span> · API key terenkripsi
                      </p>
                    </div>
                    <form action={deletePanel} className="shrink-0">
                      <input type="hidden" name="id" value={p.id} />
                      <button className="inline-flex rounded-full border border-[#ffd7d5] bg-[#fff1f0] text-[#b64400] text-[12px] font-medium px-4 py-2 hover:bg-[#ffd7d5] transition-colors">
                        Hapus
                      </button>
                    </form>
                  </div>

                  <details className="mt-5 group">
                    <summary className="list-none inline-flex items-center gap-1 text-[14px] tracking-[-0.224px] text-[#0066cc] hover:underline cursor-pointer">
                      Edit panel <span aria-hidden className="group-open:rotate-90 transition-transform">›</span>
                    </summary>
                    <form action={editPanel} className="mt-4 grid md:grid-cols-3 gap-4 border-t border-[#f5f5f7] pt-4">
                      <input type="hidden" name="id" value={p.id} />
                      <label className="block">
                        <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">Nama</span>
                        <input
                          name="panelName"
                          required
                          defaultValue={p.panel_name}
                          className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-2.5 text-[14px] tracking-[-0.12px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">URL</span>
                        <input
                          name="panelUrl"
                          type="url"
                          required
                          defaultValue={p.panel_url}
                          className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-2.5 text-[14px] tracking-[-0.12px] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[12px] font-medium tracking-[-0.12px] text-[#1d1d1f]">API key baru</span>
                        <input
                          name="apiKey"
                          type="password"
                          required
                          minLength={5}
                          placeholder="ptlc_ kunci baru"
                          className="mt-1.5 w-full rounded-full border border-[#d6d6d6] bg-white px-4 py-2.5 text-[14px] tracking-[-0.12px] text-[#1d1d1f] placeholder:text-[#707070] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15"
                        />
                      </label>
                      <div className="md:col-span-3">
                        <button
                          type="submit"
                          className="inline-flex rounded-full bg-[#1d1d1f] text-white text-[13px] font-medium px-5 py-2.5 hover:bg-black transition-colors"
                        >
                          Simpan perubahan
                        </button>
                      </div>
                    </form>
                  </details>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-[28px] bg-[#1d1d1f] p-6 md:p-8 text-white flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div>
              <p className="text-[12px] font-medium tracking-[0.04em] text-white/60">Langkah selanjutnya</p>
              <p className="mt-1 font-[var(--font-sf-pro-display)] font-semibold text-[17px] tracking-[-0.022em] text-white">
                Buka dasbor untuk lihat semua server yang tergabung.
              </p>
            </div>
            <Link href="/dashboard" className="shrink-0 inline-flex justify-center rounded-full bg-white text-[#1d1d1f] text-[14px] font-medium px-5 py-2.5 hover:bg-[#f5f5f7] transition-colors">
              Buka dasbor
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-[#d6d6d6] py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-wrap gap-x-6 gap-y-2 text-[12px] tracking-[-0.12px] text-[#707070]">
          <Link href="/dashboard" className="hover:text-[#1d1d1f] hover:underline">
            Dasbor
          </Link>
          <span className="text-[#d6d6d6]">·</span>
          <span>AES-256-CBC · IV per kunci · dekripsi cuma di server</span>
        </div>
      </footer>
    </div>
  );
}
