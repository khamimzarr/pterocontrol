export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { decideUser, logout } from "@/lib/actions/auth-actions";

function TopNav({ email }: { email: string }) {
  return (
    <nav className="sticky top-0 z-50 h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link href="/admin" className="font-semibold text-[12px] tracking-[0.04em] text-[#1d1d1f]">◈ PteroControl <span className="rounded-full bg-[#b64400] text-white px-2 py-0.5 text-[10px]">ADMIN</span></Link>
        <div className="hidden md:flex gap-6 text-[12px] text-[#1d1d1f]"><Link href="/dashboard" className="hover:text-[#707070]">Dasbor</Link><Link href="/panels" className="hover:text-[#707070]">Panel</Link><Link href="/admin" className="font-medium text-[#0071e3]">Admin</Link><Link href="/akun" className="hover:text-[#707070]">Akun</Link></div>
        <div className="flex items-center gap-2"><span className="hidden sm:inline text-[11px] text-[#707070] truncate max-w-[120px]">{email}</span><form action={logout}><button className="rounded-full border border-[#d6d6d6] text-[12px] px-3 py-1.5">Keluar</button></form></div>
      </div>
    </nav>
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
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <TopNav email={admin.email} />
      <section className="animate-up bg-white border-b border-[#e8e8ed]"><div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8"><p className="text-[11px] tracking-[0.04em] text-[#b64400]">Admin · Inbox</p><h1 className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none text-[#1d1d1f]">Permintaan menunggu.</h1><p className="mt-1 text-[13px] text-[#707070]">Setujui/tolak user. Cuma ADMIN_EMAIL.</p><div className="mt-3 flex gap-2"><span className="rounded-full bg-[#fff1f0] border border-[#ffd7d5] text-[#b64400] text-[11px] font-medium px-3 py-1">{pend} menunggu</span><span className="rounded-full bg-white border text-[11px] px-3 py-1 text-[#707070]">{app?.length ?? 0} disetujui</span><span className="rounded-full bg-white border text-[11px] px-3 py-1 text-[#707070]">{rej} ditolak</span></div></div></section>
      <section className="flex-1 py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 space-y-3">
          {(!pending || pending.length === 0) ? (
            <div className="animate-up-1 rounded-[28px] bg-white p-8 border border-[#e8e8ed] text-center hover-lift"><p className="text-[11px] text-[#707070]">Kosong</p><p className="font-semibold text-[#1d1d1f]">Kotak kosong.</p><p className="text-[13px] text-[#707070]">Nggak ada yang nunggu, bung.</p><Link href="/dashboard" className="mt-4 inline-flex rounded-full bg-[#1d1d1f] text-white text-[13px] px-5 py-2">Dasbor</Link></div>
          ) : (
            <div className="grid gap-3 stagger">
              {pending!.map((u) => (
                <div key={u.id} className="rounded-[28px] bg-white p-5 border border-[#e8e8ed] flex flex-col md:flex-row md:items-center justify-between gap-3 hover-lift">
                  <div className="min-w-0"><div className="flex gap-2 items-center"><p className="font-medium text-[13px] truncate text-[#1d1d1f]">{u.email}</p><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${u.status === "PENDING" ? "bg-[#fff1f0] text-[#b64400] border-[#ffd7d5]" : "bg-[#f5f5f7] text-[#707070]"}`}>{u.status === "PENDING" ? "MENUNGGU" : "DITOLAK"}</span></div><p className="font-mono text-[11px] text-[#707070] truncate">{u.id}</p><p className="text-[11px] text-[#707070]">{new Date(u.created_at).toLocaleString("id-ID")}</p></div>
                  <div className="flex gap-2 shrink-0"><form action={decideUser}><input type="hidden" name="userId" value={u.id} /><input type="hidden" name="action" value="APPROVE" /><button className="rounded-full bg-[#0071e3] text-white text-[12px] px-4 py-2 hover:bg-[#0077ed] transition-all hover:scale-[1.02]">Setujui</button></form><form action={decideUser}><input type="hidden" name="userId" value={u.id} /><input type="hidden" name="action" value="REJECT" /><button className="rounded-full border text-[12px] px-4 py-2 hover:bg-[#f5f5f7]">Tolak</button></form></div>
                </div>
              ))}
            </div>
          )}
          <div className="rounded-[28px] bg-[#1d1d1f] p-5 text-white flex justify-between items-center gap-3 hover-lift"><p className="font-semibold text-[13px]">Approved → langsung bisa buka dasbor.</p><Link href="/dashboard" className="shrink-0 rounded-full bg-white text-[#1d1d1f] text-[12px] px-4 py-2">Dasbor</Link></div>
        </div>
      </section>
      <footer className="bg-white border-t py-4"><div className="max-w-[1200px] mx-auto px-6 md:px-10 text-[11px] text-[#707070]">Admin: {admin.email} · <Link href="/dashboard" className="hover:text-[#1d1d1f]">Dasbor</Link></div></footer>
    </div>
  );
}
