export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth-actions";
import { MobileMenu } from "@/components/mobile-menu";
import { AddPanelForm, EditPanelForm, DeletePanelButton } from "@/components/panel-forms";
import { RealtimePanels } from "@/components/realtime";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  const links = [
    { href: "/dashboard", label: "Dasbor" },
    { href: "/panels", label: "Panel", active: true },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/akun", label: "Akun" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between gap-2">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0"><span className="w-7 h-7 rounded-full grid place-items-center bg-[rgba(186,214,247,0.08)] border border-[rgba(186,215,247,0.12)]"><span className="w-2.5 h-2.5 rounded-full bg-[#663af3] animate-shimmer-dot" /></span><span className="font-medium text-[15px] text-[#d1e4fa]">PteroControl</span><span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium text-[#c7d3ea] bg-[rgba(199,211,234,0.10)] border border-[rgba(186,215,247,0.06)]">panel</span></Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Dasbor</Link>
          <Link href="/panels" className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Panel</Link>
          {isAdmin && <Link href="/admin" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Admin</Link>}
          <Link href="/akun" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Akun</Link>
        </nav>
        <div className="flex items-center gap-2"><span className="hidden sm:inline text-[11px] text-[#9da7ba] truncate max-w-[120px]">{email}</span><form action={logout} className="hidden sm:block"><button className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Keluar</button></form><MobileMenu links={links} /></div>
      </div>
    </header>
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
      <RealtimePanels userId={user.id} />
      <section className="relative overflow-hidden border-b border-[rgba(186,215,247,0.06)]">
        <div className="absolute inset-0 bg-grid opacity-[0.22] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-7">
          <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">{count} panel</p>
          <h1 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[26px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Panel</h1>
          <p className="mt-2 text-[13px] text-[#9da7ba]">URL + API key. Terenkripsi.</p>
        </div>
      </section>
      <section className="flex-1 py-6 bg-[#05060f]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 space-y-4">
          <div className="rounded-[16px] bg-[rgba(5,6,15,0.96)] border border-[rgba(186,215,247,0.12)] p-6 shadow-[inset_0_1px_1px_rgba(216,236,248,0.20),0_24px_48px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-full grid place-items-center bg-[#663af3] text-white font-medium text-[12px] shadow-[0_0_16px_rgba(102,58,243,0.45)]">+</span><div><h2 className="font-medium text-[15px] leading-none text-white">Tambah panel</h2><p className="text-[11px] text-[#9da7ba] font-[var(--font-dotdigital)] tracking-[0.06em] uppercase">Client key — bukan Application</p></div></div>
            <AddPanelForm />
          </div>
          {count === 0 ? (
            <div className="rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.08)] p-7 text-center"><p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Kosong</p><p className="mt-1 font-medium text-[15px] text-white">Belum ada panel.</p></div>
          ) : (
            <div className="grid gap-3">
              {panels!.map((p) => (
                <div key={p.id} className="glass-card rounded-[16px] p-5">
                  <div className="flex justify-between gap-3"><div className="min-w-0"><h3 className="font-medium text-[14px] truncate text-white">{p.panel_name}</h3><p className="text-[11px] text-[#9da7ba] truncate font-mono">{p.panel_url}</p><p className="text-[11px] text-[#9da7ba]">{new Date(p.created_at).toLocaleDateString("id-ID")}</p></div><DeletePanelButton id={p.id} name={p.panel_name} /></div>
                  <details className="mt-3 group"><summary className="text-[13px] text-[#b6d9fc] cursor-pointer hover:text-white list-none inline-flex items-center gap-1">Edit <span className="group-open:rotate-90 transition-transform">›</span></summary>
                    <EditPanelForm id={p.id} name={p.panel_name} url={p.panel_url} />
                  </details>
                </div>
              ))}
            </div>
          )}
          <div className="rounded-[16px] bg-[#663af3] p-5 flex justify-between items-center gap-4 shadow-[0_8px_24px_rgba(102,58,243,0.35)]"><p className="font-medium text-[14px] text-white">Lihat dasbor</p><Link href="/dashboard" className="shrink-0 rounded-full bg-white text-[#05060f] text-[12px] font-medium px-4 py-2">Dasbor →</Link></div>
        </div>
      </section>
      <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4"><div className="mx-auto max-w-[1200px] px-6 md:px-10 text-[11px] text-[#9da7ba]">© 2025 PteroControl · RLS · Realtime</div></footer>
    </div>
  );
}
