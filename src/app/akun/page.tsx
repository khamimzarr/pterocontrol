export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireApprovedUser } from "@/lib/auth";
import { changePassword, logout } from "@/lib/actions/auth-actions";

function TopNav({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  return (
    <nav className="sticky top-0 z-50 h-11 flex items-center justify-center bg-[#fafafc]/80 backdrop-blur-[20px] border-b border-black/[0.04]">
      <div className="w-full max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold text-[12px] tracking-[0.04em] text-[#1d1d1f]">◈ PteroControl</Link>
        <div className="hidden md:flex gap-6 text-[12px] text-[#1d1d1f]">
          <Link href="/dashboard" className="hover:text-[#707070]">Dasbor</Link><Link href="/panels" className="hover:text-[#707070]">Panel</Link>{isAdmin && <Link href="/admin" className="hover:text-[#707070]">Admin</Link>}<Link href="/akun" className="font-medium text-[#0071e3]">Akun</Link>
        </div>
        <div className="flex items-center gap-2"><span className="hidden sm:inline text-[11px] text-[#707070] truncate max-w-[120px]">{email}</span><form action={logout}><button className="rounded-full border border-[#d6d6d6] text-[12px] px-3 py-1.5">Keluar</button></form></div>
      </div>
    </nav>
  );
}

export default async function AkunPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const user = await requireApprovedUser();
  const sp = await searchParams;
  const success = sp.success === "1";
  let err: string | null = null;
  if (sp.error) err = sp.error === "pendek" ? "Min 8 karakter." : sp.error === "tidakcocok" ? "Konfirmasi tidak cocok." : decodeURIComponent(sp.error);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <TopNav email={user.email} isAdmin={user.role === "ADMIN"} />
      <section className="animate-up bg-white border-b border-[#e8e8ed]"><div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8"><p className="text-[11px] tracking-[0.04em] text-[#b64400]">{user.role} · {user.status}</p><h1 className="font-[var(--font-sf-pro-display)] font-semibold text-[28px] leading-none text-[#1d1d1f]">Akunmu.</h1><p className="mt-1 text-[13px] text-[#707070]">{user.email} · Ganti kata sandi di bawah.</p></div></section>
      <section className="flex-1 py-6">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="animate-up-1 max-w-[440px] rounded-[28px] bg-white p-6 border border-[#e8e8ed] hover-lift">
            <h2 className="font-semibold text-[17px] text-[#1d1d1f]">Ganti kata sandi</h2>
            <p className="text-[11px] text-[#707070]">Min 8 karakter · Langsung aktif.</p>
            {success && <div className="mt-4 rounded-[18px] bg-[#f0faf0] border border-[#c8e8c8] px-4 py-2.5 text-[13px] text-[#1a6b1a]">Berhasil! ✅</div>}
            {err && <div className="mt-4 rounded-[18px] bg-[#fff1f0] border border-[#ffd7d5] px-4 py-2.5 text-[13px] text-[#b64400]">{err}</div>}
            <form action={changePassword} className="mt-4 space-y-3">
              <label className="block"><span className="text-[11px] font-medium text-[#1d1d1f]">Baru</span><input name="newPassword" type="password" required minLength={8} placeholder="Min 8 karakter" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-2.5 text-[14px] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" /></label>
              <label className="block"><span className="text-[11px] font-medium text-[#1d1d1f]">Ulangi</span><input name="confirmPassword" type="password" required minLength={8} placeholder="Ulangi" className="mt-1 w-full rounded-full border border-[#d6d6d6] px-4 py-2.5 text-[14px] focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/15 outline-none" /></label>
              <button type="submit" className="w-full rounded-full bg-[#0071e3] text-white text-[14px] font-medium py-2.5 hover:bg-[#0077ed] transition-all hover:scale-[1.01]">Simpan</button>
            </form>
            <p className="mt-4 text-center text-[12px]"><Link href="/dashboard" className="text-[#0066cc] hover:underline">← Dasbor</Link></p>
          </div>
          <div className="mt-4 max-w-[440px] rounded-[28px] bg-[#1d1d1f] p-5 text-white text-[11px]"><p className="text-white/60">ID</p><p className="font-mono break-all text-white/90">{user.id}</p></div>
        </div>
      </section>
      <footer className="bg-white border-t py-4"><div className="max-w-[1200px] mx-auto px-6 md:px-10 text-[11px] text-[#707070]"><Link href="/dashboard" className="hover:text-[#1d1d1f]">Dasbor</Link> · RLS</div></footer>
    </div>
  );
}
