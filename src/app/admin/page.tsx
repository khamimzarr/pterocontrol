export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decideUser, logout } from "@/lib/actions/auth-actions";

function TopNav({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[16px] bg-[rgba(5,6,15,0.65)] border-b border-[rgba(186,215,247,0.08)]">
      <div className="mx-auto max-w-[1200px] px-6 h-[52px] flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full grid place-items-center bg-[#b64400] text-white text-[11px] font-bold">◈</span>
          <span className="font-medium text-[15px] tracking-[-0.02em] text-[#d1e4fa]">PteroControl</span>
          <span className="px-2 py-0.5 rounded-full bg-[#663af3] text-white text-[10px] font-medium tracking-[0.06em] uppercase">ADMIN</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#c7d3ea]">
          <Link href="/dashboard" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Dasbor</Link>
          <Link href="/panels" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-[rgba(186,214,247,0.06)] transition-colors">Panel</Link>
          <Link href="/admin" className="px-3 py-1.5 rounded-full bg-[rgba(199,211,234,0.12)] text-white">Admin</Link>
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
        <div className="absolute inset-0 halo opacity-[0.30] pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-[1200px] px-6 md:px-10 py-8">
          <Eyebrow>Admin · Inbox</Eyebrow>
          <h1 className="mt-3 font-[var(--font-aeonikpro)] font-medium text-[28px] leading-none tracking-[-0.02em] text-[#d8ecf8]">Permintaan menunggu.</h1>
          <p className="mt-2 text-[13px] leading-[1.5] text-[#9da7ba]">Setujui atau tolak user. Hanya <span className="text-[#c7d3ea] font-mono text-[12px]">ADMIN_EMAIL</span> yang bisa akses halaman ini.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(228,109,76,0.12)] border border-[rgba(228,109,76,0.18)] text-[#e46d4c] text-[11px] font-medium px-3 py-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#e46d4c] animate-pulse-dot" />{pend} menunggu</span>
            <span className="inline-flex items-center rounded-full bg-[rgba(199,211,234,0.08)] border border-[rgba(186,215,247,0.08)] text-[11px] font-medium text-[#c7d3ea] px-3 py-1.5">{app?.length ?? 0} disetujui</span>
            <span className="inline-flex items-center rounded-full bg-[rgba(199,211,234,0.06)] border border-[rgba(186,215,247,0.06)] text-[11px] font-medium text-[#9da7ba] px-3 py-1.5">{rej} ditolak</span>
          </div>
        </div>
      </section>

      <section className="flex-1 py-6 bg-[#05060f]">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 space-y-3">
          {(!pending || pending.length === 0) ? (
            <div className="rounded-[16px] bg-[rgba(5,6,15,0.82)] border border-[rgba(186,215,247,0.08)] p-8 text-center">
              <div className="w-10 h-10 mx-auto rounded-full grid place-items-center bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.10)]"><span className="w-2 h-2 rounded-full bg-[#28c840]" /></div>
              <p className="mt-3 text-[11px] tracking-[0.08em] uppercase font-[var(--font-dotdigital)] text-[#9da7ba]">Kosong</p>
              <p className="font-[var(--font-aeonikpro)] font-medium text-[16px] text-white">Kotak kosong.</p>
              <p className="text-[13px] text-[#9da7ba]">Tidak ada yang menunggu.</p>
              <Link href="/dashboard" className="mt-4 inline-flex pill-ghost rounded-full px-5 py-2 text-[13px] font-medium text-white">Dasbor</Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {pending!.map((u) => (
                <div key={u.id} className="glass-card rounded-[16px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex gap-2 items-center flex-wrap">
                      <p className="font-medium text-[13px] truncate text-white">{u.email}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${u.status === "PENDING" ? "bg-[rgba(228,109,76,0.12)] text-[#e46d4c] border-[rgba(228,109,76,0.20)]" : "bg-[rgba(199,211,234,0.08)] text-[#9da7ba] border-[rgba(186,215,247,0.08)]"}`}>{u.status === "PENDING" ? "MENUNGGU" : "DITOLAK"}</span>
                      <span className="text-[11px] text-[#9da7ba] font-mono">{u.role}</span>
                    </div>
                    <p className="font-mono text-[11px] text-[#9da7ba] truncate mt-1">{u.id}</p>
                    <p className="text-[11px] text-[#9da7ba]">{new Date(u.created_at).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <form action={decideUser}><input type="hidden" name="userId" value={u.id} /><input type="hidden" name="action" value="APPROVE" /><button className="flash-violet rounded-full px-4 py-2 text-[12px] font-medium text-white">Setujui</button></form>
                    <form action={decideUser}><input type="hidden" name="userId" value={u.id} /><input type="hidden" name="action" value="REJECT" /><button className="pill-ghost rounded-full px-4 py-2 text-[12px] font-medium text-white">Tolak</button></form>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-[16px] bg-[#663af3] p-5 flex justify-between items-center gap-3 shadow-[0_8px_24px_rgba(102,58,243,0.35)]">
            <div>
              <p className="font-[var(--font-aeonikpro)] font-medium text-[14px] text-white">Approved → langsung bisa buka dasbor.</p>
              <p className="text-[12px] text-white/70">PENDING tidak bisa akses /dashboard & /panels.</p>
            </div>
            <Link href="/dashboard" className="shrink-0 inline-flex rounded-full bg-white text-[#05060f] text-[12px] font-medium px-4 py-2 hover:bg-[#d1e4fa] transition-colors">Dasbor →</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[rgba(186,215,247,0.06)] bg-[rgba(186,214,247,0.015)] py-4"><div className="mx-auto max-w-[1200px] px-6 md:px-10 text-[11px] text-[#9da7ba]">Admin: <span className="text-[#c7d3ea]">{admin.email}</span> · <Link href="/dashboard" className="text-[#b6d9fc] hover:text-white">Dasbor</Link></div></footer>
    </div>
  );
}
