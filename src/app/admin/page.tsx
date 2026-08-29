export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decideUser, logout } from "@/lib/actions/auth-actions";

function TopNav({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5"><span className="w-7 h-7 rounded-full grid place-items-center bg-[#b64400] text-white text-[11px] font-bold">◈</span><span className="font-medium text-[15px] text-[#d1e4fa]">PteroControl</span><span className="px-2 py-0.5 rounded-full bg-[#663af3] text-white text-[10px] tracking-[0.06em] uppercase">ADMIN</span></Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Dasbor</Link>
          <Link href="/panels" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Panel</Link>
          <Link href="/admin" className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Admin</Link>
          <Link href="/akun" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)]">Akun</Link>
        </nav>
        <div className="flex items-center gap-2"><span className="hidden sm:inline text-[11px] text-[#9da7ba] truncate max-w-[120px]">{email}</span><form action={logout}><button className="pill-ghost rounded-full px-3 py-1.5 text-[12px] font-medium text-white">Keluar</button></form></div>
      </div>
    </header>
  );
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data: pending } = await supabase.from("profiles").select("id, email, role, status, created_at").in("status", ["PENDING", "REJECTED"]).order("created_at");
  const pend = pending?.filter((u) => u.status === "PENDING").length ?? 0;
  const rej = pending?.filter((u) => u.status === "REJECTED").length ?? 0;
  const { data: app } = await supabase.from("profiles").select("id").eq("status", "APPROVED");
  return (
    <div className="min-h-screen bg-[#05060f] flex flex-col">
      <TopNav email={admin.email} />
      <section className="relative overflow-hidden border-b border-[rgba(186,215,247,0.06)]">
        <div className="absolute inset-0 bg-grid opacity-[0.22] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-7">
          <p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Admin · Inbox</p>
          <h1 className="mt-1 font-[var(--font-aeonikpro)] font-medium text-[26px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Menunggu.</h1>
          <p className="mt-2 text-[13px] text-[#9da7ba]">Hanya ADMIN_EMAIL yang bisa akses.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(228,109,76,0.12)] border border-[rgba(228,109,76,0.18)] text-[#e46d4c] text-[11px] font-medium px-3 py-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e46d4c] animate-pulse-dot" />{pend} menunggu</span>
            <span className="rounded-full bg-[rgba(199,211,234,0.08)] border border-[rgba(186,215,247,0.08)] text-[11px] text-[#c7d3ea] px-3 py-1.5">{app?.length ?? 0} approved</span>
            <span className="rounded-full bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.06)] text-[11px] text-[#9da7ba] px-3 py-1.5">{rej} ditolak</span>
          </div>
        </div>
      </section>
      <section className="flex-1 py-6 bg-[#05060f]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 space-y-3">
          {(!pending || pending.length === 0) ? (
            <div className="rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.08)] p-7 text-center"><p className="text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Kosong</p><p className="mt-1 font-medium text-[15px] text-white">Tidak ada antrean.</p></div>
          ) : (
            <div className="grid gap-3">
              {pending!.map((u) => (
                <div key={u.id} className="glass-card rounded-[16px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="min-w-0"><div className="flex gap-2 items-center flex-wrap"><p className="font-medium text-[13px] truncate text-white">{u.email}</p><span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${u.status === "PENDING" ? "bg-[rgba(228,109,76,0.12)] text-[#e46d4c] border-[rgba(228,109,76,0.20)]" : "bg-[rgba(199,211,234,0.08)] text-[#9da7ba] border-[rgba(186,215,247,0.08)]"}`}>{u.status === "PENDING" ? "PENDING" : "DITOLAK"}</span></div><p className="font-mono text-[11px] text-[#9da7ba] truncate mt-1">{u.id}</p><p className="text-[11px] text-[#9da7ba]">{new Date(u.created_at).toLocaleDateString("id-ID")}</p></div>
                  <div className="flex gap-2 shrink-0"><form action={decideUser}><input type="hidden" name="userId" value={u.id} /><input type="hidden" name="action" value="APPROVE" /><button className="flash-violet rounded-full px-4 py-2 text-[12px] font-medium text-white">Setujui</button></form><form action={decideUser}><input type="hidden" name="userId" value={u.id} /><input type="hidden" name="action" value="REJECT" /><button className="pill-ghost rounded-full px-4 py-2 text-[12px] font-medium text-white">Tolak</button></form></div>
                </div>
              ))}
            </div>
          )}
          <div className="rounded-[16px] bg-[#663af3] p-4 flex justify-between items-center gap-3 shadow-[0_8px_24px_rgba(102,58,243,0.35)]"><p className="font-medium text-[13px] text-white">Approved = akses dasbor.</p><Link href="/dashboard" className="shrink-0 rounded-full bg-white text-[#05060f] text-[12px] font-medium px-4 py-2">Dasbor →</Link></div>
        </div>
      </section>
      <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4"><div className="mx-auto max-w-[1200px] px-6 md:px-10 text-[11px] text-[#9da7ba]">Admin: <span className="text-[#c7d3ea]">{admin.email}</span></div></footer>
    </div>
  );
}
