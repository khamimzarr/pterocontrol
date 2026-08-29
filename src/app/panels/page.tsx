export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { addPanel, deletePanel, editPanel } from "@/lib/actions/auth-actions";
import { logout } from "@/lib/actions/auth-actions";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] shadow-[0_0_10px_rgba(102,58,243,0.8)] animate-shimmer-dot" /></span>
          <span className="font-medium text-[15px] tracking-[-0.02em] text-[#d1e4fa]">PteroControl</span>
          <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium text-[#c7d3ea] bg-[rgba(199,211,234,0.10)] border border-[rgba(186,215,247,0.06)]">panel</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Dasbor</Link>
          <Link href="/panels" className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Panel</Link>
          {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Admin</Link>}
          <Link href="/akun" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Akun</Link>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-[#9da7ba] truncate max-w-[120px]">{email}</span>
          <form action={logout}><button className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Keluar</button></form>
        </div>
      </div>
    </header>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow-line flex-1 max-w-[48px]" />
      <span className="font-[var(--font-dotdigital)] text-[11px] sm:text-[12px] tracking-[0.10em] uppercase text-[#9da7ba] whitespace-nowrap">{children}</span>
      <span className="eyebrow-line flex-1 max-w-[48px]" />
    </div>
  );
}

export default async function PanelsPage() {
  const user = await requireApprovedUser();
  const supabase = await createClient();
  const { data: panels } = await supabase.from("linked_panels").select("id, panel_name, panel_url, created_at").eq("user_id", user.id).order("created_at");
  const count = panels?.length ?? 0;
  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />

      <section className="relative overflow-hidden border-b border-[rgba(186,215,247,0.06)]">
        <div className="absolute inset-0 bg-grid opacity-[0.22] pointer-events-none" aria-hidden />
        <div className="absolute inset-0 halo opacity-[0.35] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-8">
          <Eyebrow>{count} panel · terenkripsi</Eyebrow>
          <h1 className="mt-3 font-[var(--font-aeonikpro)] font-medium text-[28px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Kelola panel-mu.</h1>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#9da7ba]">URL + Client API key → terenkripsi AES-256-CBC. Zero-knowledge. Bisa diedit kapan saja.</p>
        </div>
      </section>

      <section className="flex-1 py-6 bg-[#05060f]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 space-y-4">
          {/* add panel — AuthKit modal card */}
          <div className="rounded-[16px] bg-[rgba(5,6,15,0.96)] border border-[rgba(186,215,247,0.12)] p-6 shadow-[inset_0_1px_1px_rgba(216,236,248,0.20),inset_0_24px_48px_rgba(168,216,245,0.06),0_24px_48px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full grid place-items-center bg-[#663af3] text-white font-medium text-[12px] shadow-[0_0_16px_rgba(102,58,243,0.45)]">+</span>
              <div>
                <h2 className="font-[var(--font-aeonikpro)] font-medium text-[16px] leading-none text-white">Tambah panel</h2>
                <p className="text-[11px] text-[#9da7ba] font-[var(--font-dotdigital)] tracking-[0.06em] uppercase">Client API key — bukan Application</p>
              </div>
              <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#9da7ba]"><span className="w-1.5 h-1.5 rounded-full bg-[#28c840] animate-shimmer-dot" /> Terenkripsi otomatis</span>
            </div>

            <form action={addPanel} className="mt-5 grid md:grid-cols-3 gap-3">
              <label className="block">
                <span className="text-[11px] font-medium tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">Nama</span>
                <input name="panelName" required maxLength={100} placeholder="eu-1 · Contabo" className="auth-input mt-1.5 w-full px-3 py-2.5 text-[13px]" />
              </label>
              <label className="block">
                <span className="text-[11px] font-medium tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">URL</span>
                <input name="panelUrl" type="url" required placeholder="https://panel.contoh.com" className="auth-input mt-1.5 w-full px-3 py-2.5 text-[13px]" />
              </label>
              <label className="block">
                <span className="text-[11px] font-medium tracking-[0.06em] uppercase font-[var(--font-dotdigital)] text-[#c7d3ea]">API key</span>
                <input name="apiKey" type="password" required minLength={5} placeholder="ptlc_••••" className="auth-input mt-1.5 w-full px-3 py-2.5 text-[13px]" />
              </label>
              <div className="md:col-span-3 flex items-center gap-3 pt-1">
                <button type="submit" className="flash-violet rounded-[6px] px-5 py-2.5 text-[13px] font-medium text-white">Continue</button>
                <span className="text-[11px] text-[#9da7ba]">AES-256-CBC · iv:ciphertext</span>
              </div>
            </form>
          </div>

          {count === 0 ? (
            <div className="rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.08)] p-8 text-center">
              <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Kosong</p>
              <p className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[16px] text-white">Belum ada panel</p>
              <p className="text-[13px] text-[#9da7ba]">Tambah di atas dulu.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {panels!.map((p) => (
                <div key={p.id} className="glass-card rounded-[16px] p-5">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-medium text-[15px] truncate text-white">{p.panel_name}</h3>
                      <p className="text-[11px] text-[#9da7ba] truncate font-mono">{p.panel_url}</p>
                      <p className="text-[11px] text-[#9da7ba]">{new Date(p.created_at).toLocaleDateString("id-ID")} · terenkripsi · <span className="text-[#c7d3ea] font-mono text-[11px]">iv:ciphertext</span></p>
                    </div>
                    <form action={deletePanel}><input type="hidden" name="id" value={p.id} /><button className="rounded-full bg-[rgba(228,109,76,0.10)] border border-[rgba(228,109,76,0.20)] text-[#e46d4c] text-[11px] font-medium px-3 py-1.5 hover:bg-[rgba(228,109,76,0.16)] transition-colors">Hapus</button></form>
                  </div>
                  <details className="mt-4 group">
                    <summary className="text-[13px] text-[#b6d9fc] cursor-pointer hover:text-white transition-colors list-none inline-flex items-center gap-1">Edit <span className="group-open:rotate-90 transition-transform">›</span></summary>
                    <form action={editPanel} className="mt-3 grid md:grid-cols-3 gap-3 border-t border-[rgba(186,215,247,0.08)] pt-4">
                      <input type="hidden" name="id" value={p.id} />
                      <input name="panelName" required defaultValue={p.panel_name} className="auth-input px-3 py-2.5 text-[13px]" placeholder="Nama" />
                      <input name="panelUrl" type="url" required defaultValue={p.panel_url} className="auth-input px-3 py-2.5 text-[13px]" placeholder="URL" />
                      <input name="apiKey" type="password" required minLength={5} placeholder="ptlc_ baru (wajib isi)" className="auth-input px-3 py-2.5 text-[13px]" />
                      <div className="md:col-span-3"><button type="submit" className="pill-ghost rounded-full px-4 py-2 text-[12px] font-medium text-white">Simpan perubahan</button></div>
                    </form>
                  </details>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-[16px] bg-[#663af3] p-6 flex justify-between items-center gap-4 shadow-[0_8px_24px_rgba(102,58,243,0.35)]">
            <div>
              <p className="font-[var(--font-aeonikpro)] font-medium text-[15px] text-white">Lihat dasbor agregat</p>
              <p className="text-[12px] text-white/70">Semua server dari {count} panel dalam satu tabel.</p>
            </div>
            <Link href="/dashboard" className="shrink-0 inline-flex rounded-full bg-white text-[#05060f] text-[12px] font-medium px-4 py-2 hover:bg-[#d1e4fa] transition-colors">Buka dasbor →</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4"><div className="mx-auto max-w-[1200px] px-6 md:px-10 text-[11px] text-[#9da7ba]">© 2025 · AES-256-CBC · Zero-knowledge</div></footer>
    </div>
  );
}
